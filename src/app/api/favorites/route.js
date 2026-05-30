import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

function firstGalleryImage(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return null;
  const first = gallery[0];
  if (typeof first === "string") return first;
  return first?.src || first?.url || null;
}

function intOrNull(v) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const dynamic = "force-dynamic";

// GET /api/favorites — туры + направления, объединённые в один список.
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ favorites: [] });

    const { data, error } = await sb
      .from("favorites")
      .select(
        "id, created_at, tour_id, resort_direction_id, " +
          "tours(id, title, country, city, gallery, price), " +
          "resort_directions(id, name, region, image_url)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const favorites = (data ?? []).flatMap((row) => {
      if (row.tour_id && row.tours) {
        const t = row.tours;
        return [
          {
            id: t.id,
            kind: "tour",
            name: t.title,
            hero_image: firstGalleryImage(t.gallery),
            location: [t.country, t.city].filter(Boolean).join(", ") || "Казахстан",
            rating: 0,
            price_from: Number(t.price) || 0,
          },
        ];
      }
      if (row.resort_direction_id && row.resort_directions) {
        const d = row.resort_directions;
        return [
          {
            id: d.id,
            kind: "direction",
            name: d.name,
            hero_image: d.image_url || null,
            location: d.region || "Казахстан",
            rating: 0,
          },
        ];
      }
      return [];
    });

    return NextResponse.json({ favorites });
  } catch (err) {
    console.error("GET /api/favorites error:", err);
    return NextResponse.json({ favorites: [] });
  }
}

// POST /api/favorites  body: { tour_id } | { direction_id }
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const body = await request.json();
    const tour_id = intOrNull(body.tour_id ?? body.resort_id);
    const direction_id = intOrNull(body.direction_id ?? body.resort_direction_id);

    if (!tour_id && !direction_id) {
      return NextResponse.json(
        { error: "tour_id или direction_id обязателен" },
        { status: 400 },
      );
    }
    if (tour_id && direction_id) {
      return NextResponse.json(
        { error: "Только одно: tour_id или direction_id" },
        { status: 400 },
      );
    }

    // Сначала проверяем, нет ли уже такого избранного — чтобы избежать upsert
    // на partial unique индекс (user_id, resort_direction_id) WHERE … IS NOT NULL,
    // который PostgREST не всегда корректно матчит через onConflict.
    const existsQuery = sb.from("favorites").select("id").eq("user_id", user.id);
    const { data: existing, error: existsErr } = await (tour_id
      ? existsQuery.eq("tour_id", tour_id)
      : existsQuery.eq("resort_direction_id", direction_id)
    ).maybeSingle();
    if (existsErr) throw existsErr;
    if (existing) return NextResponse.json({ ok: true, already: true });

    const row = tour_id
      ? { user_id: user.id, tour_id }
      : { user_id: user.id, resort_direction_id: direction_id };

    const { error } = await sb.from("favorites").insert(row);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/favorites error:", err?.message || err, err?.details || "");
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// DELETE /api/favorites?tour_id=X | ?direction_id=X
export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const tour_id = intOrNull(
      searchParams.get("tour_id") ?? searchParams.get("resort_id"),
    );
    const direction_id = intOrNull(
      searchParams.get("direction_id") ?? searchParams.get("resort_direction_id"),
    );

    if (!tour_id && !direction_id) {
      return NextResponse.json(
        { error: "tour_id или direction_id обязателен" },
        { status: 400 },
      );
    }

    const q = sb.from("favorites").delete().eq("user_id", user.id);
    const { error } = tour_id
      ? await q.eq("tour_id", tour_id)
      : await q.eq("resort_direction_id", direction_id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
