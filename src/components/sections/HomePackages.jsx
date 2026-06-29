"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Gift, ArrowRight } from "lucide-react";
import { PACKAGE_FEATURES } from "@/lib/mockData";
import { fmtPrice as formatPackagePrice } from "@/lib/format-price";

// Цветовые акценты пакетов под тёмную тему главной.
const COLORS = {
  emerald: { text: "text-emerald-400", cell: "bg-emerald-500 text-white", btn: "from-emerald-500 to-emerald-400" },
  amber:   { text: "text-amber-400",   cell: "bg-amber-500 text-white",   btn: "from-amber-500 to-amber-400" },
  blue:    { text: "text-blue-400",    cell: "bg-blue-500 text-white",    btn: "from-blue-500 to-blue-400" },
};

// Куда ведёт кнопка пакета — вкладка «Пакеты» в профиле.
const DEST = "/profile?tab=packages";

function PackageCard({ info, color, onChoose, priceLabel }) {
  const c = COLORS[color] ?? COLORS.emerald;
  const footerPrice = priceLabel ?? info.footer?.price;
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 hover:border-(--site-accent)/30 transition-colors duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl leading-none">{info.icon}</span>
          <h3 className="text-white font-bold text-2xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {info.name}
          </h3>
        </div>
        {info.subtitle && <div className={`text-sm font-semibold ${c.text}`}>{info.subtitle}</div>}
      </div>

      {/* Features */}
      <ul className="space-y-1.5 flex-1">
        {info.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/60">
            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${c.text}`} />
            {f}
          </li>
        ))}
      </ul>

      {/* Реферальная программа (агент) */}
      {info.referral && (
        <div className="rounded-xl border border-[#1a6b1a]/25 bg-white/5 p-3 flex items-start gap-3">
          <div className={`shrink-0 rounded-lg px-2.5 py-1 text-base font-bold ${c.cell}`}>{info.referral.percent}</div>
          <p className="text-xs text-white/60 leading-snug flex items-start gap-1">
            <Gift className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/40" />
            {info.referral.text}
          </p>
        </div>
      )}

      {/* Годовая подписка + подвал (в столбик) */}
      <div>
        <div className="text-center text-white/40 text-xs mb-2">Годовая подписка</div>
        {info.footer && (
          <div className="flex flex-col gap-1.5">
            {[info.footer.people, footerPrice, info.footer.discount].map((cell, i) => (
              <div key={i} className={`rounded-lg px-3 py-2 text-center text-sm font-semibold leading-tight ${c.cell}`}>
                {cell}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onChoose}
        className={`w-full py-3 rounded-xl bg-linear-to-r ${c.btn} text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
      >
        Оформить пакет
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function HomePackages({ isAuthed = false, prices = null }) {
  const router = useRouter();

  // Залогинен → сразу в профиль на вкладку пакетов.
  // Не залогинен → на регистрацию, после неё вернём в профиль на пакеты.
  const choose = () => {
    if (isAuthed) router.push(DEST);
    else router.push(`/register?next=${encodeURIComponent(DEST)}`);
  };

  const entries = Object.entries(PACKAGE_FEATURES);

  return (
    <section className="pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[#FFD700] text-xs uppercase tracking-widest mb-2">Подписки</div>
          <h2 className="text-5xl font-bold text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Наши пакеты
          </h2>
          <p className="text-white/50 mt-3 max-w-2xl mx-auto">
            Выберите пакет — оформление и активация проходят в личном кабинете.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-3 gap-6"
        >
          {entries.map(([key, info]) => (
            <PackageCard
              key={key}
              info={info}
              color={info.color}
              onChoose={choose}
              priceLabel={prices?.[key] != null ? formatPackagePrice(prices[key]) : undefined}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
