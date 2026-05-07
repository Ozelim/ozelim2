import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensureResortTables } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    await ensureResortTables();
    const { id } = await params;
    const { name, base_id, price_adult, price_child } = await request.json();
    const rows = await sql`
      UPDATE resort_services
      SET name        = COALESCE(${name ?? null}, name),
          base_id     = COALESCE(${base_id ?? null}, base_id),
          price_adult = COALESCE(${
            price_adult === undefined || price_adult === null
              ? null
              : Number(price_adult)
          }, price_adult),
          price_child = COALESCE(${
            price_child === undefined || price_child === null
              ? null
              : Number(price_child)
          }, price_child)
      WHERE id = ${id}
      RETURNING id, base_id, name, price_adult, price_child
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    return NextResponse.json({ service: rows[0] });
  } catch (err) {
    console.error("PATCH /api/resort-services/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await ensureResortTables();
    const { id } = await params;
    await sql`DELETE FROM resort_services WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/resort-services/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
