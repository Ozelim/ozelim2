import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensureResortTables, listServices } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const baseId = searchParams.get("baseId");
    const services = await listServices(baseId ? Number(baseId) : null);
    return NextResponse.json({ services });
  } catch (err) {
    console.error("GET /api/resort-services error:", err);
    return NextResponse.json({ services: [] });
  }
}

export async function POST(request) {
  try {
    await ensureResortTables();
    const { name, base_id, price_adult, price_child } = await request.json();
    if (!name || !name.trim() || !base_id) {
      return NextResponse.json(
        { error: "name и base_id обязательны" },
        { status: 400 },
      );
    }
    const rows = await sql`
      INSERT INTO resort_services (base_id, name, price_adult, price_child)
      VALUES (
        ${base_id},
        ${name.trim()},
        ${Number(price_adult) || 0},
        ${Number(price_child) || 0}
      )
      RETURNING id, base_id, name, price_adult, price_child
    `;
    return NextResponse.json({ service: rows[0] });
  } catch (err) {
    console.error("POST /api/resort-services error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
