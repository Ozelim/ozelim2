"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Sparkles,
  Building2,
  FileSignature,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Globe,
  Plane,
  ShieldCheck,
  HandCoins,
  Stethoscope,
} from "lucide-react";

const offerings = [
  {
    icon: Stethoscope,
    text: "Цифровой ассистент по подбору санаториев по заболеваниям и патологиям",
  },
  {
    icon: Plane,
    text: "Авторские туры и культурно-познавательные маршруты",
  },
  {
    icon: ShieldCheck,
    text: "Миграционно-визовая, правовая и страховая поддержка",
  },
  {
    icon: Handshake,
    text: "Административная поддержка Ассоциации туристов Казахстана",
  },
  {
    icon: HandCoins,
    text: "Эндаумент фонд на базе МФЦА для поддержки туристических проектов",
  },
];

const partners = [
  "Юридическая компания ТОО «GRT COMPANY»",
  "ТОО «Центр сертификации специалистов «САПА»",
  "Web-студия ИП «TAS Prog»",
  "ТОО «PROFIL-KZ»",
  "Миграционно-визовый консалтинг ИП Мукатаева А.К.",
  "АО «Страховая компания «НОМАД Иншуранс»",
  "Объединение индивидуальных предпринимателей и юридических лиц «Ассоциация туристов Казахстана «OzElim»",
  "Акционерное общество «Дочерняя компания Народного Банка Казахстана по страхованию жизни «Халык-Life»",
  "Некоммерческая организация «Endowment fund of the Association of Tourists of Kazakhstan» — Эндаумент фонд «OzElim» на базе МФЦА",
  "Отдел туризма при ГУ «Управление физической культуры и спорта Павлодарской области»",
  "Совет Деловых Женщин Павлодарской области",
  "ТОО «Y. Taxi Qazaqstan»",
  "ИП «TURAN TOUR»",
  "ТОО «PALMA TUR»",
  "ТОО «Нуртау»",
  "ИП «МЕЙРБАЕВ М.Ж.»",
  "ТОО «Айдабол Курылыс»",
  "ИП Нуржумбаева",
  "ТОО «Компания «Пять звезд»",
  "ТОО «Международная ассоциация клубов», г. Алматы",
];

const memorandums = [
  {
    title: "Меморандум №1",
    desc: "О сотрудничестве с ГУ «Управление физической культуры и спорта Павлодарской области».",
  },
  {
    title: "Меморандум №2",
    desc: "Соглашение о совместной работе по развитию внутреннего туризма в регионе.",
  },
  {
    title: "Меморандум №3",
    desc: "Меморандум о сотрудничестве с Народным Банком Казахстана по гостевым программам.",
  },
  {
    title: "Меморандум №4",
    desc: "Соглашение по обмену опытом и сопровождению туристических услуг с партнёрами.",
  },
];

export default function LegalPage() {
  const [memIdx, setMemIdx] = useState(0);
  const visible = 4;
  const next = () =>
    setMemIdx((i) => Math.min(i + 1, Math.max(0, memorandums.length - visible)));
  const prev = () => setMemIdx((i) => Math.max(0, i - 1));

  return (
    <main>
      <Hero
        title="Правовая"
        highlight="защита"
        subtitle="Открой Казахстан вместе с OzElim — экосистема партнёров, услуг и сервисов для безопасных и полезных путешествий."
        badge="OzElim"
      />
      <MarqueeTicker />

      {/* Hero block */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-10 h-10 text-(--site-accent) mx-auto mb-4" />
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Открой Казахстан вместе с{" "}
                <span className="text-gradient">OzElim!</span>
              </h2>
              <p className="text-white/65 max-w-3xl mx-auto leading-relaxed">
                Мы объединяем людей, сервисы, знания и технологии, чтобы сделать
                путешествия по Казахстану доступными, комфортными и полезными.
              </p>
            </div>

            <div className="text-(--site-accent) font-semibold mb-4">
              OzElim — это:
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {offerings.map((o, i) => (
                <motion.div
                  key={o.text}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-[#1a6b1a]/20 bg-[#061506]/60"
                >
                  <div className="w-8 h-8 rounded-lg bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                    <o.icon className="w-4 h-4 text-(--site-accent)" />
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {o.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-6 pb-20 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto py-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Наши партнёры
          </motion.h2>

          <div className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {partners.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 py-2"
                >
                  <div className="w-6 h-6 rounded-md bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-3 h-3 text-(--site-accent)" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{p}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Memorandums carousel */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Меморандумы
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                disabled={memIdx === 0}
                className="w-10 h-10 rounded-full border border-white/15 text-white flex items-center justify-center hover:border-(--site-accent) hover:text-(--site-accent) transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                disabled={memIdx >= memorandums.length - visible}
                className="w-10 h-10 rounded-full border border-white/15 text-white flex items-center justify-center hover:border-(--site-accent) hover:text-(--site-accent) transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {memorandums
              .slice(memIdx, memIdx + visible)
              .map((m, i) => (
                <motion.div
                  key={`${m.title}-${memIdx + i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <FileSignature className="w-5 h-5 text-(--site-accent)" />
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-(--site-accent)/30 text-(--site-accent)">
                      PDF
                    </span>
                  </div>
                  <div className="aspect-[3/4] rounded-xl border border-dashed border-[#1a6b1a]/40 bg-[#030f03]/60 flex items-center justify-center text-white/25 text-xs">
                    Документ
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">
                      {m.title}
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
