"use client";
import { motion } from "framer-motion";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Mountain,
  House,
} from "lucide-react";

const destinations = [
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
  "Vavle",
  "Starship Entertainment",
  "WASK Esports team",
];

export function MarqueeTicker() {
  const items = [...destinations, ...destinations];
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
              Создаём незабываемые путешествия по всему миру уже 12 лет. Ваши
              мечты — наша работа.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube, Send].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.15, color: "var(--site-accent)" }}
                  className="w-9 h-9 rounded-full border border-app-border flex items-center justify-center text-app-subtle hover:border-(--site-accent)/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-app-fg font-semibold mb-5 text-sm uppercase tracking-wider">
              Навигация
            </div>
            <ul className="space-y-3">
              {["Главная", "Туры", "Санатории", "О нас", "Фонд", "Блог*"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-app-subtle hover:text-(--site-accent) text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
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
                support@oz-elim.kz
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
            <a href="#" className="hover:text-app-muted transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-app-muted transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
