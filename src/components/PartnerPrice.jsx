"use client";

// Цена с учётом партнёрской скидки для карточек/списков (главная, /trips и т.п.).
// Берёт пользователя из общего кэша useCurrentUser → 1 запрос /api/auth/me на всю
// страницу, сколько бы карточек ни было. Пока идёт загрузка — показываем обычную
// цену (режим plain), чтобы залогиненный не увидел вспышку теизера.
//
// На детальных страницах (TourClient/DirectionClient) скидку считаем на сервере
// и этот компонент не используем — там нет мерцания by design.

import { useCurrentUser } from "@/lib/use-current-user";
import { partnerView } from "@/lib/partner-pricing";
import { fmtNum } from "@/lib/format-price";

const fmt = (n) => fmtNum(n);

export default function PartnerPrice({
  price,
  pct,
  suffix = "₸",
  className = "",
  strikeClassName = "text-white/40 text-sm line-through",
  badgeClassName = "mt-0.5 inline-block text-[11px] font-medium text-amber-300",
  emptyFallback = "—",
}) {
  const { user, loading } = useCurrentUser();
  const hasPrice = Number(price) > 0;
  const view = partnerView({ price, pct, loggedIn: !!user, loading });

  if (!hasPrice) return <div className={className}>{emptyFallback}</div>;

  if (view.mode === "discounted") {
    return (
      <div>
        <div className="flex items-baseline gap-2">
          <span className={className}>{fmt(view.now)} {suffix}</span>
          <span className={strikeClassName}>{fmt(view.was)} {suffix}</span>
        </div>
        <span className={badgeClassName}>−{view.pct}% для партнёров</span>
      </div>
    );
  }

  if (view.mode === "teaser") {
    return (
      <div>
        <div className={className}>{fmt(price)} {suffix}</div>
        <span className={badgeClassName}>−{view.pct}% для партнёров</span>
      </div>
    );
  }

  return <div className={className}>{fmt(price)} {suffix}</div>;
}
