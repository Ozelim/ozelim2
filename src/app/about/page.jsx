"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import Carousel3 from "@/components/sections/Carousel3";
import WhyUs from "@/components/sections/WhyUs";
import {
  Award,
  Users,
  Globe,
  TrendingUp,
  Quote,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Instagram,
  Mail,
  Target,
  Eye,
  Heart,
  Zap,
} from "lucide-react";
import Image from "next/image";

const team = [
  {
    name: "Алия Сейткали",
    role: "Основатель и CEO",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80",
    quote: "Каждое путешествие — это страница вашей жизненной книги.",
    social: { linkedin: "#", instagram: "#", mail: "a.seitkali@ozelim.kz" },
  },
  {
    name: "Данияр Ахметов",
    role: "Директор по маршрутам",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    quote: "Я прошёл тысячи километров, чтобы найти лучшие маршруты для вас.",
    social: { linkedin: "#", instagram: "#", mail: "d.akhmetov@ozelim.kz" },
  },
  {
    name: "Мадина Жаксыбекова",
    role: "Руководитель СПА-направления",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    quote:
      "Здоровье — это не отсутствие болезней, а состояние полного благополучия.",
    social: {
      linkedin: "#",
      instagram: "#",
      mail: "m.zhaksybekova@ozelim.kz",
    },
  },
  {
    name: "Тимур Назаров",
    role: "Технический директор",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    quote:
      "Технологии помогают нам делать путешествия более безопасными и комфортными.",
    social: { linkedin: "#", instagram: "#", mail: "t.nazarov@ozelim.kz" },
  },
];

const timeline = [
  {
    year: "2014",
    title: "Основание компании",
    desc: "OzElim была основана в Алматы с командой из 5 человек и первыми маршрутами по Казахстану.",
  },
  {
    year: "2016",
    title: "Первые зарубежные туры",
    desc: "Мы запустили международные направления в Европу и Азию, обслужив более 500 клиентов.",
  },
  {
    year: "2018",
    title: "Открытие СПА-направления",
    desc: "Добавили санаторно-курортное направление и стали первым агентством полного цикла в регионе.",
  },
  {
    year: "2020",
    title: "Цифровая трансформация",
    desc: "Запустили собственную платформу бронирования и мобильное приложение для туристов.",
  },
  {
    year: "2022",
    title: "Международные награды",
    desc: "Получили награду «Лучший туроператор Центральной Азии» от World Travel Awards.",
  },
  {
    year: "2024",
    title: "Фонд OzElim",
    desc: "Основали некоммерческий фонд для развития экотуризма и поддержки местных сообществ.",
  },
  {
    year: "2026",
    title: "Сегодня",
    desc: "Более 15 000 довольных клиентов, 48 стран и 200+ маршрутов. Мы продолжаем расти.",
  },
];

const values = [
  {
    icon: Target,
    title: "Точность",
    desc: "Каждая деталь продумана заранее. Мы не оставляем ничего на волю случая.",
  },
  {
    icon: Eye,
    title: "Прозрачность",
    desc: "Честные цены, никаких скрытых доплат. Вы знаете за что платите.",
  },
  {
    icon: Heart,
    title: "Забота",
    desc: "Ваш комфорт и безопасность — превыше всего в каждой точке маршрута.",
  },
  {
    icon: Zap,
    title: "Инновации",
    desc: "Постоянно ищем новые форматы и маршруты, чтобы удивлять вас.",
  },
];

const reviews = [
  {
    name: "Карина М.",
    city: "Алматы",
    text: "Тур в Норвегию превзошёл все мои ожидания. Гид был профессионал, отели — выше всяких похвал. Уже планируем следующую поездку с OzElim!",
    rating: 5,
    tour: "Фьорды Норвегии",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
  },
  {
    name: "Алексей В.",
    city: "Нур-Султан",
    text: "Санаторий в Боровом — просто фантастика. За 10 дней полностью восстановился после операции. Процедуры, питание, персонал — всё на высшем уровне.",
    rating: 5,
    tour: "Лесная Здравница",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Зарина Т.",
    city: "Шымкент",
    text: "Путешествие в Японию было мечтой всей жизни. Команда OzElim воплотила её в жизнь! Маршрут был идеально спланирован, без единой накладки.",
    rating: 5,
    tour: "Токио — Сеул",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

export default function AboutPage() {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewDir, setReviewDir] = useState(1);

  const goReview = (n) => {
    setReviewDir(n > reviewIdx ? 1 : -1);
    setReviewIdx((n + reviews.length) % reviews.length);
  };

  return (
    <main>
      <Hero
        title="О компании"
        highlight="OzElim"
        subtitle="Мы — команда путешественников, влюблённых в мир и убеждённых, что лучшие впечатления жизни рождаются в дороге."
        badge="12 лет в туризме"
      />
      <MarqueeTicker />

      {/* Mission section */}
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
                Наша миссия
              </div>
              <h2
                className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Делать мечты реальностью,{" "}
                <span className="text-gradient">одно путешествие</span> за раз
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                OzElim — это больше чем туристическое агентство. Мы создаём
                трансформирующий опыт, который меняет взгляды на мир и обогащает
                жизнь новыми смыслами.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Каждый маршрут — это история, написанная специально для вас. Мы
                берём на себя все детали, чтобы вы могли полностью погрузиться в
                путешествие и получить то, за чем приехали.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-[#0a2a0a]/50 border border-[#1a6b1a]/20"
                  >
                    <v.icon className="w-5 h-5 text-(--site-accent) mb-2" />
                    <div className="text-white font-semibold text-sm mb-1">
                      {v.title}
                    </div>
                    <div className="text-white/40 text-xs leading-relaxed">
                      {v.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80"
                  alt="About"
                  fill
                  className="w-full h-full object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/60 to-transparent" />
              </div>
              {/* Floating stat */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-2 glass rounded-2xl p-5"
              >
                <div
                  className="text-3xl font-bold text-(--site-accent)"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  15K+
                </div>
                <div className="text-white/60 text-sm">довольных клиентов</div>
              </motion.div>
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-6 -right-2 glass rounded-2xl p-5"
              >
                <div
                  className="text-3xl font-bold text-(--site-accent-bright)"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  48
                </div>
                <div className="text-white/60 text-sm">стран мира</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-[#0a2a0a]/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              История
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Наш путь
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-linear-to-b from-(--site-accent)/50 via-[#1a6b1a]/30 to-transparent" />
            <div className="space-y-8">
              {timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-8 group"
                >
                  <div className="shrink-0 w-16 text-right">
                    <span className="text-(--site-accent) font-bold text-sm">
                      {event.year}
                    </span>
                  </div>
                  <div className="shrink-0 w-3 h-3 rounded-full border-2 border-(--site-accent) bg-[#030f03] mt-1 relative z-10 group-hover:scale-150 transition-transform" />
                  <div className="pb-2">
                    <h4
                      className="text-white font-bold mb-1"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {event.title}
                    </h4>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Команда
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Люди за маршрутами
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#030f03] to-transparent" />
                </div>
                <div className="p-5">
                  <h4
                    className="text-white font-bold text-lg"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {member.name}
                  </h4>
                  <div className="text-(--site-accent) text-xs mb-3">
                    {member.role}
                  </div>
                  <p className="text-white/50 text-xs italic mb-4 leading-relaxed">
                    &quot;{member.quote}&quot;
                  </p>
                  <div className="flex gap-2">
                    {[Linkedin, Instagram, Mail].map((Icon, j) => (
                      <button
                        key={j}
                        className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-(--site-accent)/30 hover:text-(--site-accent) transition-all"
                      >
                        <Icon className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews slider */}
      <section className="py-20 px-6 bg-[#0a2a0a]/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Отзывы
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Говорят наши клиенты
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence custom={reviewDir} mode="wait">
              <motion.div
                key={reviewIdx}
                custom={reviewDir}
                variants={{
                  enter: (d) => ({ x: d * 60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d) => ({ x: d * -60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/50 p-8"
              >
                <Quote className="w-8 h-8 text-(--site-accent)/30 mb-6" />
                <p className="text-white/80 text-lg leading-relaxed mb-8 italic">
                  &quot;{reviews[reviewIdx].text}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src={reviews[reviewIdx].img}
                    alt=""
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-(--site-accent)/30"
                  />
                  <div>
                    <div className="text-white font-bold">
                      {reviews[reviewIdx].name}
                    </div>
                    <div className="text-white/40 text-sm">
                      {reviews[reviewIdx].city} · {reviews[reviewIdx].tour}
                    </div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Award
                        key={i}
                        className="w-4 h-4 text-(--site-accent) fill-current"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => goReview(reviewIdx - 1)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-(--site-accent)/40 hover:text-(--site-accent) transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goReview(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx ? "w-8 bg-(--site-accent)" : "bg-white/20"}`}
                />
              ))}
              <button
                onClick={() => goReview(reviewIdx + 1)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-(--site-accent)/40 hover:text-(--site-accent) transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Carousel3 />
        </div>
      </section>

      <WhyUs />
      <MarqueeTicker />
      <Footer />
    </main>
  );
}
