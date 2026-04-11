"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import Carousel2 from "@/components/sections/Carousel2";
import {
  Leaf,
  TreePine,
  Globe,
  Users,
  Heart,
  TrendingUp,
  Award,
  ChevronRight,
  ExternalLink,
  Target,
  BarChart2,
  BookOpen,
  Mountain,
  Camera,
  Map,
  Check,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

const projects = [
  {
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=75",
    title: "Чистые тропы Алтая",
    category: "Экология",
    status: "Активный",
    raised: 4200000,
    goal: 6000000,
    volunteers: 340,
    desc: "Проект по очистке и восстановлению горных маршрутов Алтайского региона. Установка информационных стендов, мусорных контейнеров и обучение туристов принципам экотуризма.",
    color: "#2d8a2d",
  },
  {
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=75",
    title: "Тайные тропы Алатау",
    category: "Сообщество",
    status: "Активный",
    raised: 2800000,
    goal: 5000000,
    volunteers: 120,
    desc: "Программа обучения и сертификации местных жителей в качестве профессиональных экогидов. Создание устойчивой экономики вокруг экологичного туризма.",
    color: "var(--site-accent)",
  },
  {
    img: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=700&q=75",
    title: "Сохранение Каспия",
    category: "Биоразнообразие",
    status: "Завершён",
    raised: 8000000,
    goal: 8000000,
    volunteers: 580,
    desc: "Мониторинг и защита уникальных прибрежных экосистем Каспийского моря. Совместный проект с научными организациями Казахстана.",
    color: "var(--site-accent-bright)",
  },
  {
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=75",
    title: "Детский экотуризм",
    category: "Образование",
    status: "Активный",
    raised: 1500000,
    goal: 3000000,
    volunteers: 85,
    desc: "Бесплатные экологические экспедиции для детей из малообеспеченных семей. Воспитание нового поколения ответственных путешественников.",
    color: "#86c986",
  },
];

const reports = [
  {
    year: 2025,
    trees: 12000,
    routes: 45,
    volunteers: 1200,
    funds: "₸ 18.4 млн",
  },
  { year: 2024, trees: 8500, routes: 32, volunteers: 840, funds: "₸ 12.1 млн" },
  { year: 2023, trees: 5200, routes: 20, volunteers: 460, funds: "₸ 6.8 млн" },
];

const principles = [
  {
    icon: Leaf,
    title: "Экологичность",
    desc: "Каждый наш тур разработан так, чтобы минимизировать воздействие на окружающую среду.",
  },
  {
    icon: Users,
    title: "Поддержка местных",
    desc: "Мы направляем 10% прибыли от каждого тура в местные сообщества принимающих стран.",
  },
  {
    icon: BookOpen,
    title: "Образование",
    desc: "Распространяем знания об устойчивом туризме через обучающие программы и экспедиции.",
  },
  {
    icon: Globe,
    title: "Глобальное мышление",
    desc: "Действуем локально, думаем глобально — для сохранения природы будущих поколений.",
  },
];

const donationAmounts = [5000, 10000, 25000, 50000];

export default function FoundationPage() {
  const [selectedProject, setSelectedProject] = useState(0);
  const [activeReport, setActiveReport] = useState(0);
  const [donation, setDonation] = useState(10000);
  const [customDonation, setCustomDonation] = useState("");

  return (
    <main>
      <Hero
        title="Фонд"
        highlight="OzElim"
        subtitle="Мы верим, что ответственный туризм может изменить мир к лучшему. Присоединяйтесь к нашей миссии по защите природы и поддержке местных сообществ."
        badge="Экологический фонд"
      />
      <MarqueeTicker />

      {/* Foundation intro */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-4">
                О фонде
              </div>
              <h2
                className="text-5xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Туризм, который{" "}
                <span className="text-gradient">возвращает</span> природе
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Фонд OzElim основан в 2024 году с простой идеей: туризм
                должен не разрушать природу, а помогать её сохранять. Мы
                направляем часть прибыли на экологические и социальные проекты в
                регионах, которые посещают наши туристы.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Посадили 25 000+ деревьев",
                  "Очистили 1 200 км маршрутов",
                  "Поддержали 1 800+ волонтёров",
                  "Реализовали 4 крупных проекта",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <div className="w-5 h-5 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-(--site-accent)" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm hover:shadow-[0_0_30px_var(--site-shadow-strong)] transition-all">
                Поддержать фонд <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {principles.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all card-hover"
                  >
                    <p.icon className="w-8 h-8 text-(--site-accent) mb-3" />
                    <h4
                      className="text-white font-bold mb-2"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {p.title}
                    </h4>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {p.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 px-6 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Проекты
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Наши инициативы
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj, i) => {
              const pct = Math.round((proj.raised / proj.goal) * 100);
              return (
                <motion.div
                  key={proj.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={proj.img}
                      alt={proj.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#0a2a0a]/80 border border-[#1a6b1a]/40 text-[#86c986] text-xs">
                        {proj.category}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${proj.status === "Завершён" ? "bg-(--site-accent-bright) text-(--site-on-accent)" : "bg-(--site-accent) text-(--site-on-accent)"}`}
                      >
                        {proj.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/60 text-xs">
                      <Users className="w-3 h-3" /> {proj.volunteers} волонтёров
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-white font-bold text-xl mb-2"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {proj.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-5 leading-relaxed">
                      {proj.desc}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/50">Собрано</span>
                        <span className="text-(--site-accent) font-bold">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.2,
                            ease: "easeOut",
                            delay: i * 0.15,
                          }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${proj.color}, var(--site-accent))`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-2 text-white/40">
                        <span>₸ {proj.raised.toLocaleString()}</span>
                        <span>₸ {proj.goal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group/btn">
                      Подробнее о проекте{" "}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Поддержать
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Сделать пожертвование
            </h2>
            <p className="text-white/50 mt-4">
              Любая сумма имеет значение. Ваш вклад помогает реализовывать
              экологические проекты.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-8"
          >
            <div className="flex gap-3 mb-4 flex-wrap">
              {donationAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setDonation(amount);
                    setCustomDonation("");
                  }}
                  className={`flex-1 min-w-[80px] py-3 rounded-2xl text-sm font-bold transition-all ${
                    donation === amount && !customDonation
                      ? "bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent)"
                      : "border border-white/10 text-white/60 hover:border-(--site-accent)/30 hover:text-white"
                  }`}
                >
                  ₸ {amount.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={customDonation}
                onChange={(e) => {
                  setCustomDonation(e.target.value);
                  setDonation(0);
                }}
                placeholder="Своя сумма (₸)"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-(--site-accent)/40 transition-colors"
              />
            </div>

            <div className="flex gap-3 mb-6 text-sm">
              {["Разово", "Ежемесячно", "Ежегодно"].map((period) => (
                <button
                  key={period}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:border-(--site-accent)/30 hover:text-white transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 40px var(--site-shadow-strong)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-base flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Пожертвовать ₸ {customDonation || donation.toLocaleString()}
            </motion.button>

            <p className="text-white/30 text-xs text-center mt-4">
              Безопасная оплата. Подтверждение на email. Чек для налоговой.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reports tabs */}
      <section className="py-20 px-6 bg-[#0a2a0a]/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Прозрачность
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Годовые отчёты
            </h2>
          </motion.div>

          <div className="flex justify-center gap-2 mb-8">
            {reports.map((r, i) => (
              <button
                key={r.year}
                onClick={() => setActiveReport(i)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeReport === i
                    ? "text-(--site-on-accent)"
                    : "text-white/60 border border-white/10 hover:text-white"
                }`}
              >
                {activeReport === i && (
                  <motion.div
                    layoutId="report-pill"
                    className="absolute inset-0 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright)"
                  />
                )}
                <span className="relative z-10">{r.year}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeReport}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: TreePine,
                  label: "Посажено деревьев",
                  value: reports[activeReport].trees.toLocaleString(),
                },
                {
                  icon: Map,
                  label: "Маршрутов очищено",
                  value: reports[activeReport].routes,
                },
                {
                  icon: Users,
                  label: "Волонтёров",
                  value: reports[activeReport].volunteers.toLocaleString(),
                },
                {
                  icon: BarChart2,
                  label: "Направлено средств",
                  value: reports[activeReport].funds,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 text-center"
                >
                  <stat.icon className="w-6 h-6 text-(--site-accent) mx-auto mb-2" />
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="text-center mt-8">
            <button className="flex items-center gap-2 text-(--site-accent) text-sm mx-auto hover:gap-3 transition-all group">
              <ExternalLink className="w-4 h-4" />
              Скачать полный отчёт PDF
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Carousel2 />
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
