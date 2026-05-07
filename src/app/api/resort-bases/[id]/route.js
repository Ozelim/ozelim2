import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensureResortTables } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    await ensureResortTables();
    const { id } = await params;
    const { name, direction_id } = await request.json();
    const rows = await sql`
      UPDATE resort_bases
      SET name         = COALESCE(${name ?? null}, name),
          direction_id = COALESCE(${direction_id ?? null}, direction_id)
      WHERE id = ${id}
      RETURNING id, direction_id, name
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    return NextResponse.json({ base: rows[0] });
  } catch (err) {
    console.error("PATCH /api/resort-bases/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await ensureResortTables();
    const { id } = await params;
    await sql`DELETE FROM resort_bases WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/resort-bases/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
