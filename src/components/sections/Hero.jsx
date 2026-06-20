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
  MapPin,
  Clock,
  Users,
  ArrowRight,
  MessageCircleQuestion,
  Baby,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TourSelectionDialog } from "../tour-selection/tour-selection";
import { RequestFormDialog } from "../request-form/request-form";
import FavoriteButton from "../favorite/FavoriteButton";

// ─── Service tiles ────────────────────────────────────────────────────────────
const TILES = [
  { label: "Туры",                           icon: Plane,       href: "/trips" },
  { label: "Визы",                           icon: FileCheck,   href: "https://vizapro.kz", external: true },
  { label: "Halyk Life Страхование",         icon: ShieldCheck, image: "/halyk-life.png", href: "/insurance" },
  { label: "Эндаумент Фонд",                 icon: HandCoins,   href: "/endowment" },
  { label: "Ассоциация туристов Казахстана", icon: UsersRound,  href: "/association" },
  { label: "Правовая защита",                icon: Scale,       href: "/legal" },
  { label: "Nomad Insurance Страхование",    icon: Waves,       image: "/nomad.svg", href: "/nomad-insurance" },
  { label: "Авиа перелеты",                  icon: Ticket,      href: "/tickets" },
  { label: "О нас",                icon: Users,      href: "/about" },
  { label: `Вопрос-ответ`,                icon: MessageCircleQuestion,      href: "/faq" },
];

// ─── Tour Carousel (infinite loop, dynamic data) ─────────────────────────────
const CARD_WIDTH = 408;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;

function PopularTourCard({ tour, i }) {
  const img = Array.isArray(tour.gallery) && tour.gallery.length > 0 ? tour.gallery[0] : null;
  const price = tour.price_adult ?? tour.price;
  const duration = tour.duration_min_days != null
    ? (tour.duration_max_days && tour.duration_max_days !== tour.duration_min_days
        ? `${tour.duration_min_days}–${tour.duration_max_days} дн.`
        : `${tour.duration_min_days} дн.`)
    : null;

  return (
    <div className="w-full md:w-[408px] group relative rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 shrink-0">
      {tour.id && (
        <FavoriteButton kind="tour" id={tour.id} variant="absolute" />
      )}
      <div className="relative aspect-video overflow-hidden media-contrast bg-[#0a1a0a]">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <MapPin className="w-16 h-16 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        {tour.hot && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none tracking-wide">
            HOT
          </span>
        )}
        {tour.popular_order && (
          <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
            #{tour.popular_order}
          </span>
        )}
      </div>
      <div className="p-5 tour-card-body">
        {tour.direction_name && (
          <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
            <MapPin className="w-3 h-3" />{tour.direction_name}
          </div>
        )}
        <h3 className="text-white font-bold text-xl mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          {tour.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-white/50 mb-5">
          {duration && (
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{duration}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/40 text-xs">от</div>
            <div className="text-(--site-accent) font-bold text-xl">
              {price != null ? Number(price).toLocaleString("ru-RU") : "—"} ₸
            </div>
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
  const [tours, setTours] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/tours/popular")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setTours(Array.isArray(data) ? data : []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const trackRef = useRef(null);
  const xRef = useRef(0);
  const autoRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const N = tours.length;
  const SET_WIDTH = N * STEP;
  const START = -SET_WIDTH;
  const ITEMS = N > 0 ? [...tours, ...tours, ...tours] : [];

  const wrap = (val) => {
    if (N === 0) return val;
    let v = val;
    if (v <= -(2 * SET_WIDTH)) v += SET_WIDTH;
    else if (v >= 0) v -= SET_WIDTH;
    return v;
  };

  const applyX = (val, animated) => {
    const el = trackRef.current;
    if (!el || N === 0) return;
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

  const stopAuto = () => clearInterval(autoRef.current);
  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => step(1), 5000);
  };

  useEffect(() => {
    if (N === 0) return;
    applyX(START, false);
    startAuto();
    return stopAuto;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  const handleArrow = (dir) => {
    stopAuto();
    step(dir);
    setTimeout(startAuto, 550);
  };

  if (!loaded) return null;
  if (N === 0) return null;

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
          <div className="text-white text-xs uppercase tracking-widest mb-2">Туры</div>
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
            <PopularTourCard key={`${tour.id}-${i}`} tour={tour} i={i} />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {tours.map((_, i) => (
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

// ─── Kids Go Free animated banner ─────────────────────────────────────────────
function KidsGoFreeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-full border border-(--site-accent)/40 bg-linear-to-r from-(--site-gradient-from)/30 via-(--site-accent-bright)/35 to-(--site-gradient-to)/30 backdrop-blur-sm py-2.5 shadow-[0_0_30px_var(--site-shadow-soft)] cursor-pointer hover:border-(--site-accent)/70 transition-colors"
    >
      <Link href="/kidsgofree" className="absolute inset-0 z-20" aria-label="Подробнее о Kids Go Free" />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        animate={{ x: ["-120%", "420%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-10 flex justify-center items-center gap-2.5 font-bold text-sm tracking-[0.2em] uppercase">
        <motion.span
          animate={{ rotate: [0, 12, -12, 0], y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <Baby className="w-4 h-4 text-(--site-accent-bright)" />
        </motion.span>
        <motion.span
          animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--site-accent-bright), #ffffff, var(--site-accent-bright), #ffffff, var(--site-accent-bright))",
            backgroundSize: "200% 100%",
          }}
        >
          Kids Go Free
        </motion.span>
        <motion.span
          animate={{ rotate: [0, -360], scale: [1, 1.15, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <Sparkles className="w-4 h-4 text-(--site-accent-bright)" />
        </motion.span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="-mt-2 mb-6 italic text-white/75"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)",
              lineHeight: 1.1,
            }}
          >
            вместе с{" "}
            <span
              className="not-italic font-semibold"
              style={{
                background: "linear-gradient(135deg, #FFD700, #C8FF00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OzElim
            </span>
          </motion.p>

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
            className="inline-flex flex-col items-stretch gap-3 mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TourSelectionDialog />

              {isHome && <RequestFormDialog />}
              {!isHome && !isTrips && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-full border border-white/30 text-white hover:border-[#FFD700]/50 hover:bg-white/5 font-medium text-sm tracking-wider uppercase transition-colors"
                >
                  Узнать больше
                </motion.button>
              )}
            </div>

            {isHome && <KidsGoFreeBanner />}
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
