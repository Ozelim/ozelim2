"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Mountain,
  House,
} from "lucide-react";

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.33 8.33 0 0 0 4.93 1.59V6.83a4.79 4.79 0 0 1-1.99-.14Z" />
    </svg>
  );
}

function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.3 18.78 19.2c-.24 1.05-.86 1.31-1.74.82l-4.82-3.55-2.32 2.24c-.26.26-.47.47-.96.47l.34-4.9 8.9-8.04c.39-.34-.08-.53-.6-.19L6.66 13.2l-4.74-1.48c-1.03-.32-1.05-1.03.21-1.52L20.62 2.9c.86-.32 1.61.19 1.32 1.4Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347ZM12.04 2.003C6.495 2.003 1.987 6.511 1.987 12.055c0 1.79.469 3.473 1.292 4.937L2 22l5.13-1.246a10.013 10.013 0 0 0 4.91 1.274h.004c5.544 0 10.052-4.508 10.052-10.053 0-2.687-1.047-5.214-2.948-7.115a10.001 10.001 0 0 0-7.108-2.957Zm0 18.418h-.003a8.4 8.4 0 0 1-4.28-1.171l-.307-.182-3.182.832.848-3.114-.2-.32a8.39 8.39 0 0 1-1.286-4.41c0-4.633 3.77-8.403 8.412-8.403 2.247 0 4.358.874 5.946 2.464a8.345 8.345 0 0 1 2.46 5.946c-.001 4.633-3.77 8.358-8.408 8.358Z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Главная", href: "/" },
  { label: "Туры", href: "/trips" },
  { label: "Визы", href: "https://vizapro.kz", external: true },
  { label: "Эндаумент Фонд", href: "/endowment" },
  { label: "Вопрос-ответ", href: "/faq" },
  { label: "О нас", href: "/about" },
];

// Чтобы убрать соцсеть — закомментируйте её строку (и иконку, и ссылку).
// Пустые/закомментированные записи автоматически отфильтровываются ниже,
// а оставшиеся иконки сами встанут в ряд без «дырок».
const SOCIAL_LINKS = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
  { Icon: TikTokIcon, label: "TikTok", href: "#" },
  { Icon: WhatsAppIcon, label: "WhatsApp", href: "#" },
  { Icon: TelegramIcon, label: "Telegram", href: "#" },
].filter((s) => s && s.Icon && s.href);

const FALLBACK_ITEMS = [
  "Халык Банк",
  "Евразия Банк",
  "Алатау Банк",
  "NoMad страхование",
  "Turan University",
  "Авиата",
  "OLX",
  "Krisha.kz",
  "Air Astana",
  "Rakhat",
];

export function MarqueeTicker() {
  const [labels, setLabels] = useState(FALLBACK_ITEMS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/marquee-items")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const next = (data.items ?? []).map((x) => x.label).filter(Boolean);
        if (next.length > 0) setLabels(next);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const items = [...labels, ...labels];
  return (
    <div className="py-8 border-y border-app-border overflow-hidden bg-app-bg">
      <div className="marquee-inner">
        {items.map((dest, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-8 text-app-faint text-sm uppercase tracking-widest shrink-0"
          >
            {dest}
            <span className="text-(--site-accent)">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-app-bg border-t border-app-border pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex items-center justify-center">
                <Mountain className="w-5 h-5 text-(--site-on-accent)" />
              </div>
              <div>
                <div
                  className="text-xl font-bold text-app-fg"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Oz<span className="text-(--site-accent)">Elim</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-app-subtle">
                  Туризм & Отдых
                </div>
              </div>
            </div>
            <p className="text-app-subtle text-sm leading-relaxed mb-6 max-w-sm">
              Создаём незабываемые путешествия по всему Казахстану вот уже 4 год!
              Ваш отдых — наша работа.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, color: "var(--site-accent)" }}
                  className="w-9 h-9 rounded-full border border-app-border flex items-center justify-center text-app-subtle hover:border-(--site-accent)/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-app-fg font-semibold mb-5 text-sm uppercase tracking-wider">
              Навигация
            </div>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-app-subtle hover:text-(--site-accent) text-sm transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-app-subtle hover:text-(--site-accent) text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <div className="text-app-fg font-semibold mb-5 text-sm uppercase tracking-wider">
              Контакты
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5 text-app-subtle text-sm">
                <House className="w-4 h-4 text-(--site-accent) mt-0.5 shrink-0" />
                ТОО «OzElim»
              </li>
              <li className="flex items-start gap-2.5 text-app-subtle text-sm">
                <MapPin className="w-4 h-4 text-(--site-accent) mt-0.5 shrink-0" />
                г. Павлодар, ул. Гагарина 50
              </li>
              <li className="flex items-center gap-2.5 text-app-subtle text-sm">
                <Phone className="w-4 h-4 text-(--site-accent) shrink-0" />
                +7 (747) 051 2252
              </li>
              <li className="flex items-center gap-2.5 text-app-subtle text-sm">
                <Mail className="w-4 h-4 text-(--site-accent) shrink-0" />
                ozelim.pv@mail.ru
              </li>
              <li className="flex items-center gap-2.5 text-app-subtle text-sm">
                <Globe className="w-4 h-4 text-(--site-accent) shrink-0" />
                ozelim.kz
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-app-faint text-xs">
          <div>© 2026 OzElim. Все права защищены.</div>
          <div className="flex gap-6">
            <a
              href="/main-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-app-muted transition-colors"
            >
              Политика конфиденциальности
            </a>
            <a
              href="/main-oferta.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-app-muted transition-colors"
            >
              Договор оферты
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
