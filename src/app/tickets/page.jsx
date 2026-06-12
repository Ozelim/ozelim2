"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import { ContactCtaDialog } from "@/components/contact-cta/contact-cta";
import {
  Plane,
  Train,
  Globe,
  MapPin,
  Clock,
  BadgeCheck,
  CalendarCheck,
  Search,
  Headphones,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

const ticketTypes = [
  {
    icon: Plane,
    title: "Авиабилеты",
    subtitle: "По Казахстану и международным направлениям",
    desc: "Оформляем авиабилеты на рейсы по всему Казахстану и международным маршрутам. Широкий выбор направлений, гибкие тарифы, удобное оформление.",
    tag: "Авиа",
    img: "/smlt.jpg",
  },
  {
    icon: Train,
    title: "Железнодорожные билеты",
    subtitle: "По территории Республики Казахстан",
    desc: "Бронируем и оформляем ж/д билеты на все направления внутри Казахстана. Актуальное расписание, выбор вагонов и мест, быстрое оформление.",
    tag: "ЖД",
    img: "/poezd.webp",
  },
];

const platformBenefits = [
  {
    icon: CalendarCheck,
    title: "Актуальное расписание",
    desc: "Доступ к актуальному расписанию рейсов и поездов в режиме реального времени",
  },
  {
    icon: Search,
    title: "Оптимальные маршруты",
    desc: "Подбор оптимальных маршрутов и выгодных тарифов под ваш запрос и бюджет",
  },
  {
    icon: Clock,
    title: "Быстрое оформление",
    desc: "Быстрое и удобное оформление билетов без лишних шагов и ожиданий",
  },
  {
    icon: Headphones,
    title: "Сопровождение",
    desc: "Профессиональное сопровождение и консультационная поддержка на всех этапах",
  },
];

const partnerStats = [
  { value: "50+", label: "лет на рынке авиаперевозок" },
  { value: "Air France–KLM", label: "группа компаний" },
  { value: "1965", label: "год основания" },
];

export default function TicketsPage() {
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
                Билеты
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-app-fg mb-6 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Авиа- и железнодорожные{" "}
                <span className="text-gradient">билеты</span>
              </h1>
              <p className="text-app-muted leading-relaxed mb-4">
                Туроператор OzElim предлагает удобный и надёжный сервис по
                бронированию и оформлению билетов благодаря сотрудничеству с
                авиакомпанией Transavia.
              </p>
              <p className="text-app-subtle text-sm leading-relaxed mb-8">
                Партнёрство с международным авиаперевозчиком позволяет
                предоставлять клиентам широкий выбор направлений и гибкие
                условия перелётов.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a6b1a]/35 bg-[#0a2a0a]/40 text-app-muted text-sm">
                  <Plane className="w-4 h-4 text-(--site-accent)" />
                  Авиабилеты
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a6b1a]/35 bg-[#0a2a0a]/40 text-app-muted text-sm">
                  <Train className="w-4 h-4 text-(--site-accent)" />
                  ЖД билеты
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a6b1a]/35 bg-[#0a2a0a]/40 text-app-muted text-sm">
                  <Globe className="w-4 h-4 text-(--site-accent)" />
                  Международные рейсы
                </div>
              </div>
            </div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#061506]/60"
            >
              <Image
                src="/tprkns.jpg"
                alt="Авиа- и железнодорожные билеты"
                fill
                quality={90}
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Типы билетов ── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {ticketTypes.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 overflow-hidden card-hover"
              >
                {/* Image */}
                <div className="relative aspect-[16/7] border-b border-[#1a6b1a]/20 bg-[#061506]/60">
                  <Image
                    src={t.img}
                    alt={t.title}
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-(--site-accent)" />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold text-app-fg leading-tight"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {t.title}
                      </h3>
                      <p className="text-(--site-accent) text-xs mt-0.5">{t.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-app-subtle text-sm leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Партнёр — Transavia ── */}
      <section className="px-6 py-16 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Авиапартнёр
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg mb-5"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Transavia —{" "}
                <span className="text-gradient">европейский перевозчик</span>
              </h2>
              <p className="text-app-muted leading-relaxed mb-4">
                Европейская авиакомпания с более чем 50-летней историей,
                основанная в 1965 году. Входит в группу Air France–KLM Group и
                зарекомендовала себя как надёжный лоукост-перевозчик, выполняющий
                рейсы по Европе и за её пределами.
              </p>
              <p className="text-app-subtle text-sm leading-relaxed mb-7">
                Компания известна высоким уровнем безопасности, доступными
                тарифами и стабильной работой на рынке авиаперевозок.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {partnerStats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 px-4 py-4 text-center"
                  >
                    <div
                      className="text-xl font-bold text-gradient leading-tight mb-1"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-app-faint text-xs leading-tight">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Transavia logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#061506]/60"
            >
              <Image
                src="/transavia.jpg"
                alt="Логотип Transavia"
                fill
                quality={90}
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 28rem"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Наша платформа ── */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
              Сервис
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Наша платформа{" "}
              <span className="text-gradient">бронирования</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {platformBenefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
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
                    className="text-lg font-bold text-app-fg mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-app-subtle text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Legal note */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 px-6 py-5 flex items-start gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-(--site-accent) shrink-0 mt-0.5" />
            <p className="text-app-subtle text-sm leading-relaxed">
              Все услуги оказываются в рамках официальных договорных отношений с
              партнёрами и в полном соответствии с требованиями законодательства
              Республики Казахстан.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Направления — image placeholder ── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center"
          >
            {/* Image — map / route */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#061506]/60">
              <Image
                src="/knim.jpg"
                alt="Карта направлений и маршрутов"
                fill
                quality={90}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Направления
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg mb-5"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Казахстан и{" "}
                <span className="text-gradient">весь мир</span>
              </h2>
              <div className="space-y-3">
                {[
                  { icon: Plane, text: "Внутренние рейсы по Казахстану" },
                  { icon: Globe, text: "Международные авиамаршруты" },
                  { icon: Train, text: "ЖД направления по всей стране" },
                  { icon: BadgeCheck, text: "Официальное оформление билетов" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 rounded-xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 px-5 py-3.5"
                    >
                      <Icon className="w-4 h-4 text-(--site-accent) shrink-0" />
                      <span className="text-app-muted text-sm">{item.text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-app-faint ml-auto" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-16 bg-[#0a2a0a]/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-accent)/10 to-transparent p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Забронировать
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg mb-3"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Купите билет{" "}
                <span className="text-gradient">прямо сейчас</span>
              </h2>
              <p className="text-app-subtle text-sm leading-relaxed">
                Свяжитесь с нами — подберём оптимальный маршрут, тариф и
                оформим билет быстро и официально.
              </p>
            </div>
            <ContactCtaDialog
              kind="tickets_request"
              source="/tickets"
              title="Заявка на покупку билета"
              description="Оставьте контакты — подберём оптимальный маршрут и тариф."
            />
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
