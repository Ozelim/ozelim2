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
  // Unique index so we can upsert mock resorts by name
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_resorts_name ON resorts(name)`;
  await sql`
    CREATE TABLE IF NOT EXISTS favorites (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      resort_id  INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, resort_id)
    )
  `;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ favorites: [] });

    await ensureTables();

    const rows = await sql`
      SELECT r.id, r.name, r.location, r.hero_image, r.rating, r.category, r.price_from
      FROM favorites f
      JOIN resorts r ON r.id = f.resort_id
      WHERE f.user_id = ${user.id}
      ORDER BY f.created_at DESC
    `;

    return NextResponse.json({ favorites: rows });
  } catch (err) {
    console.error("GET /api/favorites error:", err);
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const body = await request.json();
    const { resort_id, resort_data } = body;

    await ensureTables();

    let finalResortId = resort_id;

    if (!finalResortId && resort_data?.name) {
      // Upsert the resort by name so the static /resort page can also save favorites
      const [row] = await sql`
        INSERT INTO resorts (name, location, hero_image, rating, category, price_from)
        VALUES (
          ${resort_data.name},
          ${resort_data.location ?? null},
          ${resort_data.hero_image ?? null},
          ${resort_data.rating ?? 0},
          ${resort_data.category ?? "Курорт · Казахстан"},
          ${resort_data.price_from ?? 0}
        )
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `;
      finalResortId = row.id;
    }

    if (!finalResortId) {
      return NextResponse.json({ error: "resort_id или resort_data обязательны" }, { status: 400 });
    }

    await sql`
      INSERT INTO favorites (user_id, resort_id)
      VALUES (${user.id}, ${finalResortId})
      ON CONFLICT (user_id, resort_id) DO NOTHING
    `;

    return NextResponse.json({ ok: true, resort_id: finalResortId });
  } catch (err) {
    console.error("POST /api/favorites error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const resort_id = searchParams.get("resort_id");
    if (!resort_id) return NextResponse.json({ error: "resort_id обязателен" }, { status: 400 });

    await ensureTables();

    await sql`DELETE FROM favorites WHERE user_id = ${user.id} AND resort_id = ${resort_id}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}