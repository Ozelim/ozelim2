import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensureResortTables } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    await ensureResortTables();
    const { id } = await params;
    const { name, sort_order } = await request.json();
    const rows = await sql`
      UPDATE resort_directions
      SET name       = COALESCE(${name ?? null}, name),
          sort_order = COALESCE(${sort_order ?? null}, sort_order)
      WHERE id = ${id}
      RETURNING id, name, sort_order
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    return NextResponse.json({ direction: rows[0] });
  } catch (err) {
    console.error("PATCH /api/resort-directions/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await ensureResortTables();
    const { id } = await params;
    await sql`DELETE FROM resort_directions WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/resort-directions/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
