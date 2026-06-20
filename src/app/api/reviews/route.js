import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { notifyAdmins } from "@/lib/notifications";
import sb from "@/lib/supabase";

function firstGalleryImage(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return null;
  const first = gallery[0];
  if (typeof first === "string") return first;
  return first?.src || first?.url || null;
}

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reviews?tour_id=X  — visible-отзывы для публичной страницы тура
// GET /api/reviews?my=true     — все отзывы текущего юзера (любого статуса)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tour_id") ?? searchParams.get("resort_id");
  const my = searchParams.get("my");

  const user = await getCurrentUser();

  try {
    if (my) {
      if (!user) return NextResponse.json({ reviews: [] });

      const { data, error } = await sb
        .from("reviews")
        .select(
          "id, rating, content, status, rejection_reason, reply, reply_at, created_at, tour_id, lead_id, tours(title, country, city, gallery)",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviews = (data ?? []).map(({ tours: tour, ...rv }) => ({
        id: rv.id,
        rating: rv.rating,
        text: rv.content,
        status: rv.status,
        rejection_reason: rv.rejection_reason,
        reply: rv.reply,
        reply_at: rv.reply_at,
        created_at: rv.created_at,
        tour_id: rv.tour_id,
        lead_id: rv.lead_id,
        resort_id: rv.tour_id, // legacy alias для существующего UI
        resort_name: tour?.title,
        hero_image: firstGalleryImage(tour?.gallery),
        location: [tour?.country, tour?.city].filter(Boolean).join(", "),
      }));

      return NextResponse.json({ reviews });
    }

    if (tourId) {
      const { data, error } = await sb
        .from("reviews")
        .select(
          "id, rating, content, reply, reply_at, created_at, user_id, users!reviews_user_id_fkey(name, surname)",
        )
        .eq("tour_id", tourId)
        .eq("status", "visible")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviews = (data ?? []).map(({ users: u, ...rv }) => {
        const userName = [u?.name, u?.surname].filter(Boolean).join(" ").trim();
        return {
          id: rv.id,
          rating: rv.rating,
          text: rv.content,
          content: rv.content, // совместимость с TourClient
          reply: rv.reply,
          reply_at: rv.reply_at,
          created_at: rv.created_at,
          user_id: rv.user_id,
          user_name: userName || "Гость",
          author_name: userName || "Гость",
        };
      });

      return NextResponse.json({ reviews, currentUserId: user?.id ?? null });
    }

    return NextResponse.json({ reviews: [], currentUserId: user?.id ?? null });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: [], currentUserId: user?.id ?? null });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/reviews
//   body: { lead_id, rating, text }
//
// Создаёт новый отзыв со status='pending'. Требования:
//   - user залогинен
//   - lead принадлежит этому user, kind='tour_booking', status='done'
//   - tour_id вычисляется из lead (а не передаётся клиентом — защита от подделки)
//   - один отзыв на одну заявку (UNIQUE constraint)
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const body = await request.json();
    const leadId = body.lead_id;
    const rating = Number(body.rating);
    const text = (body.text || "").trim();

    if (!leadId || !rating || !text) {
      return NextResponse.json(
        { error: "lead_id, rating и текст обязательны" },
        { status: 400 },
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating должен быть от 1 до 5" }, { status: 400 });
    }
    if (text.length < 10 || text.length > 2000) {
      return NextResponse.json(
        { error: "Текст отзыва должен быть от 10 до 2000 символов" },
        { status: 400 },
      );
    }

    // Проверяем заявку: принадлежит этому юзеру, нужного типа, выполнена.
    const { data: lead, error: leadErr } = await sb
      .from("leads")
      .select("id, user_id, tour_id, kind, status, tours(title)")
      .eq("id", leadId)
      .maybeSingle();

    if (leadErr) throw leadErr;
    if (!lead) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    if (String(lead.user_id) !== String(user.id)) {
      return NextResponse.json({ error: "Это не ваша заявка" }, { status: 403 });
    }
    if (lead.kind !== "tour_booking") {
      return NextResponse.json(
        { error: "Отзыв можно оставить только на заявку по туру" },
        { status: 400 },
      );
    }
    if (lead.status !== "done") {
      return NextResponse.json(
        { error: "Оставить отзыв можно только после завершения тура" },
        { status: 400 },
      );
    }
    if (!lead.tour_id) {
      return NextResponse.json({ error: "У заявки нет связанного тура" }, { status: 400 });
    }

    const authorName =
      [user.name, user.surname].filter(Boolean).join(" ").trim() || user.email;

    const { data: row, error: insertErr } = await sb
      .from("reviews")
      .insert({
        user_id: user.id,
        tour_id: lead.tour_id,
        lead_id: lead.id,
        rating,
        content: text,
        author_name: authorName,
        status: "pending",
      })
      .select("id, rating, content, status, created_at, tour_id, lead_id")
      .single();

    if (insertErr) {
      // Уникальный конфликт — отзыв на эту заявку уже есть.
      if (insertErr.code === "23505") {
        return NextResponse.json(
          { error: "Вы уже оставили отзыв по этой заявке" },
          { status: 409 },
        );
      }
      throw insertErr;
    }

    // Уведомляем админов о новом отзыве на модерацию (best-effort).
    notifyAdmins("admin.review.new", {
      review_id: row.id,
      tour_id: row.tour_id,
      tourTitle: lead.tours?.title || null,
      user_id: user.id,
      userName: authorName,
      rating: row.rating,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      review: {
        ...row,
        text: row.content,
        user_name: authorName,
      },
    });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/reviews  body: { id, rating, text }
//   Редактирование своего отзыва. После правки уходит обратно в 'pending'.
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const body = await request.json();
    const id = body.id;
    const rating = body.rating != null ? Number(body.rating) : undefined;
    const text = body.text != null ? String(body.text).trim() : undefined;

    if (!id) return NextResponse.json({ error: "id обязателен" }, { status: 400 });

    // Опубликованный (visible) отзыв править нельзя — он уже на сайте.
    const { data: current } = await sb
      .from("reviews")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!current) return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
    if (current.status === "visible") {
      return NextResponse.json(
        { error: "Опубликованный отзыв нельзя редактировать" },
        { status: 409 },
      );
    }

    const patch = { status: "pending", rejection_reason: null };
    if (rating != null) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: "rating должен быть от 1 до 5" }, { status: 400 });
      }
      patch.rating = rating;
    }
    if (text != null) {
      if (text.length < 10 || text.length > 2000) {
        return NextResponse.json(
          { error: "Текст отзыва должен быть от 10 до 2000 символов" },
          { status: 400 },
        );
      }
      patch.content = text;
    }

    const { data: row, error } = await sb
      .from("reviews")
      .update(patch)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, rating, content, status, created_at, tour_id, lead_id, tours(title)")
      .maybeSingle();

    if (error) throw error;
    if (!row) return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });

    const authorName =
      [user.name, user.surname].filter(Boolean).join(" ").trim() || user.email;

    notifyAdmins("admin.review.new", {
      review_id: row.id,
      tour_id: row.tour_id,
      tourTitle: row.tours?.title || null,
      user_id: user.id,
      userName: authorName,
      rating: row.rating,
      edited: true,
    }).catch(() => {});

    const { tours: _t, ...reviewOut } = row;
    return NextResponse.json({ ok: true, review: { ...reviewOut, text: reviewOut.content } });
  } catch (err) {
    console.error("PATCH /api/reviews error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/reviews?id=X
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id обязателен" }, { status: 400 });

    // Опубликованный (visible) отзыв удалять нельзя.
    const { data: current } = await sb
      .from("reviews")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!current) return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
    if (current.status === "visible") {
      return NextResponse.json(
        { error: "Опубликованный отзыв нельзя удалить" },
        { status: 409 },
      );
    }

    const { error } = await sb
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
