"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  FileCheck,
  ShieldCheck,
  HandCoins,
  UsersRound,
  Scale,
  Waves,
  Ticket,
  Star,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Heart,
  MessageCircleQuestion
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TourSelectionDialog } from "../tour-selection/tour-selection";

// ─── Service tiles ────────────────────────────────────────────────────────────
const TILES = [
  { label: "Поездки",                        icon: Plane,       href: "/trips" },
  { label: "Визы",                           icon: FileCheck,   href: "https://vizapro.kz", external: true },
  { label: "Halyk Life",                     icon: ShieldCheck, image: "/halyk-life.png", href: "/insurance" },
  { label: "Фонд",                           icon: HandCoins,   href: "/endowment" },
  { label: "Ассоциация туристов Казахстана", icon: UsersRound,  href: "/association" },
  { label: "Правовая защита",                icon: Scale,       href: "/legal" },
  { label: "Nomad Insurance",                icon: Waves,       image: "/nomad.svg", href: "/sanatoriums" },
  { label: "АВИА ЖД билеты",                icon: Ticket,      href: "/tickets" },
  { label: "О нас",                icon: Users,      href: "/about" },
  { label: `Вопрос-ответ`,                icon: MessageCircleQuestion,      href: "/faq" },
];

// ─── Tour cards data (trips page hero) ───────────────────────────────────────
const TOURS = [
  {
    img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=75",
    country: "Испания", city: "Барселона",
    title: "Сокровища Каталонии",
    days: 8, group: "6–12", rating: 4.9, reviews: 128, price: 2100, hot: true,
  },
  {
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=75",
    country: "Франция", city: "Прованс",
    title: "Лавандовые поля Прованса",
    days: 6, group: "8–16", rating: 4.8, reviews: 94, price: 1850, hot: false,
  },
  {
    img: "https://images.unsplash.com/photo-1527549993586-dff825b37782?w=600&q=75",
    country: "Исландия", city: "Рейкьявик",
    title: "Северное сияние",
    days: 7, group: "4–10", rating: 5.0, reviews: 67, price: 3400, hot: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=600&q=75",
    country: "Хорватия", city: "Дубровник",
    title: "Жемчужина Адриатики",
    days: 10, group: "10–18", rating: 4.7, reviews: 151, price: 2600, hot: false,
  },
  {
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=75",
    country: "Норвегия", city: "Фьорды",
    title: "Мистические фьорды",
    days: 12, group: "6–14", rating: 4.9, reviews: 83, price: 3100, hot: false,
  },
  {
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=75",
    country: "Кения", city: "Масаи Мара",
    title: "Великое переселение",
    days: 11, group: "4–8", rating: 5.0, reviews: 45, price: 5200, hot: true,
  },
];

// ─── Tour Carousel (infinite loop) ───────────────────────────────────────────
const CARD_WIDTH = 408;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;
const N = TOURS.length;
const SET_WIDTH = N * STEP;
// Triple the list so we always have cards on both sides
const ITEMS = [...TOURS, ...TOURS, ...TOURS];
const START = -SET_WIDTH; // begin at middle copy

function TourCard({ tour, i }) {
  return (
    <div
      className="w-full md:w-[408px] group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 shrink-0"
    >
      <div className="relative h-52 overflow-hidden media-contrast">
        <Image
          src={tour.img}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="408px"
          priority={i < 3}
          draggable={false}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        {tour.hot && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-(--site-accent) text-(--site-on-accent) text-xs font-bold">
            🔥 Горящий
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/10 transition-all">
          <Heart className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-(--site-accent)">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-sm font-bold">{tour.rating}</span>
          <span className="text-white/50 text-xs">({tour.reviews})</span>
        </div>
      </div>
      <div className="p-5 tour-card-body">
        <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
          <MapPin className="w-3 h-3" />{tour.city}, {tour.country}
        </div>
        <h3 className="text-white font-bold text-xl mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          {tour.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-white/50 mb-5">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{tour.days} дней</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{tour.group} чел.</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/40 text-xs">от</div>
            <div className="text-(--site-accent) font-bold text-xl">{tour.price.toLocaleString()} ₸</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-linear-to-r from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/30 text-(--site-accent) text-sm font-medium hover:from-(--site-accent) hover:to-(--site-accent-bright) hover:text-(--site-on-accent) transition-all duration-300"
          >
            Подробнее
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function TourCarousel() {
  const trackRef = useRef(null);
  const xRef = useRef(START);
  const autoRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const wrap = (val) => {
    let v = val;
    if (v <= -(2 * SET_WIDTH)) v += SET_WIDTH;
    else if (v >= 0) v -= SET_WIDTH;
    return v;
  };

  const applyX = (val, animated) => {
    const el = trackRef.current;
    if (!el) return;
    xRef.current = val;
    el.style.transition = animated ? "transform 0.52s cubic-bezier(0.25, 1, 0.35, 1)" : "none";
    el.style.transform = `translateX(${val}px)`;
    setActiveIdx(((Math.round(-val / STEP) % N) + N) % N);
  };

  const step = (dir) => {
    const next = xRef.current - dir * STEP;
    applyX(next, true);
    setTimeout(() => {
      const wrapped = wrap(xRef.current);
      if (wrapped !== xRef.current) applyX(wrapped, false);
    }, 530);
  };

  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => step(1), 5000);
  };
  const stopAuto = () => clearInterval(autoRef.current);

  useEffect(() => {
    applyX(START, false);
    startAuto();
    return stopAuto;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleArrow = (dir) => {
    stopAuto();
    step(dir);
    setTimeout(startAuto, 550);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="pb-20 pt-10 w-full"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-8 px-6 max-w-7xl mx-auto tour-carousel-header">
        <div>
          <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">Туры</div>
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Популярные направления
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleArrow(-1)}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-(--site-accent) hover:border-(--site-accent) transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            onClick={() => handleArrow(1)}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-(--site-accent) hover:border-(--site-accent) transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ paddingLeft: 24, gap: GAP }}
        >
          {ITEMS.map((tour, i) => (
            <TourCard key={`${tour.title}-${i}`} tour={tour} i={i} />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {TOURS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              stopAuto();
              const target = START - i * STEP;
              applyX(target, true);
              setTimeout(() => {
                const wrapped = wrap(xRef.current);
                if (wrapped !== xRef.current) applyX(wrapped, false);
                startAuto();
              }, 530);
            }}
            className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 h-1.5 bg-(--site-accent)" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero({ title, subtitle, highlight }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTrips = pathname === "/trips";
  const showTiles = isHome;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-app-scrim-from via-app-scrim-mid to-app-bg" />

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FFD700]/60"
          style={{ left: `${15 + i * 15}%`, top: `${15 + (i % 3) * 18}%` }}
          animate={{ y: [-20, 20, -20], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Text + buttons */}
        <div
          className={[
            "text-center px-6 max-w-5xl mx-auto w-full",
            showTiles || isTrips
              ? "pt-28 md:pt-32 lg:pt-36"
              : "flex-1 flex flex-col justify-center",
          ].join(" ")}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold leading-none mb-5"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize:
                showTiles || isTrips
                  ? "clamp(3.1rem, 9vw, 6.4rem)"
                  : "clamp(3.5rem, 10vw, 7rem)",
            }}
          >
            <span style={{ color: "#ffffff" }}>{title}</span>
            {highlight && (
              <>
                {" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #C8FF00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {highlight}
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <TourSelectionDialog />

            {isHome && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full border border-white/30 text-white hover:border-[#FFD700]/50 hover:bg-white/5 font-medium text-sm tracking-wider uppercase transition-colors"
              >
                <Link href="/trips">Посмотреть поездки</Link>
              </motion.button>
            )}
            {!isHome && !isTrips && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full border border-white/30 text-white hover:border-[#FFD700]/50 hover:bg-white/5 font-medium text-sm tracking-wider uppercase transition-colors"
              >
                Узнать больше
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* ── Service tiles (home only) ── */}
        {showTiles && (
          <div className="px-6 pb-24 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl mx-auto w-full"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {TILES.map((tile, i) => (
                  <motion.a
                    key={tile.label}
                    href={tile.href}
                    target={tile.external ? "_blank" : undefined}
                    rel={tile.external ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -5, scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group flex flex-col items-center justify-center gap-3 rounded-2xl border border-(--site-accent)/30 bg-(--site-accent)/10 backdrop-blur-sm hover:bg-(--site-accent)/20 hover:border-(--site-accent)/60 transition-all duration-300 cursor-pointer p-5`}
                  >
                    {tile.image
                      ? <Image src={tile.image} alt={tile.label} width={40} height={40} className="w-10 h-10 object-contain" />
                      : <tile.icon className="w-10 h-10 text-green-300 dark:text-(--site-accent-bright)" strokeWidth={1.5} />
                    }
                    <span className="text-white font-semibold text-center leading-tight line-clamp-2">
                      {tile.label} <br/>  <span className="opacity-0">1</span>
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Tour cards carousel (trips page only) ── */}
        {isTrips && <TourCarousel />}
      </div>
    </section>
  );
}
