import { NextResponse } from "next/server";
import { getPackagePrices } from "@/lib/package-prices";

export const dynamic = "force-dynamic";

// Публичные цены пакетов для клиентских компонентов (профиль, бейджи).
export async function GET() {
  const prices = await getPackagePrices();
  return NextResponse.json({ prices });
}
