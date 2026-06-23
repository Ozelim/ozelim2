// =============================================================================
// Партнёрская скидка OzElim — единый источник правды по математике.
//
// Используется и на сервере (POST /api/leads, серверные страницы тура/направления),
// и на клиенте (<PartnerPrice>, калькулятор) — поэтому здесь только чистые функции,
// без React. Так цифры гарантированно совпадают везде: витрина, калькулятор, заявка.
//
// Правило витрины (выбор пользователя — «вариант B»):
//   - аноним          → только теизер «−X% для партнёров», без суммы;
//   - любой залогинен  → видит конкретную цену со скидкой.
// Правило заявки:
//   - фактическую «замороженную» цену со скидкой получает ТОЛЬКО реальный партнёр
//     (pocket_type ∈ family/agent/corporate); basic-юзеру пишем обычную цену.
// =============================================================================

export const PARTNER_POCKETS = new Set(["family", "agent", "corporate"]);

export function isPartner(user) {
  return !!user && PARTNER_POCKETS.has(user.pocket_type);
}

// Нормализует процент: целое 10..50, иначе null (скидки нет). Зеркалит CHECK в БД.
export function normalizePct(pct) {
  const n = Number(pct);
  return Number.isInteger(n) && n >= 10 && n <= 50 ? n : null;
}

// Единое округление для всех мест расчёта.
export function discountedPrice(price, pct) {
  const p = Number(price);
  const d = normalizePct(pct);
  if (!Number.isFinite(p) || p <= 0 || !d) return null;
  return Math.round(p * (1 - d / 100));
}

// Дескриптор для рендера витрины. loading=true → «plain» (обычная цена), чтобы
// залогиненный не увидел вспышку теизера, пока грузится /api/auth/me.
export function partnerView({ price, pct, loggedIn, loading = false }) {
  const d = normalizePct(pct);
  const now = discountedPrice(price, d);
  if (!d || now == null) return { mode: "plain" };
  if (loading) return { mode: "plain" };
  if (loggedIn) return { mode: "discounted", pct: d, was: Number(price), now };
  return { mode: "teaser", pct: d };
}

// Снимок цены для leads.data.partner — считается на сервере при подаче заявки.
// lines — массив тарифов [{ label, price }] (взрослый/детский для тура,
// взрослый/молодёжь/детский для направления, «Итого» для калькулятора).
// Фактическую скидку получает только реальный партнёр; строки с пустой/нулевой
// ценой пропускаем. Для каждой строки кладём original + final.
export function partnerSnapshot({ lines, pct, user }) {
  const partner = isPartner(user);
  const d = normalizePct(pct);
  const snap = {
    isPartner: partner,
    pocketType: user?.pocket_type ?? null,
  };
  if (partner && d && Array.isArray(lines)) {
    const out = [];
    for (const ln of lines) {
      const original = Number(ln?.price);
      const final = discountedPrice(original, d);
      if (final == null) continue; // нет цены/скидки — строку не пишем
      out.push({ label: ln.label, original, final });
    }
    if (out.length) {
      snap.discountPct = d;
      snap.lines = out;
    }
  }
  return snap;
}
