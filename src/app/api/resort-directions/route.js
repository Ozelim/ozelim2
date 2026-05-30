import { NextResponse } from "next/server";
import { listDirections } from "@/lib/resort-directions";

export const dynamic = "force-dynamic";

// GET остаётся публичным — используется фильтром /trips, визардом подбора тура
// и формой заявок. Write-операции живут в ozelim-admin2 (раздел «Направления»).
export async function GET() {
  try {
    const directions = await listDirections();
    return NextResponse.json({ directions });
  } catch (err) {
    console.error("GET /api/resort-directions error:", err);
    return NextResponse.json({ directions: [] });
  }
}
