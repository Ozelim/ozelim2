import { NextResponse } from "next/server";
import { listBases } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

// GET остаётся публичным — используется визардом /trips/tour-selection.
// Write-операции переехали в ozelim-admin2 (раздел «Калькулятор туров»).
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
