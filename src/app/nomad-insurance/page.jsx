"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import { ContactCtaDialog } from "@/components/contact-cta/contact-cta";
import {
  ShieldCheck,
  PhoneCall,
  Globe,
  MapPin,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
  Stethoscope,
  Plane,
  HeartPulse,
  Ambulance,
  Syringe,
  RotateCcw,
  Info,
  ArrowRight,
  FileText,
  Phone,
} from "lucide-react";

const coverageItems = [
  { icon: HeartPulse, text: "Экстренная медицинская помощь" },
  { icon: Stethoscope, text: "Амбулаторное и стационарное лечение" },
  { icon: Ambulance, text: "Госпитализация и медицинские расходы" },
  { icon: Plane, text: "Транспортировка в медицинское учреждение" },
  { icon: Syringe, text: "Экстренная стоматологическая помощь" },
  { icon: RotateCcw, text: "Репатриация при необходимости" },
  { icon: FileText, text: "Другие расходы согласно условиям программы" },
];

const conditions = [
  { label: "Страховое покрытие", value: "от 10 000 USD", icon: ShieldCheck },
  { label: "Срок действия", value: "Весь период поездки", icon: Clock },
  { label: "Возрастные ограничения", value: "Отсутствуют", icon: Users },
  { label: "Территория действия", value: "Весь Казахстан", icon: Globe },
  { label: "Тип страхования", value: "Медицинская страховка для туристов", icon: Stethoscope },
];

const advantages = [
  {
    icon: BadgeCheck,
    title: "Соответствие законодательству",
    desc: "Страхование соответствует требованиям законодательства Республики Казахстан",
  },
  {
    icon: ShieldCheck,
    title: "Надёжная защита",
    desc: "Надёжная страховая защита туристов на весь период поездки",
  },
  {
    icon: Phone,
    title: "Круглосуточная поддержка",
    desc: "Поддержка ассистанской компании за рубежом 24 часа в сутки, 7 дней в неделю",
  },
  {
    icon: FileText,
    title: "Прозрачные условия",
    desc: "Прозрачные условия без скрытых платежей и дополнительных комиссий",
  },
];

const importantItems = [
  "Полис оформляется на основании данных туриста",
  "Условия и лимиты зависят от выбранной программы",
  "Возможны ограничения (хронические заболевания, активные виды спорта и др.)",
  "Полные условия указаны в страховом полисе",
];

const tourTypes = [
  {
    icon: Globe,
    title: "За границу",
    desc: "Туристические поездки за рубеж с полным медицинским покрытием в стране пребывания",
  },
  {
    icon: MapPin,
    title: "Внутренний туризм",
    desc: "Путешествия по Казахстану с защитой на весь маршрут поездки",
  },
  {
    icon: Users,
    title: "Индивидуальные туры",
    desc: "Страхование отдельных туристов с учётом личного маршрута и программы",
  },
  {
    icon: Plane,
    title: "Групповые туры",
    desc: "Комплексное страхование групп туристов с едиными условиями покрытия",
  },
];

const claimSteps = [
  {
    step: "01",
    title: "Позвоните в ассистанскую компанию",
    desc: "Свяжитесь по номеру, указанному в страховом полисе",
  },
  {
    step: "02",
    title: "Сообщите данные",
    desc: "Укажите номер полиса, ФИО и текущее местонахождение",
  },
  {
    step: "03",
    title: "Следуйте инструкциям",
    desc: "Действуйте строго по указаниям оператора ассистанской компании",
  },
];

export default function NomadInsurancePage() {
  return (
    <main className="pt-20">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f3d0f] z-[999] pointer-events-none" />
      <MarqueeTicker />

      {/* ── Hero ── */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-4">
                Туристическое страхование
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-app-fg mb-6 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Надёжная защита{" "}
                <span className="text-gradient">во время путешествий</span>
              </h1>
              <p className="text-app-muted leading-relaxed mb-4">
                Туристическое страхование в Казахстане для выезда за границу и
                внутреннего туризма. Страховая защита каждого клиента на весь
                период поездки в соответствии с требованиями законодательства
                Республики Казахстан.
              </p>
              <p className="text-app-subtle text-sm leading-relaxed mb-8">
                Страховой партнёр — Nomad Insurance, надёжная страховая компания
                с более чем 20-летним опытом работы.
              </p>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Оформить страховку
              </motion.a>
            </div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#061506]/60"
            >
              <Image
                src="/nomad.jpg"
                alt="Туристическое страхование Nomad Insurance"
                fill
                quality={90}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Типы страхования ── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-app-fg mb-8 text-center"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Оформление страхования{" "}
            <span className="text-gradient">туристов</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tourTypes.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 card-hover"
                >
                  <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-(--site-accent)" />
                  </div>
                  <h3
                    className="text-lg font-bold text-app-fg mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {t.title}
                  </h3>
                  <p className="text-app-subtle text-sm leading-relaxed">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Условия ── */}
      <section className="px-6 py-16 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center"
          >
            {/* Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#061506]/60 order-2 lg:order-1">
              <Image
                src="/str.jpg"
                alt="Параметры полиса"
                fill
                quality={90}
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Параметры полиса
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg mb-7"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Условия туристического{" "}
                <span className="text-gradient">страхования</span>
              </h2>
              <div className="space-y-3">
                {conditions.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-4 rounded-xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 px-5 py-4"
                    >
                      <div className="w-9 h-9 rounded-lg bg-(--site-accent)/15 border border-(--site-accent)/25 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-(--site-accent)" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-app-faint text-xs mb-0.5">{c.label}</div>
                        <div className="text-app-fg text-sm font-semibold">{c.value}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Что входит в страховку ── */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Что входит в{" "}
              <span className="text-gradient">туристическую страховку</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {coverageItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-5 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-(--site-accent)" />
                  </div>
                  <p className="text-app-subtle text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Что делать при страховом случае ── */}
      <section className="px-6 py-16 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Инструкция
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg mb-8"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Что делать при страховом случае{" "}
                <span className="text-gradient">за границей</span>
              </h2>

              <div className="space-y-4 mb-8">
                {claimSteps.map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 items-start rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-5"
                  >
                    <div
                      className="text-3xl font-bold text-(--site-accent)/30 leading-none shrink-0 tabular-nums"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-app-fg font-semibold text-sm mb-1">{s.title}</h4>
                      <p className="text-app-subtle text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image + warning */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#061506]/60"
              >
                <Image
                  src="/zvon.jpg"
                  alt="Звонок в страховую компанию"
                  fill
                  quality={90}
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>

              {/* Warning */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  <span className="font-semibold text-amber-300">Важно:</span> Самостоятельное
                  обращение в клинику без уведомления страховой компании может привести к
                  отказу в выплате (кроме экстренных случаев).
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Преимущества ── */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Преимущества{" "}
              <span className="text-gradient">страхования</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 card-hover"
                >
                  <div className="w-11 h-11 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-(--site-accent)" />
                  </div>
                  <h3
                    className="text-lg font-bold text-app-fg mb-2 leading-snug"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {a.title}
                  </h3>
                  <p className="text-app-subtle text-sm leading-relaxed">{a.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Важная информация ── */}
      <section className="px-6 py-16 bg-[#0a2a0a]/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-(--site-accent)" />
              <h2
                className="text-2xl md:text-3xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Важная информация
              </h2>
            </div>
            <ul className="space-y-3">
              {importantItems.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 text-app-muted text-sm leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-(--site-accent) shrink-0 mt-0.5" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-accent)/10 to-transparent p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Оформить сейчас
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Закажите туристическую{" "}
                <span className="text-gradient">страховку</span>
              </h2>
              <p className="text-app-subtle text-sm leading-relaxed">
                Оформите страховку для выезда за границу или по Казахстану
                быстро и удобно. Мы подберём оптимальный вариант под ваш
                маршрут и бюджет.
              </p>
            </div>
            <ContactCtaDialog
              kind="insurance_request"
              source="/nomad-insurance"
              title="Заявка на страхование"
              description="Оставьте контакты — подберём подходящий тариф под ваш маршрут и свяжемся с вами."
            />
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
