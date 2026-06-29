import sb from "@/lib/supabase";

// Дефолты на случай пустой БД/ошибки — совпадают с исходными значениями mockData.
export const DEFAULT_PACKAGE_PRICES = { family: 30000, agent: 45000, corporate: 200000 };

// Цены пакетов из БД (задаются админом на главной admin2). Возвращает
// { family, agent, corporate } числами.
export async function getPackagePrices() {
  try {
    const { data } = await sb.from("package_prices").select("pocket_type, price");
    const out = { ...DEFAULT_PACKAGE_PRICES };
    for (const r of data ?? []) {
      if (r.pocket_type in out) out[r.pocket_type] = Number(r.price);
    }
    return out;
  } catch {
    return { ...DEFAULT_PACKAGE_PRICES };
  }
}

import { fmtPrice } from "@/lib/format-price";

export function formatPackagePrice(n) {
  return fmtPrice(n);
}
