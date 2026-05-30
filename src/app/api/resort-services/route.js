import { NextResponse } from "next/server";
import { listServices } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

// GET остаётся публичным — используется визардом /trips/tour-selection.
// Write-операции переехали в ozelim-admin2 (раздел «Калькулятор туров»).
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
