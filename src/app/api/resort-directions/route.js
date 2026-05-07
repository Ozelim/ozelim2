import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensureResortTables, listDirections } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const directions = await listDirections();
    return NextResponse.json({ directions });
  } catch (err) {
    console.error("GET /api/resort-directions error:", err);
    return NextResponse.json({ directions: [] });
  }
}

export async function POST(request) {
  try {
    await ensureResortTables();
    const { name, sort_order } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "name обязателен" }, { status: 400 });
    }
    const rows = await sql`
      INSERT INTO resort_directions (name, sort_order)
      VALUES (${name.trim()}, ${sort_order ?? 0})
      RETURNING id, name, sort_order
    `;
    return NextResponse.json({ direction: rows[0] });
  } catch (err) {
    console.error("POST /api/resort-directions error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
