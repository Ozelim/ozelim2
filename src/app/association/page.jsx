"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Sparkles,
  FileSignature,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  GraduationCap,
  Plane,
  ShieldCheck,
  Scale,
  Award,
  CheckCircle2,
  Megaphone,
  MapPinned,
  TrendingUp,
  BadgeCheck,
  LayoutGrid,
  FileText,
  HeartHandshake,
} from "lucide-react";

const mission = [
  "Популяризация внутреннего туризма среди населения и продвижение услуг Санаторно-курортных комплексов Казахстана.",
  "Повышение квалификации действующих работников в сфере туризма, подбор кадров, обучение, трудоустройство.",
  "Защита прав потребителей в сфере туризма и оказание юридической помощи.",
];

const directions = [
  {
    id: "health",
    title: "Мир здоровья",
    icon: Stethoscope,
    text:
      "Оздоровительные услуги санаториев — пропаганда здорового образа жизни, рекомендации к оздоровительным турам в Санаторно-курортные комплексы Республики Казахстан с использованием автоматизированного профильного конструктора туров по заболеваниям и патологиям.",
  },
  {
    id: "education",
    title: "Центр признания",
    icon: GraduationCap,
    text:
      "Образовательные услуги Центра признания — сертификация выпускников Вузов, онлайн-курсы, подготовка и переподготовка кадров, повышение квалификации действующих работников, подбор персонала и трудоустройство.",
  },
  {
    id: "tours",
    title: "Туры с OzElim",
    icon: Plane,
    text:
      "Туристические услуги членов Ассоциации и авторские туры «OzElim» направлены на популяризацию внутреннего туризма среди населения по всему Казахстану.",
  },
  {
    id: "insurance",
    title: "Страхование",
    icon: ShieldCheck,
    text:
      "Страховые услуги HALYK Life и Nomad Insurance — это финансовая защита от несчастных случаев в путешествиях. Страхование жизни помогает обезопасить себя и родных от возможных финансовых потерь в непредвиденных ситуациях.",
  },
  {
    id: "legal",
    title: "Правовая помощь",
    icon: Scale,
    text:
      "Юридические услуги «GRT COMPANY» — оказание правовой помощи и юридической поддержки потребителям в сфере внутреннего туризма и партнёрам Ассоциации.",
  },
];

const advantages = [
  { icon: HeartHandshake, text: "Поддержка Эндаумент фонда" },
  { icon: BadgeCheck, text: "Лицензированный Туроператор" },
  { icon: LayoutGrid, text: "Многофункциональная платформа и целевая аудитория" },
];

const partnerships = [
  {
    icon: TrendingUp,
    text: "Предлагаем целевую аудиторию, клиентскую базу и привлечение новых туристов",
  },
  {
    icon: Megaphone,
    text: "Работаем над рекламой и популяризацией санаториев и курортных зон",
  },
  {
    icon: MapPinned,
    text: "Организуем любые виды экскурсий по Казахстану",
  },
];

const benefits = [
  "Уникальную возможность получить юридические услуги на выгодных условиях",
  "Возможность для предприятий в сфере туризма провести обучение для сотрудников по промышленной безопасности, пожарно-техническому минимуму и безопасности охраны труда, провести в организации пожарный аудит на выгодных условиях",
  "Возможность успешно пройти обучение и получить документ по краткосрочной подготовке, переподготовке и повышения квалификации на выгодных условиях",
];

const docLinks = [
  { label: "Положение о членстве в Ассоциации", href: "/assoc-polozh.pdf" },
  { label: "Договор о членстве в Ассоциации", href: "/assoc-chlenstvo.pdf" },
  { label: "Заявление на вступление в Ассоциацию", href: "/assoc-zayav.pdf" },
];

const memorandums = [
  {
    title: "Меморандум со страховой компанией Халық-Life",
    desc: "О сотрудничестве в сфере страховой защиты участников программ Ассоциации.",
    href: "/assoc-memsotr.pdf",
  },
  {
    title: "Меморандум с Советом деловых женщин Павлодарской области",
    desc: "Соглашение о совместном развитии женского предпринимательства в туризме.",
    href: "/assoc-memsov.pdf",
  },
  {
    title: "Меморандум с Отделом туризма при Управлении физкультуры и спорта Павлодарской области",
    desc: "О совместной работе по развитию внутреннего туризма региона.",
    href: "/assoc-memtur.pdf",
  },
];

// ─── Circular directions diagram ──────────────────────────────────────────────
function DirectionsDiagram() {
  const radius = 120;
  const cx = 160;
  const cy = 160;
  const items = directions.map((d, i) => {
    const angle = (i / directions.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...d,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  return (
    <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
      <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="var(--site-accent)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--site-accent)" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex flex-col items-center justify-center shadow-[0_0_40px_var(--site-shadow-glow)]"
      >
        <span
          className="text-(--site-on-accent) text-2xl font-bold leading-none"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Oz
        </span>
        <span
          className="text-(--site-on-accent) text-2xl font-bold leading-none mt-1"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Elim
        </span>
      </motion.div>

      {items.map((d, i) => {
        const Icon = d.icon;
        return (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: d.x, top: d.y }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-(--site-accent)/40 bg-(--app-card) flex items-center justify-center shadow-[0_0_18px_var(--site-shadow-soft)]">
              <Icon className="w-6 h-6 text-(--site-accent-bright)" />
            </div>
            <div className="text-[10px] font-semibold text-(--app-fg) uppercase tracking-wider text-center leading-tight max-w-[90px]">
              {d.title}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AssociationPage() {
  const [memIdx, setMemIdx] = useState(0);
  const visible = 3;
  const next = () =>
    setMemIdx((i) => Math.min(i + 1, Math.max(0, memorandums.length - visible)));
  const prev = () => setMemIdx((i) => Math.max(0, i - 1));

  return (
    <main className="pt-28 pb-16">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f3d0f] z-[999] pointer-events-none" />
      <MarqueeTicker />

      {/* ── Intro ── */}
      <section className="px-6 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-(--site-accent-bright) text-xs uppercase tracking-widest mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            OzElim
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-(--site-accent-bright) mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Ассоциация некоммерческая организация
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-(--app-subtle) text-base md:text-lg leading-relaxed"
          >
            «OzElim» — это платформа по формированию целевой аудитории потребителей
            услуг в сфере туризма и путешествий. Основным преимуществом Ассоциации
            является поддержка Эндаумент фонда. Фонд создан на территории МФЦА,
            которая даёт широкую возможность как членам Ассоциации, так и потребителям
            услуг в сфере внутреннего туризма.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative mt-10 aspect-[1280/813] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-(--app-border) bg-(--app-card)"
          >
            <Image
              src="/atk.jpg"
              alt="Ассоциация туристов Казахстана"
              fill
              quality={90}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Миссия ── */}
      <section className="px-6 pb-14">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-(--site-accent-bright) mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Миссия
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mission.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-(--app-border) bg-(--app-card) p-6"
              >
                <div className="w-9 h-9 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-(--site-accent-bright)" />
                </div>
                <p className="text-(--app-subtle) text-sm leading-relaxed">{m}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Направления деятельности ── */}
      <section className="px-6 py-14 bg-(--app-panel)/40">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-(--site-accent-bright) text-center mb-10"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Направления деятельности Ассоциации туристов Казахстана «OzElim»
          </motion.h2>

          <div className="flex justify-center mb-12">
            <DirectionsDiagram />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {directions.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-(--app-border) bg-(--app-card) p-5 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-(--site-accent-bright)" />
                    <h3 className="text-(--site-accent-bright) font-semibold text-sm">
                      {d.title}
                    </h3>
                  </div>
                  <p className="text-(--app-subtle) text-xs leading-relaxed">{d.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Преимущество Ассоциации ── */}
      <section className="px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-(--site-accent-bright) mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Преимущество Ассоциации
          </motion.h2>

          <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-(--app-border) bg-(--app-card)"
            >
              <Image
                src="/preim.jpg"
                alt="Преимущество Ассоциации"
                fill
                quality={90}
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </motion.div>

            <div className="space-y-3">
              {advantages.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={a.text}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-(--app-border) bg-(--app-card)"
                  >
                    <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-(--site-accent-bright)" />
                    </div>
                    <span className="text-(--app-fg) text-sm font-medium">{a.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Director ── */}
      <section className="px-6 py-14 bg-(--app-panel)/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-(--app-border) bg-(--app-card)"
            >
              <Image
                src="/erkegali.jpeg"
                alt="Жанғазы Еркеғали Жұмабайұлы"
                fill
                quality={90}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-2xl md:text-3xl font-bold text-(--site-accent-bright) mb-3"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Жанғазы Еркеғали Жұмабайұлы
              </h3>
              <p className="text-(--app-subtle) text-sm md:text-base leading-relaxed mb-5">
                Руководитель Ассоциации туристов Казахстана, член общественного
                Совета Павлодарской области, бухгалтер-экономист, опыт работы в
                правоохранительных органах, обладатель Государственной награды — ордена
                «Құрмет» за высокий профессионализм и преданность общественному делу.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/assoc-gosreg.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-semibold text-sm hover:shadow-[0_0_24px_var(--site-shadow-glow)] transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Справка о Гос. Регистрации
                </a>
                <a
                  href="/assoc-ustav.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-semibold text-sm hover:shadow-[0_0_24px_var(--site-shadow-glow)] transition-all"
                >
                  <Award className="w-4 h-4" />
                  Устав Ассоциации туристов Казахстана «OzElim»
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Откройте свой отдел продаж ── */}
      <section className="px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-(--site-accent-bright) mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Откройте свой отдел продаж вместе с OzElim!
          </motion.h2>
          <p className="text-(--app-subtle) text-sm mb-8">
            Приглашаем к сотрудничеству профессиональных гидов-экскурсоводов,
            национальные парки, санатории и владельцев объектов туризма
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {partnerships.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.text}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-(--app-border) bg-(--app-card) p-5"
                >
                  <div className="w-9 h-9 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-(--site-accent-bright)" />
                  </div>
                  <p className="text-(--app-subtle) text-sm leading-relaxed">{p.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Стань членом Ассоциации ── */}
      <section className="px-6 py-14 bg-(--app-panel)/40">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-(--site-accent-bright) text-center mb-10"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Став членом Ассоциации вы получите:
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-(--app-border) bg-(--app-card) p-5"
              >
                <div className="w-9 h-9 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center mb-4">
                  <BadgeCheck className="w-5 h-5 text-(--site-accent-bright)" />
                </div>
                <p className="text-(--app-subtle) text-sm leading-relaxed">{b}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mt-10 aspect-[16/9] max-w-3xl mx-auto rounded-3xl overflow-hidden border border-(--app-border) bg-(--app-card)"
          >
            <Image
              src="/atk2.jpg"
              alt="Члены Ассоциации туристов Казахстана"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Document links ── */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 w-full">
            {docLinks.map((d) => (
              <a
                key={d.label}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-(--app-border) bg-(--app-card) hover:border-(--site-accent)/60 hover:bg-(--app-panel) transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0 group-hover:bg-(--site-accent)/25 transition-colors">
                  <FileText className="w-5 h-5 text-(--site-accent-bright)" />
                </div>
                <span className="text-(--site-accent-bright) text-sm font-medium underline underline-offset-4 group-hover:text-(--site-accent) transition-colors">
                  {d.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Memorandums ── */}
      <section className="px-6 py-14 bg-(--app-panel)/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <h2
              className="text-3xl md:text-4xl font-bold text-(--site-accent-bright)"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Меморандумы
            </h2>
            {memorandums.length > visible && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={memIdx === 0}
                  className="w-10 h-10 rounded-full border border-(--app-border) text-(--app-fg) flex items-center justify-center hover:border-(--site-accent) hover:text-(--site-accent) transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  disabled={memIdx >= memorandums.length - visible}
                  className="w-10 h-10 rounded-full border border-(--app-border) text-(--app-fg) flex items-center justify-center hover:border-(--site-accent) hover:text-(--site-accent) transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {memorandums
              .slice(memIdx, memIdx + visible)
              .map((m, i) => (
                <motion.a
                  key={`${m.title}-${memIdx + i}`}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="block text-left rounded-2xl bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) p-5 hover:shadow-[0_0_24px_var(--site-shadow-glow)] transition-all"
                >
                  <FileSignature className="w-6 h-6 text-(--site-on-accent) mb-3" />
                  <div className="text-(--site-on-accent) font-bold text-sm mb-2 leading-snug">
                    {m.title}
                  </div>
                  <p className="text-(--site-on-accent)/80 text-xs leading-relaxed">
                    {m.desc}
                  </p>
                </motion.a>
              ))}
          </div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
