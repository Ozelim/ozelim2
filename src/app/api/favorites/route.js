import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sql from "@/lib/db";

// `resorts` is owned by the main admin panel. We only own `favorites`.
async function ensureFavoritesTable() {
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

    await ensureFavoritesTable();

    const rows = await sql`
      SELECT r.id,
             r.name,
             COALESCE(r.images->>0, NULL) AS hero_image,
             COALESCE(r.region, r.resort_area, 'Казахстан') AS location,
             COALESCE(r.hotel_class, 'Курорт') AS category,
             COALESCE((
               SELECT ROUND(AVG(rating)::numeric, 1)
               FROM reviews
               WHERE resort_id = r.id
             ), 0) AS rating,
             COALESCE(r.base_price, 0) AS price_from
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

    const { resort_id } = await request.json();
    if (!resort_id) {
      return NextResponse.json({ error: "resort_id обязателен" }, { status: 400 });
    }

    await ensureFavoritesTable();

    await sql`
      INSERT INTO favorites (user_id, resort_id)
      VALUES (${user.id}, ${resort_id})
      ON CONFLICT (user_id, resort_id) DO NOTHING
    `;

    return NextResponse.json({ ok: true, resort_id });
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

    await ensureFavoritesTable();

    await sql`DELETE FROM favorites WHERE user_id = ${user.id} AND resort_id = ${resort_id}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
