import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensureResortTables, listBases } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const directionId = searchParams.get("directionId");
    const bases = await listBases(directionId ? Number(directionId) : null);
    return NextResponse.json({ bases });
  } catch (err) {
    console.error("GET /api/resort-bases error:", err);
    return NextResponse.json({ bases: [] });
  }
}

export async function POST(request) {
  try {
    await ensureResortTables();
    const { name, direction_id } = await request.json();
    if (!name || !name.trim() || !direction_id) {
      return NextResponse.json(
        { error: "name и direction_id обязательны" },
        { status: 400 },
      );
    }
    const rows = await sql`
      INSERT INTO resort_bases (direction_id, name)
      VALUES (${direction_id}, ${name.trim()})
      RETURNING id, direction_id, name
    `;
    return NextResponse.json({ base: rows[0] });
  } catch (err) {
    console.error("POST /api/resort-bases error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
