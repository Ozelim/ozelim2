import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sql from "@/lib/db";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS resorts (
      id               SERIAL PRIMARY KEY,
      name             TEXT NOT NULL,
      location         TEXT,
      category         TEXT DEFAULT 'Курорт · Казахстан',
      hero_image       TEXT,
      rating           NUMERIC(3,1) DEFAULT 0,
      review_count     INTEGER DEFAULT 0,
      price_from       INTEGER DEFAULT 0,
      room_count       INTEGER DEFAULT 0,
      procedures_count INTEGER DEFAULT 0,
      description      TEXT,
      gallery          JSONB DEFAULT '[]',
      address          TEXT,
      phone            TEXT,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_resorts_name ON resorts(name)`;
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      resort_id  INTEGER NOT NULL,
      rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      text       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, resort_id)
    )
  `;
}

export const dynamic = "force-dynamic";

// GET /api/reviews?resort_id=X  — reviews for a resort (with user names)
// GET /api/reviews?my=true       — current user's reviews (with resort info)
export async function GET(request) {
  try {
    await ensureTables();
    const { searchParams } = new URL(request.url);
    const resortId = searchParams.get("resort_id");
    const my = searchParams.get("my");

    if (my) {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ reviews: [] });
      const rows = await sql`
        SELECT rv.id, rv.rating, rv.text, rv.created_at, rv.resort_id,
               r.name AS resort_name, r.hero_image, r.location
        FROM reviews rv
        JOIN resorts r ON r.id = rv.resort_id
        WHERE rv.user_id = ${user.id}
        ORDER BY rv.created_at DESC
      `;
      return NextResponse.json({ reviews: rows });
    }

    if (resortId) {
      const user = await getCurrentUser();
      const rows = await sql`
        SELECT rv.id, rv.rating, rv.text, rv.created_at, rv.user_id,
               u.name AS user_name
        FROM reviews rv
        JOIN users u ON u.id = rv.user_id
        WHERE rv.resort_id = ${resortId}
        ORDER BY rv.created_at DESC
      `;
      return NextResponse.json({ reviews: rows, currentUserId: user?.id ?? null });
    }

    return NextResponse.json({ reviews: [] });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: [] });
  }
}

// POST /api/reviews  body: { resort_id, rating, text }
// Upserts: one review per user per resort
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { resort_id, rating, text } = await request.json();
    if (!resort_id || !rating || !text?.trim()) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }

    await ensureTables();

    const [row] = await sql`
      INSERT INTO reviews (user_id, resort_id, rating, text)
      VALUES (${user.id}, ${resort_id}, ${rating}, ${text.trim()})
      ON CONFLICT (user_id, resort_id) DO UPDATE
        SET rating = EXCLUDED.rating, text = EXCLUDED.text, updated_at = NOW()
      RETURNING id, rating, text, created_at, user_id
    `;

    return NextResponse.json({ ok: true, review: { ...row, user_name: user.name } });
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

    await ensureTables();
    await sql`DELETE FROM reviews WHERE id = ${id} AND user_id = ${user.id}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
