import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sql from "@/lib/db";

// The `resorts` and `reviews` tables are owned by the main admin panel, so we
// only patch in the columns our UI needs — never recreate them with a
// different shape.
async function ensureReviewColumns() {
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id INTEGER`;
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`;
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_resort
    ON reviews(user_id, resort_id)
    WHERE user_id IS NOT NULL
  `;
}

export const dynamic = "force-dynamic";

// GET /api/reviews?resort_id=X  — reviews for a resort (with user names)
// GET /api/reviews?my=true       — current user's reviews (with resort info)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resortId = searchParams.get("resort_id");
  const my = searchParams.get("my");

  const user = await getCurrentUser();

  try {
    await ensureReviewColumns();

    if (my) {
      if (!user) return NextResponse.json({ reviews: [] });
      const rows = await sql`
        SELECT rv.id,
               rv.rating,
               rv.content AS text,
               rv.created_at,
               rv.resort_id,
               r.name AS resort_name,
               COALESCE(r.images->>0, NULL) AS hero_image,
               COALESCE(r.region, r.resort_area) AS location
        FROM reviews rv
        JOIN resorts r ON r.id = rv.resort_id
        WHERE rv.user_id = ${user.id}
        ORDER BY rv.created_at DESC NULLS LAST
      `;
      return NextResponse.json({ reviews: rows });
    }

    if (resortId) {
      const rows = await sql`
        SELECT rv.id,
               rv.rating,
               rv.content AS text,
               rv.created_at,
               rv.user_id,
               COALESCE(u.name, rv.author_name, 'Гость') AS user_name
        FROM reviews rv
        LEFT JOIN users u ON u.id = rv.user_id
        WHERE rv.resort_id = ${resortId}
          AND COALESCE(rv.status, 'approved') <> 'rejected'
        ORDER BY rv.created_at DESC NULLS LAST
      `;
      return NextResponse.json({ reviews: rows, currentUserId: user?.id ?? null });
    }

    return NextResponse.json({ reviews: [], currentUserId: user?.id ?? null });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: [], currentUserId: user?.id ?? null });
  }
}

// POST /api/reviews  body: { resort_id, rating, text }
// One review per user per resort — upsert on (user_id, resort_id).
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { resort_id, rating, text } = await request.json();
    if (!resort_id || !rating || !text?.trim()) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }

    await ensureReviewColumns();

    const authorName = [user.name, user.surname].filter(Boolean).join(" ").trim() || user.email;

    const [row] = await sql`
      INSERT INTO reviews (user_id, resort_id, rating, content, author_name, status, created_at, updated_at)
      VALUES (${user.id}, ${resort_id}, ${rating}, ${text.trim()}, ${authorName}, 'approved', NOW(), NOW())
      ON CONFLICT (user_id, resort_id) WHERE user_id IS NOT NULL DO UPDATE
        SET rating = EXCLUDED.rating,
            content = EXCLUDED.content,
            updated_at = NOW()
      RETURNING id, rating, content AS text, created_at, user_id
    `;

    return NextResponse.json({ ok: true, review: { ...row, user_name: authorName } });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// DELETE /api/reviews?id=X
export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id обязателен" }, { status: 400 });

    await ensureReviewColumns();
    await sql`DELETE FROM reviews WHERE id = ${id} AND user_id = ${user.id}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
