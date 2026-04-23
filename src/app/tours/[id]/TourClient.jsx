"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Star,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Check,
  Calendar,
  Utensils,
  Bed,
  Bus,
  Mountain,
  Waves,
  TreePine,
  Compass,
  Sunrise,
  Tent,
  Coffee,
  Heart,
  Share2,
  Phone,
} from "lucide-react";
import Footer from "@/components/sections/Footer";

const ICON_MAP = {
  Sunrise,
  Bus,
  TreePine,
  Mountain,
  Waves,
  Compass,
  Tent,
  Coffee,
  Utensils,
  Bed,
};

// ─── Image Slider ──────────────────────────────────────────────────────────────

function ImageSlider({ gallery }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const timerRef = useRef(null);

  const go = useCallback(
    (idx) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent((idx + gallery.length) % gallery.length);
    },
    [current, gallery.length],
  );

  const prev = useCallback(() => go(current - 1), [current, go]);
  const next = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    timerRef.current = setInterval(() => next(), 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <>
      {lightboxIndex !== null && (
        <LightboxModal
          gallery={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="flex flex-col gap-3 h-full">
        <div
          className="relative rounded-3xl overflow-hidden aspect-4/3 bg-[#0a2a0a]/40 cursor-zoom-in"
          onClick={() => setLightboxIndex(current)}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={gallery[current].src}
                alt={gallery[current].caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {gallery[current].caption}
                </span>
                <span className="text-white/60 text-xs bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  {current + 1} / {gallery.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); go(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {gallery.map((item, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-300 ${
                i === current
                  ? "ring-2 ring-(--site-accent) ring-offset-2 ring-offset-transparent scale-105"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function LightboxModal({ gallery, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (idx) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent((idx + gallery.length) % gallery.length);
    },
    [current, gallery.length],
  );

  const prev = useCallback(() => go(current - 1), [current, go]);
  const next = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-9999 flex flex-col bg-black/95 backdrop-blur-md"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ✕
        </button>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          {current + 1} / {gallery.length}
        </div>
        <div className="relative flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center p-12"
            >
              <div className="relative w-full h-full">
                <Image
                  src={gallery[current].src}
                  alt={gallery[current].caption}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <span className="text-white/90 text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              {gallery[current].caption}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-2 p-4 justify-center overflow-x-auto" onClick={(e) => e.stopPropagation()}>
          {gallery.map((item, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative rounded-xl overflow-hidden shrink-0 w-16 h-16 transition-all duration-300 ${
                i === current
                  ? "ring-2 ring-(--site-accent) ring-offset-2 ring-offset-black scale-110"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={item.src} alt={item.caption} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Timeline Item ─────────────────────────────────────────────────────────────

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;
  const Icon = ICON_MAP[item.icon] ?? Compass;

  return (
    <div ref={ref}>
      {/* ── Mobile layout (< md): icon left, card right ── */}
      <div className="flex md:hidden items-start gap-4">
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="w-11 h-11 rounded-full bg-[#0a2a0a] border-2 border-(--site-accent) flex items-center justify-center shadow-[0_0_14px_rgba(255,215,0,0.2)] shrink-0"
          >
            <Icon className="w-5 h-5 text-(--site-accent)" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="flex-1 min-w-0 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/50 backdrop-blur-sm p-4"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-(--site-accent) block mb-1">
            День {item.day}
          </span>
          <h3
            className="text-lg font-bold text-white mb-2 leading-snug"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {item.title}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed">{item.description}</p>
        </motion.div>
      </div>

      {/* ── Desktop layout (md+): alternating snake ── */}
      <div
        className={`hidden md:flex relative items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -48 : 48 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-[calc(50%-36px)] shrink-0"
        >
          <div
            className={`rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/50 backdrop-blur-sm hover:border-(--site-accent)/30 transition-all duration-500 group ${
              isLeft ? "mr-6" : "ml-6"
            }`}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-(--site-accent)">
                  День {item.day}
                </span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-2.5"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {item.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 shrink-0 w-[72px] flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="w-12 h-12 rounded-full bg-[#0a2a0a] border-2 border-(--site-accent) flex items-center justify-center shadow-[0_0_18px_rgba(255,215,0,0.25)]"
          >
            <Icon className="w-5 h-5 text-(--site-accent)" />
          </motion.div>
        </div>

        <div className="w-[calc(50%-36px)] shrink-0" />
      </div>
    </div>
  );
}

function SnakeTimeline({ items }) {
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-(--site-accent)/30 to-transparent" />
      <div className="md:hidden absolute left-[21px] top-4 bottom-4 w-px bg-linear-to-b from-transparent via-(--site-accent)/25 to-transparent" />

      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        aria-hidden
      >
        {items.slice(0, -1).map((_, i) => {
          const itemH = 252;
          const cy = i * itemH + itemH / 2;
          const nextCy = (i + 1) * itemH + itemH / 2;
          const midY = (cy + nextCy) / 2;

          return (
            <motion.path
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              d={`M 50% ${cy + 24} Q 50% ${midY}, 50% ${nextCy - 24}`}
              stroke="var(--site-accent)"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 6"
            />
          );
        })}
      </svg>

      <div className="flex flex-col gap-5 md:gap-6">
        {items.map((item, i) => (
          <TimelineItem key={item.day} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────────

export default function TourClient({ tour }) {
  const itinerary = tour.itinerary ?? [];

  return (
    <div className="min-h-screen bg-app-bg text-app-fg">
      {/* Hero bar */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('${tour.gallery[0]?.src}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-app-bg/0 via-app-bg/60 to-app-bg" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Все туры
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main two-col section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Left: carousel */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageSlider gallery={tour.gallery} />
          </motion.div>

          {/* Right: info */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {tour.is_hot && (
                <span className="px-3 py-1 rounded-full bg-(--site-accent) text-(--site-on-accent) text-xs font-bold">
                  🔥 Горящий тур
                </span>
              )}
              <span className="px-3 py-1 rounded-full border border-(--site-accent)/30 text-(--site-accent) text-xs font-medium">
                {tour.country}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1
                className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {tour.title}
              </h1>
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <MapPin className="w-3.5 h-3.5 text-(--site-accent)" />
                {tour.subtitle}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-(--site-accent)"
                    fill={i < Math.round(tour.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-white font-bold">{tour.rating}</span>
              <span className="text-white/40 text-sm">({tour.reviews_count} отзывов)</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Clock, label: "Длительность", value: `${tour.days} дней` },
                { icon: Users, label: "Группа", value: `${tour.group_size} чел.` },
                { icon: Calendar, label: "Ночей", value: `${tour.nights}` },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 p-3.5 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40"
                >
                  <Icon className="w-4 h-4 text-(--site-accent)" />
                  <div className="text-white font-semibold text-sm">{value}</div>
                  <div className="text-white/40 text-xs">{label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/60 leading-relaxed text-[15px]">{tour.description}</p>

            {/* Includes */}
            <div className="rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-5">
              <div className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-3">
                Включено в стоимость
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(tour.includes ?? []).map((inc) => {
                  const label = typeof inc === "string" ? inc : inc.text;
                  return (
                    <div key={label} className="flex items-center gap-2.5 text-white/70 text-sm">
                      <div className="w-4 h-4 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-(--site-accent)" />
                      </div>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-end justify-between gap-4 pt-2">
              <div>
                <div className="text-white/40 text-xs mb-0.5">Стоимость от</div>
                <div
                  className="text-4xl font-bold text-(--site-accent)"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {Number(tour.price).toLocaleString()} {tour.currency}
                </div>
                <div className="text-white/35 text-xs mt-0.5">за человека · {tour.days} дней</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white text-sm transition-all">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white text-sm transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-semibold text-sm shadow-lg hover:shadow-(--site-accent)/30 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Забронировать
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Timeline section */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
            Маршрут
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {tour.days} дней приключений
          </h2>
          <p className="text-white/45 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            Детальная программа каждого дня — от рассвета до заката
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-(--site-accent)/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-(--site-accent)" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-(--site-accent)/40" />
          </div>
        </motion.div>

        <SnakeTimeline items={itinerary} />
      </div>

      <Footer />
    </div>
  );
}
