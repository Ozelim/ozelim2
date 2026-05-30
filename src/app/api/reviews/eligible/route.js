import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

function firstGalleryImage(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return null;
  const first = gallery[0];
  if (typeof first === "string") return first;
  return first?.src || first?.url || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reviews/eligible            — все done-заявки юзера без отзыва
// GET /api/reviews/eligible?tour_id=X  — только done-заявки на конкретный тур
//                                        без отзыва (для кнопки «Оставить отзыв»
//                                        на странице тура)
//
// Возвращает массив { lead_id, tour_id, tour_title, tour_image, processed_at }.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ eligible: [] });

  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tour_id");

  try {
    let q = sb
      .from("leads")
      .select(
        "id, tour_id, processed_at, created_at, tours(title, gallery, city, country)",
      )
      .eq("user_id", user.id)
      .eq("kind", "tour_booking")
      .eq("status", "done")
      .not("tour_id", "is", null)
      .order("processed_at", { ascending: false, nullsFirst: false });

    if (tourId) q = q.eq("tour_id", tourId);

    const { data: leads, error: leadsErr } = await q;
    if (leadsErr) throw leadsErr;

    if (!leads?.length) return NextResponse.json({ eligible: [] });

    // Исключаем заявки, по которым уже есть отзыв.
    const leadIds = leads.map((l) => l.id);
    const { data: existing, error: existingErr } = await sb
      .from("reviews")
      .select("lead_id")
      .eq("user_id", user.id)
      .in("lead_id", leadIds);
    if (existingErr) throw existingErr;

    const reviewed = new Set((existing ?? []).map((r) => String(r.lead_id)));
    const eligible = leads
      .filter((l) => !reviewed.has(String(l.id)))
      .map((l) => ({
        lead_id: l.id,
        tour_id: l.tour_id,
        tour_title: l.tours?.title || "Тур",
        tour_image: firstGalleryImage(l.tours?.gallery),
        location: [l.tours?.country, l.tours?.city].filter(Boolean).join(", "),
        processed_at: l.processed_at || l.created_at,
      }));

    return NextResponse.json({ eligible });
  } catch (err) {
    console.error("GET /api/reviews/eligible error:", err);
    return NextResponse.json({ eligible: [] });
  }
}
