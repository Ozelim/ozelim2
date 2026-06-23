"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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
  Share2,
  Phone,
  Hotel,
  Moon,
  Tag,
  CalendarRange,
  Home,
  ChefHat,
  Building2,
  MessageCircle,
  Send,
  Pencil,
  X as XIcon,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Footer from "@/components/sections/Footer";
import { RequestFormDialog } from "@/components/request-form/request-form";
import FavoriteButton from "@/components/favorite/FavoriteButton";
import { isTourBurning } from "@/lib/utils";
import { partnerView } from "@/lib/partner-pricing";

const ICON_MAP = {
  Sunrise, Bus, TreePine, Mountain, Waves, Compass, Tent, Coffee, Utensils, Bed,
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function normalizeGallery(gallery) {
  const fallback = [{ src: FALLBACK_IMG, caption: "" }];
  if (!Array.isArray(gallery) || gallery.length === 0) return fallback;
  const normalized = gallery
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") return { src: item, caption: "" };
      const src = item.src || item.url || null;
      if (!src) return null;
      return { src, caption: item.caption || item.title || "" };
    })
    .filter(Boolean);
  return normalized.length ? normalized : fallback;
}

function formatGroup(min, max) {
  const lo = Number(min) || 0;
  const hi = Number(max) || 0;
  if (lo && hi) return `${lo}–${hi}`;
  if (hi) return `до ${hi}`;
  if (lo) return `${lo}+`;
  return null;
}

function formatDays(tour) {
  if (Number(tour.days)) return `${tour.days}`;
  const lo = Number(tour.duration_min_days) || 0;
  const hi = Number(tour.duration_max_days) || 0;
  if (lo && hi && lo !== hi) return `${lo}–${hi}`;
  if (hi) return `${hi}`;
  if (lo) return `${lo}`;
  return null;
}

function plural(n, forms) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

const RU_MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const RU_MONTHS_NOM = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}`;
}

function formatSeasonRange(from, to) {
  const f = formatDate(from);
  const t = formatDate(to);
  if (f && t) return `${f} — ${t}`;
  if (f) return `с ${f}`;
  if (t) return `до ${t}`;
  return null;
}

function formatMonthRange(from, to) {
  const f = Number(from);
  const t = Number(to);
  if (f >= 1 && f <= 12 && t >= 1 && t <= 12) {
    return `${RU_MONTHS_NOM[f - 1]} — ${RU_MONTHS_NOM[t - 1]}`;
  }
  if (f >= 1 && f <= 12) return `с ${RU_MONTHS_NOM[f - 1]}`;
  if (t >= 1 && t <= 12) return `до ${RU_MONTHS_NOM[t - 1]}`;
  return null;
}

function formatPhone(p) {
  if (!p) return null;
  return p.replace(/\s+/g, " ").trim();
}

// Colorful palette for relax-type chips, keyed by slug with a stable fallback per index.
const RELAX_PALETTES = {
  family:   { bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.55)", fg: "#db2777", emoji: "👨‍👩‍👧" },
  active:   { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.55)",   fg: "#15803d", emoji: "⛰️" },
  health:   { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.55)",  fg: "#1d4ed8", emoji: "🌿" },
  beach:    { bg: "rgba(250,204,21,0.16)",  border: "rgba(250,204,21,0.6)",   fg: "#a16207", emoji: "🏖️" },
  cultural: { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.55)",  fg: "#7e22ce", emoji: "🏛️" },
  ski:      { bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.55)",  fg: "#0369a1", emoji: "⛷️" },
  eco:      { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.55)",  fg: "#047857", emoji: "🌲" },
  romantic: { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.55)",   fg: "#b91c1c", emoji: "💞" },
};
const RELAX_FALLBACK = [
  { bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.55)", fg: "#db2777", emoji: "✨" },
  { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.55)",   fg: "#15803d", emoji: "🌟" },
  { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.55)",  fg: "#1d4ed8", emoji: "💎" },
  { bg: "rgba(250,204,21,0.16)",  border: "rgba(250,204,21,0.6)",   fg: "#a16207", emoji: "☀️" },
  { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.55)",  fg: "#7e22ce", emoji: "🎭" },
  { bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.55)",  fg: "#0369a1", emoji: "❄️" },
];
function relaxPalette(slug, i = 0) {
  return RELAX_PALETTES[slug] ?? RELAX_FALLBACK[i % RELAX_FALLBACK.length];
}

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
    if (gallery.length <= 1) return;
    timerRef.current = setInterval(() => next(), 6000);
    return () => clearInterval(timerRef.current);
  }, [next, gallery.length]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const showThumbs = gallery.length > 1;

  return (
    <>
      {lightboxIndex !== null && (
        <LightboxModal
          gallery={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="flex flex-col gap-2.5">
        <div
          className="relative rounded-2xl overflow-hidden aspect-video bg-app-elevated cursor-zoom-in shadow-md"
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
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={gallery[current].src}
                alt={gallery[current].caption || "Фото тура"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
              {(gallery[current].caption || gallery.length > 1) && (
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  {gallery[current].caption ? (
                    <span className="text-white/95 text-xs font-medium bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full truncate">
                      {gallery[current].caption}
                    </span>
                  ) : <span />}
                  {gallery.length > 1 && (
                    <span className="text-white/80 text-[11px] bg-black/35 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <Camera className="w-3 h-3" />
                      {current + 1} / {gallery.length}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/55 transition-colors z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/55 transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {showThumbs && (
          <div className="grid grid-cols-6 gap-1.5">
            {gallery.slice(0, 12).map((item, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`relative rounded-lg overflow-hidden aspect-video transition-all duration-300 ${
                  i === current
                    ? "ring-2 ring-(--site-accent) ring-offset-1 ring-offset-app-bg"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 16vw, 10vw"
                />
              </button>
            ))}
          </div>
        )}
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
                  alt={gallery[current].caption || ""}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
          {gallery[current].caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <span className="text-white/90 text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                {gallery[current].caption}
              </span>
            </div>
          )}
          {gallery.length > 1 && (
            <>
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
            </>
          )}
        </div>
        {gallery.length > 1 && (
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
                <Image src={item.src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Timeline Item ─────────────────────────────────────────────────────────────

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = ICON_MAP[item.icon] ?? Compass;

  return (
    <div ref={ref} className="flex items-start gap-4">
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="w-11 h-11 shrink-0 rounded-full bg-(--site-accent)/15 border-2 border-(--site-accent) flex items-center justify-center shadow-[0_0_18px_var(--site-shadow-soft)]"
        >
          <Icon className="w-5 h-5 text-(--site-accent)" />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="flex-1 min-w-0 p-4 rounded-2xl border border-app-border bg-app-card shadow-sm hover:border-(--site-accent)/40 hover:shadow-md transition-all duration-300"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-(--site-accent) block mb-1">
          День {item.day ?? index + 1}
        </span>
        {item.title && (
          <h3
            className="text-lg font-bold text-app-fg mb-1.5 leading-snug"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {item.title}
          </h3>
        )}
        {item.description && (
          <p className="text-app-subtle text-sm leading-relaxed">{item.description}</p>
        )}
      </motion.div>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="relative">
      <div className="absolute left-[21px] top-4 bottom-4 w-px bg-linear-to-b from-transparent via-(--site-accent)/25 to-transparent" />
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <TimelineItem key={item.day ?? i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-9 h-9 shrink-0 rounded-lg bg-(--site-accent)/10 border border-(--site-accent)/25 flex items-center justify-center">
        <Icon className="w-4 h-4 text-(--site-accent)" />
      </div>
      <div className="min-w-0">
        <div className="text-app-fg font-semibold text-sm leading-tight truncate">{value}</div>
        <div className="text-app-faint text-[11px] truncate">{label}</div>
      </div>
    </div>
  );
}

// ─── Info card (separate block per metric) ────────────────────────────────────

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-app-border bg-app-card p-4 shadow-sm flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-(--site-accent)/10 border border-(--site-accent)/25 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-(--site-accent)" />
        </div>
        <div className="text-app-faint text-[11px] uppercase tracking-wider font-semibold">
          {title}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

// ─── Reviews tab ──────────────────────────────────────────────────────────────

function StarRow({ value, onChange, size = "md" }) {
  const sz = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => {
        const filled = value >= s;
        return (
          <button
            key={s}
            type="button"
            onClick={onChange ? () => onChange(s) : undefined}
            className={`${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            aria-label={`${s} ${s === 1 ? "звезда" : s < 5 ? "звезды" : "звёзд"}`}
          >
            <Star
              className={`${sz} ${filled ? "text-(--site-accent)" : "text-app-faint"}`}
              fill={filled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  const rRating = Number(review.rating) || 0;
  const displayName = review.user_name || review.author_name || "Гость";
  return (
    <div className="p-4 rounded-2xl border border-app-border bg-app-card shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full bg-(--site-accent)/10 border border-(--site-accent)/25 flex items-center justify-center text-(--site-accent) text-xs font-bold">
            {displayName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((s) => s[0])
              .join("")
              .toUpperCase() || "Г"}
          </div>
          <div className="min-w-0">
            <div className="text-app-fg text-sm font-semibold truncate">{displayName}</div>
            {review.created_at && (
              <div className="text-app-faint text-[11px]">{formatDate(review.created_at)}</div>
            )}
          </div>
        </div>
        {rRating > 0 && <StarRow value={rRating} size="sm" />}
      </div>
      {review.content && (
        <p className="text-app-subtle text-sm leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
      )}
      {review.reply && (
        <div className="mt-3 ml-3 pl-3 border-l-2 border-(--site-accent)/40">
          <div className="flex items-center gap-1.5 text-(--site-accent) text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-3 h-3" />
            Ответ организатора
            {review.reply_at && (
              <span className="text-app-faint normal-case font-normal">
                · {formatDate(review.reply_at)}
              </span>
            )}
          </div>
          <p className="text-app-subtle text-sm leading-relaxed whitespace-pre-wrap">
            {review.reply}
          </p>
        </div>
      )}
    </div>
  );
}

function LeaveReviewForm({ tourId, eligible, onCreated }) {
  const [selectedLeadId, setSelectedLeadId] = useState(eligible[0]?.lead_id ?? null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit =
    !!selectedLeadId && rating >= 1 && rating <= 5 && text.trim().length >= 10 && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: selectedLeadId, rating, text: text.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error || "Не удалось отправить отзыв");
      } else {
        setSuccess(true);
        setText("");
        onCreated?.(body?.review);
      }
    } catch (e) {
      setError(e.message || "Ошибка сети");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-app-fg font-semibold mb-1">Спасибо за отзыв!</div>
          <div className="text-app-subtle text-sm">
            Он появится на странице тура после проверки модератором.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-app-border bg-app-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-(--site-accent)" />
        <h3 className="text-app-fg font-semibold">Оставить отзыв</h3>
      </div>

      {eligible.length > 1 && (
        <div>
          <label className="text-app-faint text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">
            Поездка
          </label>
          <select
            value={selectedLeadId ?? ""}
            onChange={(e) => setSelectedLeadId(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-app-border bg-app-bg text-app-fg text-sm"
          >
            {eligible.map((e) => (
              <option key={e.lead_id} value={e.lead_id}>
                {e.processed_at
                  ? `Поездка от ${new Date(e.processed_at).toLocaleDateString("ru-RU")}`
                  : `Заявка #${e.lead_id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-app-faint text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">
          Ваша оценка
        </label>
        <StarRow value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="text-app-faint text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">
          Расскажите о поездке
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Что понравилось? Что можно улучшить? (минимум 10 символов)"
          className="w-full px-3 py-2 rounded-lg border border-app-border bg-app-bg text-app-fg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-(--site-accent)/30"
        />
        <div className="text-app-faint text-[11px] mt-1 text-right">
          {text.trim().length} / 2000
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-(--site-accent) text-(--site-on-accent) text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {submitting ? "Отправляем…" : "Отправить отзыв"}
      </button>
    </div>
  );
}

function ReviewsBlock({ tour, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [eligible, setEligible] = useState(null); // null = loading, [] = none, [...] = available
  const [authState, setAuthState] = useState("loading"); // loading | logged-in | anon

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reviews/eligible?tour_id=${tour.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setEligible(Array.isArray(d?.eligible) ? d.eligible : []);
        setAuthState("logged-in");
      })
      .catch(() => {
        if (!cancelled) {
          setEligible([]);
          setAuthState("anon");
        }
      });

    // Узнать, залогинен ли — через /api/auth/me (если 401, значит аноним)
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => {
        if (cancelled) return;
        setAuthState(r.ok ? "logged-in" : "anon");
      })
      .catch(() => {
        if (!cancelled) setAuthState("anon");
      });

    return () => {
      cancelled = true;
    };
  }, [tour.id]);

  function handleCreated() {
    // Только что отправленный отзыв уходит в pending — не показываем его сразу.
    // Просто убираем заявку из eligible, чтобы повторно не открывалась форма.
    setEligible((prev) => (prev?.length > 0 ? prev.slice(1) : []));
  }

  const showForm = authState === "logged-in" && eligible && eligible.length > 0;

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <StarRow value={Math.round(avgRating)} size="md" />
          <span className="text-app-fg font-bold text-lg leading-none">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-app-faint text-sm">
            ({reviews.length} {plural(reviews.length, ["отзыв", "отзыва", "отзывов"])})
          </span>
        </div>
      )}

      {showForm && (
        <LeaveReviewForm
          tourId={tour.id}
          eligible={eligible}
          onCreated={handleCreated}
        />
      )}

      {authState === "anon" && (
        <div className="rounded-2xl border border-app-border bg-app-card p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-app-faint shrink-0 mt-0.5" />
          <div className="text-app-subtle text-sm">
            Чтобы оставить отзыв,{" "}
            <Link href="/login" className="text-(--site-accent) underline">
              войдите
            </Link>{" "}
            и завершите поездку по этому туру.
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-app-border bg-app-card p-8 text-center">
          <MessageCircle className="w-8 h-8 text-app-faint mx-auto mb-2" />
          <p className="text-app-subtle text-sm">
            Пока нет отзывов. Будьте первым, кто поделится впечатлениями!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tabbed section: Маршрут / Отзывы ────────────────────────────────────────

function TourTabsSection({ tour, itinerary, reviews }) {
  const hasRoute = !!tour.route || itinerary.length > 0;
  const reviewsCount = reviews.length || Number(tour.reviews_count) || 0;
  const [tab, setTab] = useState(hasRoute ? "route" : "reviews");

  if (!hasRoute && reviewsCount === 0) {
    // Совсем нечего показать — но всё равно оставляем форму отзыва (для залогиненных
    // с eligible-заявкой) и пустое состояние.
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="text-(--site-accent) text-[11px] uppercase tracking-widest mb-2 font-bold">
            Отзывы
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-app-fg"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Что говорят туристы
          </h2>
        </motion.div>
        <ReviewsBlock tour={tour} initialReviews={reviews} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 border-b border-app-border mb-6">
          {hasRoute && (
            <button
              type="button"
              onClick={() => setTab("route")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === "route"
                  ? "border-(--site-accent) text-app-fg"
                  : "border-transparent text-app-faint hover:text-app-subtle"
              }`}
            >
              {itinerary.length > 0 ? "Программа" : "Маршрут"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab("reviews")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors inline-flex items-center gap-1.5 ${
              tab === "reviews"
                ? "border-(--site-accent) text-app-fg"
                : "border-transparent text-app-faint hover:text-app-subtle"
            }`}
          >
            Отзывы
            {reviewsCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === "reviews"
                    ? "bg-(--site-accent)/15 text-(--site-accent)"
                    : "bg-app-bg text-app-faint border border-app-border"
                }`}
              >
                {reviewsCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {tab === "route" && hasRoute && (
        <div>
          {tour.route && (
            <div
              className="prose-tour text-app-subtle leading-relaxed text-[15px] mb-8"
              dangerouslySetInnerHTML={{ __html: tour.route }}
            />
          )}
          {itinerary.length > 0 && <Timeline items={itinerary} />}
        </div>
      )}

      {tab === "reviews" && <ReviewsBlock tour={tour} initialReviews={reviews} />}
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────────

export default function TourClient({ tour, loggedIn = false }) {
  const gallery = useMemo(() => normalizeGallery(tour.gallery), [tour.gallery]);
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary.filter(Boolean) : [];
  const includes = Array.isArray(tour.includes) ? tour.includes.filter(Boolean) : [];
  const tags = Array.isArray(tour.tags) ? tour.tags.filter(Boolean) : [];

  // Prefer joined relax_types (with proper Russian names) over raw tour_types slugs.
  const relaxTypes = Array.isArray(tour.relax_types) && tour.relax_types.length
    ? tour.relax_types
    : (Array.isArray(tour.tour_types) ? tour.tour_types.filter(Boolean).map((slug) => ({ slug, name: slug })) : []);

  const direction = tour.direction || null;
  const org = tour.org || null;
  const reviews = Array.isArray(tour.reviews) ? tour.reviews : [];
  const accommodations = Array.isArray(tour.accommodations) ? tour.accommodations : [];
  const mealPlan = tour.meal_plan_full || (tour.meal_plan ? { slug: tour.meal_plan, name: tour.meal_plan } : null);

  const daysValue = formatDays(tour);
  const nightsValue = Number(tour.nights) || null;
  const groupValue = formatGroup(tour.group_min, tour.group_max);
  const hasHotelClass = !!tour.hotel_class;
  // Считаем рейтинг и кол-во из реальных visible-отзывов;
  // если их нет — fallback на денормализованные tour.rating / tour.reviews_count.
  const reviewsCount = reviews.length || Number(tour.reviews_count) || 0;
  const rating = reviews.length
    ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length
    : Number(tour.rating) || 0;
  const price = tour.price_adult ?? tour.price;
  const priceChild = tour.price_child;
  // Партнёрская скидка: видимость посчитана на сервере (loggedIn), без мерцания.
  const partnerPrice = partnerView({ price, pct: tour.partner_discount_pct, loggedIn });
  const partnerPriceChild = partnerView({ price: priceChild, pct: tour.partner_discount_pct, loggedIn });
  const locationParts = [tour.city, tour.region, tour.country, direction?.region].filter(Boolean);
  const location = locationParts.length
    ? [...new Set(locationParts)].join(", ")
    : (tour.subtitle || tour.location || direction?.name || null);

  const seasonText =
    formatSeasonRange(tour.season_from, tour.season_to) ||
    formatMonthRange(direction?.best_month_from, direction?.best_month_to);
  const burning = isTourBurning(tour.season_from, tour.season_to);

  return (
    <div className="min-h-screen bg-app-bg text-app-fg">

      {/* ── Hero bar with subtle background ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${gallery[0].src}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-app-bg/20 via-app-bg/75 to-app-bg" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-app-subtle hover:text-app-fg text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Все туры
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Two-column main area: gallery + (organizer, price) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left: gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <ImageSlider gallery={gallery} />
          </motion.div>

          {/* Right: title + badges + organizer + price */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24"
          >
            {/* Title + location */}
            <div>
              <h1
                className="text-3xl xl:text-4xl font-bold text-app-fg leading-[1.1] mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {tour.title}
              </h1>
              {location && (
                <div className="flex items-center gap-1.5 text-app-subtle text-sm">
                  <MapPin className="w-3.5 h-3.5 text-(--site-accent) shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            {(burning || tour.hot || tour.is_popular || direction || tour.country) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {burning && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600/90 border border-rose-300/50 text-white text-[11px] font-bold shadow-[0_0_12px_rgba(225,29,72,0.55)]">
                    🔥 Горящий
                  </span>
                )}
                {tour.hot && (
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/90 border border-orange-300/50 text-white text-[11px] font-bold">
                    HOT
                  </span>
                )}
                {tour.is_popular && (
                  <span className="px-2.5 py-1 rounded-full bg-(--site-accent)/15 text-(--site-accent) text-[11px] font-bold border border-(--site-accent)/40">
                    ⭐ Популярный
                  </span>
                )}
                {direction && (
                  <Link
                    href={`/directions/${direction.id}`}
                    className="px-2.5 py-1 rounded-full border border-(--site-accent)/40 text-(--site-accent) text-[11px] font-semibold bg-(--site-accent)/6 hover:bg-(--site-accent)/12 transition-colors inline-flex items-center gap-1"
                  >
                    <Compass className="w-3 h-3" />
                    {direction.name}
                  </Link>
                )}
                {tour.country && (
                  <span className="px-2.5 py-1 rounded-full border border-app-border text-app-subtle text-[11px] font-semibold">
                    {tour.country}
                  </span>
                )}
              </div>
            )}

            {/* Provider (org) */}
            {org && (
              <div className="rounded-2xl border border-app-border bg-app-card p-4 shadow-sm">
                <div className="text-app-faint text-[11px] uppercase tracking-wider mb-2.5">
                  Организатор
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden bg-(--site-accent)/10 border border-app-border flex items-center justify-center">
                    {org.avatar_url ? (
                      <Image
                        src={org.avatar_url}
                        alt={org.name || ""}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-(--site-accent)" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-app-fg font-semibold text-sm truncate">
                      {org.name || "Организатор тура"}
                    </div>
                  </div>
                </div>
                {/* Описание гида показываем только в админке (страница «Гиды»),
                    на публичной странице тура его не выводим. */}
              </div>
            )}

            {/* Price & CTA */}
            <div className="rounded-2xl border border-app-border bg-app-card p-4 shadow-sm">
              <div className="flex items-end justify-between gap-3 mb-3">
                <div>
                  <div className="text-app-faint text-[11px] uppercase tracking-wider">Стоимость от</div>
                  <div className="flex items-baseline gap-2">
                    <div
                      className="text-3xl font-bold text-(--site-accent) leading-tight"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {Number((partnerPrice.mode === "discounted" ? partnerPrice.now : price) || 0).toLocaleString("ru-RU")} ₸
                    </div>
                    {partnerPrice.mode === "discounted" && (
                      <span className="text-app-faint text-base line-through">
                        {Number(partnerPrice.was).toLocaleString("ru-RU")} ₸
                      </span>
                    )}
                  </div>
                  {(partnerPrice.mode === "discounted" || partnerPrice.mode === "teaser") && (
                    <div className="mt-1 inline-block rounded-full bg-amber-100 text-amber-700 text-[11px] font-medium px-2 py-0.5">
                      −{partnerPrice.pct}% для партнёров OzElim
                    </div>
                  )}
                  <div className="text-app-faint text-[11px] mt-0.5">
                    за взрослого{priceChild ? ` · детский ${Number((partnerPriceChild.mode === "discounted" ? partnerPriceChild.now : priceChild)).toLocaleString("ru-RU")} ₸` : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RequestFormDialog
                  kind="tour_booking"
                  tourId={tour.id}
                  source={`/tours/${tour.id}`}
                  context={{ tourTitle: tour.title, tourPrice: price }}
                  trigger={
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-semibold text-sm shadow-md hover:shadow-[0_8px_24px_var(--site-shadow-strong)] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Записаться
                    </motion.button>
                  }
                />
                <FavoriteButton kind="tour" id={tour.id} variant="inline" />
                <button
                  aria-label="Поделиться"
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-app-border text-app-subtle hover:border-(--site-accent)/40 hover:text-(--site-accent) transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── О туре — title + all meta + description ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-app-fg leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Подробнее о программе
          </h2>

          {/* Rating */}
          {(rating > 0 || reviewsCount > 0) && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-(--site-accent)"
                    fill={i < Math.round(rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              {rating > 0 && <span className="text-app-fg font-bold text-sm">{rating.toFixed(1)}</span>}
              {reviewsCount > 0 && (
                <span className="text-app-faint text-xs">({reviewsCount} {plural(reviewsCount, ["отзыв", "отзыва", "отзывов"])})</span>
              )}
            </div>
          )}

          {/* Separate cards: длительность · размещение · сезон · питание */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Длительность тура */}
            {(daysValue || nightsValue || groupValue) && (
              <InfoCard icon={Clock} title="Длительность тура">
                {daysValue && (
                  <div className="text-app-fg font-semibold text-base">
                    {daysValue} {plural(Number(daysValue.split("–").pop()), ["день", "дня", "дней"])}
                  </div>
                )}
                {nightsValue && (
                  <div className="text-app-subtle text-[13px]">
                    {nightsValue} {plural(nightsValue, ["ночь", "ночи", "ночей"])}
                  </div>
                )}
                {groupValue && (
                  <div className="text-app-subtle text-[13px]">
                    Группа: {groupValue} чел.
                  </div>
                )}
              </InfoCard>
            )}

            {/* Размещение */}
            <InfoCard icon={Hotel} title="Размещение">
              <div className="text-app-fg font-semibold text-base">
                {hasHotelClass ? `Отель ${tour.hotel_class}★` : "Обычный"}
              </div>
              {accommodations.length > 0 && (
                <div className="text-app-subtle text-[13px]">
                  {accommodations.map((a) => a.name).join(", ")}
                </div>
              )}
            </InfoCard>

            {/* Сезон */}
            {seasonText && (
              <InfoCard icon={CalendarRange} title="Сезон">
                <div className="text-app-fg font-semibold text-base leading-snug">
                  {seasonText}
                </div>
              </InfoCard>
            )}

            {/* Питание */}
            {mealPlan && (
              <InfoCard icon={ChefHat} title="Питание">
                <div className="text-app-fg font-semibold text-base leading-snug">
                  {mealPlan.name}
                </div>
              </InfoCard>
            )}
          </div>

          {/* Relax types — colorful chips */}
          {relaxTypes.length > 0 && (
            <div>
              <div className="text-app-faint text-[11px] uppercase tracking-wider font-semibold mb-2">
                Виды отдыха
              </div>
              <div className="flex flex-wrap gap-2">
                {relaxTypes.map((rt, i) => {
                  const palette = relaxPalette(rt.slug, i);
                  return (
                    <span
                      key={`rt-${rt.slug || rt.name}`}
                      className="px-4 py-2 rounded-full text-sm font-semibold border"
                      style={{
                        background: palette.bg,
                        borderColor: palette.border,
                        color: palette.fg,
                      }}
                    >
                      {rt.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={`tag-${t}`}
                  className="px-2.5 py-1 rounded-full bg-(--site-accent)/8 border border-(--site-accent)/30 text-(--site-accent) text-[11px] inline-flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Includes */}
          {includes.length > 0 && (
            <div className="rounded-2xl border border-(--site-accent)/25 bg-(--site-accent)/6 p-4">
              <div className="text-app-fg text-[11px] uppercase tracking-widest font-bold mb-2.5">
                Включено в стоимость
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {includes.map((inc, i) => {
                  const label = typeof inc === "string" ? inc : inc?.text || inc?.label;
                  if (!label) return null;
                  return (
                    <div key={`${label}-${i}`} className="flex items-center gap-2 text-app-muted text-[13px]">
                      <div className="w-4 h-4 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/40 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-(--site-accent)" />
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description HTML */}
          {tour.description && (
            <div
              className="prose-tour text-app-subtle leading-relaxed text-[15px]"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />
          )}
        </motion.div>
      </div>

      {/* ── Tabs: Маршрут / Отзывы ── */}
      <TourTabsSection tour={tour} itinerary={itinerary} reviews={reviews} />

      <style>{`
        .prose-tour p { margin: 0 0 0.75em 0; }
        .prose-tour p:last-child { margin-bottom: 0; }
        .prose-tour ul, .prose-tour ol { margin: 0.5em 0 0.75em 1.25em; }
        .prose-tour li { margin: 0.25em 0; }
        .prose-tour strong { color: var(--app-fg, inherit); font-weight: 600; }
        .prose-tour a { color: var(--site-accent); text-decoration: underline; }
      `}</style>

      <Footer />
    </div>
  );
}
