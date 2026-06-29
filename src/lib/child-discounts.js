// Детские скидки по возрастным группам. Общая логика для форм и отображения.
// Порядок опций задан заказчиком: без скидки, бесплатно, 3, 5, 7, 8, 10, 15, 20, 25, 30.

export const CHILD_DISCOUNT_OPTIONS = [
  { value: "", label: "Без скидки" },
  { value: "free", label: "Бесплатно" },
  { value: 3, label: "3%" },
  { value: 5, label: "5%" },
  { value: 7, label: "7%" },
  { value: 8, label: "8%" },
  { value: 10, label: "10%" },
  { value: 15, label: "15%" },
  { value: 20, label: "20%" },
  { value: 25, label: "25%" },
  { value: 30, label: "30%" },
];

// Возраст «детям до N лет»: 3..18.
export const CHILD_AGE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 3);

// Цена ребёнка после скидки. 'free' → 0; число → процент; иначе базовая цена.
export function childDiscountedPrice(basePrice, discount) {
  const p = Number(basePrice);
  if (!Number.isFinite(p) || p < 0) return null;
  if (discount === "free") return 0;
  const pct = Number(discount);
  if (Number.isInteger(pct) && pct >= 1 && pct <= 30) return Math.round(p * (1 - pct / 100));
  return p;
}

// Подпись группы для витрины: «Всем детям до 18» как есть; «Детям до» → «Детям до N лет».
export function childGroupLabel(g) {
  if (!g) return "";
  if (g.label === "Всем детям до 18") return "Всем детям до 18";
  if (g.label === "Детям до") return `Детям до ${g.ageMax} лет`;
  return g.label || `Детям до ${g.ageMax} лет`;
}

export function childDiscountLabel(discount) {
  if (discount === "free") return "бесплатно";
  const pct = Number(discount);
  if (Number.isInteger(pct) && pct > 0) return `−${pct}%`;
  return "без скидки";
}

// Нормализация массива групп с клиента → в БД. Отбрасывает мусор.
export function normalizeChildDiscounts(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const g of raw) {
    if (!g || typeof g !== "object") continue;
    const ageMax = Number(g.ageMax);
    if (!Number.isInteger(ageMax) || ageMax < 3 || ageMax > 18) continue;
    let discount = g.discount;
    if (discount === "free") {
      // ok
    } else {
      const pct = Number(discount);
      discount = Number.isInteger(pct) && pct >= 1 && pct <= 30 ? pct : null;
    }
    out.push({
      label: typeof g.label === "string" ? g.label.slice(0, 120) : "",
      ageMax,
      discount,
    });
  }
  return out;
}
