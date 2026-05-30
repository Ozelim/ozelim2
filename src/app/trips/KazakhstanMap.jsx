"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MapPin,
  List,
  Map,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Waves,
  TreePine,
  Compass,
  Wind,
  CircleDot,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/favorite/FavoriteButton";
import { isTourBurning } from "@/lib/utils";

const KZ_REGIONS = [
  { name: "Абайская", coords: [48.5, 80.0] },
  { name: "Акмолинская", coords: [51.5, 69.5] },
  { name: "Актюбинская", coords: [48.5, 58.5] },
  { name: "Алматинская", coords: [44.5, 77.0] },
  { name: "Атырауская", coords: [47.5, 52.5] },
  { name: "Западно-Казахстанская", coords: [50.0, 51.5] },
  { name: "Жамбылская", coords: [44.5, 71.5] },
  { name: "Жетысуская", coords: [45.5, 79.5] },
  { name: "Карагандинская", coords: [49.0, 72.5] },
  { name: "Костанайская", coords: [51.5, 64.0] },
  { name: "Кызылординская", coords: [45.0, 64.5] },
  { name: "Мангистауская", coords: [44.0, 53.0] },
  { name: "Павлодарская", coords: [52.3, 77.0] },
  { name: "Северо-Казахстанская", coords: [54.0, 69.5] },
  { name: "Туркестанская", coords: [43.5, 68.5] },
  { name: "Улытауская", coords: [48.5, 67.5] },
  { name: "Восточно-Казахстанская", coords: [49.0, 83.5] },
];

const KZ_CITIES = [
  { name: "АСТАНА", coords: [51.1695, 71.4491], bold: true },
  { name: "АЛМАТЫ", coords: [43.222, 76.8512], bold: true },
  { name: "ШЫМКЕНТ", coords: [42.3027, 69.5682], bold: true },
  { name: "Актобе", coords: [50.2839, 57.1669] },
  { name: "Караганда", coords: [49.8019, 73.1021] },
  { name: "Павлодар", coords: [52.2873, 76.9674] },
  { name: "Усть-Каменогорск", coords: [49.9482, 82.6125] },
  { name: "Семей", coords: [50.4111, 80.2275] },
  { name: "Атырау", coords: [47.0945, 51.9238] },
  { name: "Костанай", coords: [53.2144, 63.6246] },
  { name: "Кызылорда", coords: [44.8488, 65.4823] },
  { name: "Уральск", coords: [51.2333, 51.3667] },
  { name: "Петропавловск", coords: [54.8667, 69.15] },
  { name: "Актау", coords: [43.65, 51.1667] },
  { name: "Тараз", coords: [42.9, 71.3667] },
  { name: "Туркестан", coords: [43.3, 68.2333] },
  { name: "Кокшетау", coords: [53.2833, 69.3833] },
  { name: "Талдыкорган", coords: [45.0167, 78.3667] },
  { name: "Конаев", coords: [43.8667, 77.0667] },
  { name: "Жезказган", coords: [47.7833, 67.7167] },
];

const PER_PAGE = 6;

const KZ_BOUNDS = [
  [40.5, 45.5],
  [55.6, 87.5],
];
const MAP_MIN_ZOOM = 6;
const MAP_MAX_ZOOM = 13;

const DIRECTION_COLOR = "#f59e0b"; // amber-500
const DIRECTION_COLOR_DARK = "#b45309"; // amber-700
const TOUR_COLOR = "#16a34a"; // green-600
const TOUR_COLOR_DARK = "#15803d"; // green-700

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1280&h=720&fit=crop&q=80";

function applyKzMapConstraints(L, map) {
  map.invalidateSize();
  const bounds = L.latLngBounds(KZ_BOUNDS[0], KZ_BOUNDS[1]);
  map.setMaxBounds(bounds);
  map.setMinZoom(MAP_MIN_ZOOM);
  map.setMaxZoom(MAP_MAX_ZOOM);
  map.options.maxBoundsViscosity = 1.0;
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function tagIcon(tag = "") {
  const t = tag.toLowerCase();
  if (t.includes("гор") || t.includes("лыж") || t.includes("альп")) return Mountain;
  if (t.includes("озер") || t.includes("море") || t.includes("каспий") || t.includes("дайв")) return Waves;
  if (t.includes("лес") || t.includes("парк") || t.includes("природ")) return TreePine;
  if (t.includes("степ") || t.includes("каньон") || t.includes("хайк")) return Compass;
  if (t.includes("пляж")) return Wind;
  return CircleDot;
}

// ─── Normalize directions & tours into a uniform shape used by cards/popups ───
function toItem(kind, raw) {
  if (kind === "direction") {
    return {
      kind: "direction",
      id: raw.id,
      key: `direction-${raw.id}`,
      name: raw.name,
      region: raw.region || "",
      coords: raw.lat != null && raw.lng != null ? [Number(raw.lat), Number(raw.lng)] : null,
      image: raw.image_url || PLACEHOLDER_IMG,
      description: raw.description_short || "",
      price: raw.price_adults != null ? Number(raw.price_adults) : null,
      popular: false,
      hot: false,
      tags: [],
      hrefBase: "/directions",
    };
  }
  const firstImg =
    Array.isArray(raw.gallery) && raw.gallery.length > 0
      ? typeof raw.gallery[0] === "string"
        ? raw.gallery[0]
        : raw.gallery[0]?.url ?? raw.gallery[0]?.src ?? null
      : null;
  return {
    kind: "tour",
    id: raw.id,
    key: `tour-${raw.id}`,
    name: raw.title,
    region: raw.region || raw.direction_name || raw.city || "",
    coords: raw.lat != null && raw.lng != null ? [Number(raw.lat), Number(raw.lng)] : null,
    image: firstImg || PLACEHOLDER_IMG,
    description: raw.description || raw.subtitle || "",
    price:
      raw.price_adult != null
        ? Number(raw.price_adult)
        : raw.price != null
          ? Number(raw.price)
          : null,
    popular: !!raw.is_popular,
    hot: !!raw.hot,
    burning: isTourBurning(raw.season_from, raw.season_to),
    tags: [raw.hotel_class ? `${raw.hotel_class}★` : null].filter(Boolean),
    hrefBase: "/tours",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
function ItemCarousel({ images, accent }) {
  const [idx, setIdx] = useState(0);
  const startDragX = useRef(null);
  const dragging = useRef(false);

  const goPrev = (e) => {
    e?.stopPropagation?.();
    setIdx((p) => (p - 1 + images.length) % images.length);
  };
  const goNext = (e) => {
    e?.stopPropagation?.();
    setIdx((p) => (p + 1) % images.length);
  };

  const handleDragStart = (e) => {
    dragging.current = true;
    startDragX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  };
  const handleDragEnd = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    let endX;
    if (e.type === "touchend") {
      if (!e.changedTouches?.length) return;
      endX = e.changedTouches[0].clientX;
    } else endX = e.clientX;
    const d = endX - startDragX.current;
    if (Math.abs(d) > 35) (d > 0 ? goPrev : goNext)();
  };

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shrink-0 group select-none"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      style={{ touchAction: "pan-y" }}
    >
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt=""
          fill
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? "scale(1)" : "scale(1.06)",
          }}
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/fallback${i * 7}/420/290`;
          }}
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 270px, 320px"
          priority={i === 0}
          draggable={false}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-1 transition-all"
            style={{ outline: "none", border: 0 }}
            aria-label="Назад"
            onClick={goPrev}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 15l-5-5 5-5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-1 transition-all"
            style={{ outline: "none", border: 0 }}
            aria-label="Вперёд"
            onClick={goNext}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 5l5 5-5 5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 14 : 5,
              background: i === idx ? accent : "rgba(255,255,255,0.5)",
            }}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────
function ItemCard({ item, isSelected, onClick, animIdx }) {
  const isTour = item.kind === "tour";
  const accent = isTour ? TOUR_COLOR : DIRECTION_COLOR;
  const accentSoft = isTour ? "rgba(34,197,94,0.18)" : "rgba(251,191,36,0.18)";
  const ringColor = isTour ? "rgba(34,197,94,0.35)" : "rgba(251,191,36,0.35)";

  return (
    <div
      onClick={() => onClick(item)}
      className={cn(
        "w-full h-full flex gap-3 p-3 rounded-2xl border bg-[#0a2a0a]/80 text-left transition-all duration-300",
        "bg-primary backdrop-blur-sm hover:bg-primary/95",
        "hover:-translate-y-0.5 hover:shadow-lg cursor-pointer",
        isSelected ? "shadow-lg" : "shadow-sm hover:border-primary-foreground/25",
      )}
      style={{
        animationDelay: `${animIdx * 70}ms`,
        borderColor: isSelected ? accent : "rgba(255,255,255,0.10)",
        boxShadow: isSelected
          ? `0 0 0 2px ${ringColor}, 0 8px 24px rgba(0,0,0,0.2)`
          : undefined,
      }}
    >
      <div className="relative w-[42%] min-w-[150px] max-w-[270px] xl:max-w-[320px] aspect-video self-center rounded-xl overflow-hidden shrink-0 grow-0">
        <ItemCarousel images={[item.image]} accent={accent} />
        <div className="absolute top-2 right-2 z-40">
          <FavoriteButton kind={item.kind} id={item.id} variant="icon" className="w-8 h-8" />
        </div>
        <div className="absolute top-2 left-2 z-40 flex flex-col gap-1 pointer-events-none">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm text-white"
            style={{ background: accentSoft, border: `1px solid ${accent}` }}
          >
            {isTour ? "Тур" : "Направление"}
          </span>
          {item.burning && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold backdrop-blur-sm shadow-[0_0_10px_rgba(225,29,72,0.55)]">
              🔥 Горящий
            </span>
          )}
          {item.popular && (
            <span className="px-2 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-bold backdrop-blur-sm">
              ⭐ Популярное
            </span>
          )}
          {item.hot && (
            <span className="px-2 py-0.5 rounded-full bg-orange-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
              HOT
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1 overflow-hidden">
        <div className="min-h-0">
          <div className="flex items-center gap-1 mb-0.5">
            <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: accent }} />
            <span className="text-[10px] text-primary-foreground/55 tracking-wide truncate">
              {item.region || "—"}
            </span>
          </div>

          <h3
            className="font-semibold text-primary-foreground leading-tight mb-1 truncate"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 18 }}
          >
            {item.name}
          </h3>

          <p className="text-xs text-primary-foreground/75 leading-snug line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="shrink-0">
          {item.price != null && (
            <div className="mb-1 flex items-baseline gap-1.5">
              <span className="text-[10px] text-primary-foreground/55">цена от</span>
              <span className="text-sm font-bold" style={{ color: accent }}>
                {Number(item.price).toLocaleString()} ₸
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-1">
            <Link
              href={`${item.hrefBase}/${item.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors"
              style={{ background: accentSoft, color: accent, border: `1px solid ${accent}` }}
            >
              Подробнее →
            </Link>
            {item.tags.map((tag) => {
              const Icon = tagIcon(tag);
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-foreground/12 border border-primary-foreground/25 text-primary-foreground text-[10px] font-medium"
                >
                  <Icon className="w-2.5 h-2.5" />
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="flex gap-3.5 p-4 rounded-2xl border border-primary-foreground/15 bg-primary h-full">
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-2.5 w-1/3 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-5 w-3/5 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-3 w-full rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-primary-foreground/20 animate-pulse" />
      </div>
      <div className="w-32 h-full rounded-xl bg-primary-foreground/15 animate-pulse shrink-0" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ total, page, setPage, accent }) {
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-1.5 py-2">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all",
            p === page ? "text-white shadow-md border-0" : "border border-stone-300 text-white hover:opacity-80",
          )}
          style={p === page ? { background: accent } : undefined}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => setPage((p) => p + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB SWITCHER
// ─────────────────────────────────────────────────────────────────────────────
function TabSwitcher({ tab, setTab, directionsCount, toursCount }) {
  const tabs = [
    {
      k: "directions",
      label: "Курортные направления",
      count: directionsCount,
      accent: DIRECTION_COLOR,
      accentSoft: "rgba(251,191,36,0.18)",
      Icon: Compass,
    },
    {
      k: "tours",
      label: "Готовые туры",
      count: toursCount,
      accent: TOUR_COLOR,
      accentSoft: "rgba(34,197,94,0.18)",
      Icon: Tag,
    },
  ];

  return (
    <div className="px-4 pt-3 pb-2 shrink-0 flex gap-2">
      {tabs.map(({ k, label, count, accent, accentSoft, Icon }) => {
        const active = tab === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all bg-transparent",
              active ? "border-2" : "border border-white/12 text-white/70 hover:text-white",
            )}
            style={{
              borderColor: active ? accent : "rgba(255,255,255,0.12)",
              color: active ? accent : undefined,
              boxShadow: active ? `0 0 0 1px ${accent}, 0 6px 18px ${accentSoft}` : undefined,
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
            <span className="truncate">{label}</span>
            <span
              className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold"
              style={{
                background: accentSoft,
                color: accent,
                border: `1px solid ${accent}`,
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ListPanel({ items, tab, setTab, directionsCount, toursCount, selected, onSelect, loading, twoCols }) {
  const [page, setPage] = useState(1);
  const [listKey, setListKey] = useState(0);

  // Reset page when tab меняется или меняется общий список туров.
  // Используем «state-during-render» вместо useEffect — рекомендуемый React-паттерн.
  const [prevTab, setPrevTab] = useState(tab);
  const [prevToursCount, setPrevToursCount] = useState(toursCount);
  if (prevTab !== tab || prevToursCount !== toursCount) {
    setPrevTab(tab);
    setPrevToursCount(toursCount);
    setPage(1);
    setListKey((k) => k + 1);
  }

  // Когда меняется выбор и он принадлежит активной вкладке — листаем на нужную страницу.
  const [prevSelectedKey, setPrevSelectedKey] = useState(selected?.key ?? null);
  if (prevSelectedKey !== (selected?.key ?? null)) {
    setPrevSelectedKey(selected?.key ?? null);
    if (selected) {
      const matchesTab =
        (tab === "tours" && selected.kind === "tour") ||
        (tab === "directions" && selected.kind === "direction");
      if (matchesTab) {
        const idx = items.findIndex((it) => it.key === selected.key);
        if (idx !== -1) {
          const targetPage = Math.floor(idx / PER_PAGE) + 1;
          if (targetPage !== page) setPage(targetPage);
        }
      }
    }
  }

  const accent = tab === "tours" ? TOUR_COLOR : DIRECTION_COLOR;
  const paged = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePage = (p) => {
    setPage(p);
    setListKey((k) => k + 1);
  };

  const gridClass = twoCols
    ? "grid grid-cols-2 grid-rows-3 gap-3 h-full"
    : "grid grid-cols-1 gap-3 [grid-auto-rows:calc((100%-1.5rem)/3)]";

  const containerClass = twoCols
    ? "flex-1 min-h-0 px-4 pt-3 pr-3"
    : "flex-1 min-h-0 px-4 pt-3 pr-3 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <TabSwitcher tab={tab} setTab={setTab} directionsCount={directionsCount} toursCount={toursCount} />

      <div key={`l${listKey}`} className={containerClass}>
        {items.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full text-white/50 text-sm px-6 text-center">
            {tab === "tours"
              ? "По вашим фильтрам ничего не найдено. Попробуйте смягчить критерии."
              : "Опубликованных направлений пока нет."}
          </div>
        ) : (
          <div className={gridClass} style={twoCols ? undefined : { height: "100%" }}>
            {loading
              ? Array.from({ length: PER_PAGE }).map((_, i) => <CardSkeleton key={i} />)
              : paged.map((item, i) => (
                  <ItemCard
                    key={item.key}
                    item={item}
                    isSelected={selected?.key === item.key}
                    onClick={onSelect}
                    animIdx={i}
                  />
                ))}
          </div>
        )}
      </div>

      {!loading && items.length > 0 && (
        <div className="shrink-0 px-4 pb-3 border-t backdrop-blur-sm">
          <Pagination total={items.length} page={page} setPage={handlePage} accent={accent} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP PANEL
// ─────────────────────────────────────────────────────────────────────────────
function MapPanel({ directions, tours, selected, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // key -> { marker, item }
  const prevSelRef = useRef(null);
  const leafletRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const pendingOpenRef = useRef(null);

  // Marker HTML: yellow for directions (existing style), green w/ location pin for tours.
  const buildMarkerHtml = useCallback((kind, isSel) => {
    if (kind === "direction") {
      return `
      <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;
        background:${isSel ? "rgba(251,191,36,0.28)" : "rgba(255,255,255,0.92)"};
        border:2px solid ${isSel ? "#f59e0b" : "rgba(251,191,36,0.65)"};
        backdrop-filter:blur(10px);
        box-shadow:${isSel
          ? "0 0 0 6px rgba(251,191,36,0.18), 0 0 18px rgba(251,191,36,0.65), 0 4px 12px rgba(0,0,0,0.2)"
          : "0 0 0 4px rgba(251,191,36,0.12), 0 0 10px rgba(251,191,36,0.35), 0 2px 8px rgba(0,0,0,0.15)"};
        transform:${isSel ? "scale(1.25)" : "scale(1)"}; transition:all 0.35s; ${isSel ? "animation: dirMarkerPulse 1.8s infinite;" : ""}">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${isSel ? "#f59e0b" : "#b45309"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 17l4-8 4 5 3-3 4 6H3z"/>
          <path d="M7 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="${isSel ? "#f59e0b" : "#b45309"}" stroke="none"/>
        </svg>
      </div>
    `;
    }
    // tour: green with geolocation pin icon
    return `
      <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;
        background:${isSel ? "rgba(34,197,94,0.32)" : "rgba(255,255,255,0.92)"};
        border:2px solid ${isSel ? "#16a34a" : "rgba(34,197,94,0.7)"};
        backdrop-filter:blur(10px);
        box-shadow:${isSel
          ? "0 0 0 6px rgba(34,197,94,0.18), 0 0 18px rgba(34,197,94,0.65), 0 4px 12px rgba(0,0,0,0.2)"
          : "0 0 0 4px rgba(34,197,94,0.12), 0 0 10px rgba(34,197,94,0.4), 0 2px 8px rgba(0,0,0,0.15)"};
        transform:${isSel ? "scale(1.28)" : "scale(1)"}; transition:all 0.35s; ${isSel ? "animation: tourMarkerPulse 1.8s infinite;" : ""}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isSel ? "rgba(34,197,94,0.18)" : "none"}" stroke="${isSel ? "#16a34a" : "#15803d"}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `;
  }, []);

  const buildIcon = useCallback(
    (L, kind, isSel) =>
      L.divIcon({
        className: "",
        html: buildMarkerHtml(kind, isSel),
        iconSize: kind === "tour" ? [32, 32] : [30, 30],
        iconAnchor: kind === "tour" ? [16, 16] : [15, 15],
        popupAnchor: [0, -20],
      }),
    [buildMarkerHtml],
  );

  const popupHtml = useCallback((item) => {
    const isTour = item.kind === "tour";
    const accent = isTour ? TOUR_COLOR : DIRECTION_COLOR;
    const accentDark = isTour ? TOUR_COLOR_DARK : DIRECTION_COLOR_DARK;
    const accentSoftBg = isTour ? "rgba(34,197,94,0.10)" : "rgba(251,191,36,0.10)";
    const accentBorder = isTour ? "rgba(34,197,94,0.45)" : "rgba(251,191,36,0.45)";
    const badge = isTour ? "Готовый тур" : "Курортное направление";
    const href = `${item.hrefBase}/${item.id}`;

    return `
    <div style="background:#fff; border-radius:14px; overflow:hidden; color:#1c1917; min-width:240px; max-width:260px; font-family:sans-serif; border:2px solid ${accentBorder}; box-shadow:0 12px 30px ${accentSoftBg};">
      <div style="position:relative;height:120px;">
        <img src="${item.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${PLACEHOLDER_IMG}'">
        <div style="position:absolute;top:8px;left:8px;display:flex;flex-direction:column;gap:4px;">
          <span style="background:${accent};color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;line-height:1;">
            ${badge}
          </span>
          ${item.burning ? `<span style="background:#e11d48;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;line-height:1;box-shadow:0 0 10px rgba(225,29,72,0.55);">🔥 Горящий</span>` : ""}
          ${item.popular ? `<span style="background:rgba(0,0,0,0.65);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;line-height:1;">⭐ Популярное</span>` : ""}
          ${item.hot ? `<span style="background:#f97316;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;line-height:1;">HOT</span>` : ""}
        </div>
      </div>
      <div style="padding:10px 12px 13px; background:${accentSoftBg};">
        <div style="font-size:9px;color:${accentDark};text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">${item.region || ""}</div>
        <h3 style="font-size:16px;margin:5px 0;color:#1c1917;">${item.name}</h3>
        ${item.price != null ? `<div style="margin-top:6px;display:flex;align-items:baseline;gap:4px;"><span style="font-size:9px;color:#a8a29e;">цена от</span><span style="font-size:14px;font-weight:700;color:${accentDark};">${Number(item.price).toLocaleString()} ₸</span></div>` : ""}
        <a href="${href}" style="margin-top:9px;display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:8px;background:${accent};color:#fff;font-size:11px;font-weight:700;text-decoration:none;">
          Подробнее →
        </a>
      </div>
    </div>
  `;
  }, []);

  // Init Leaflet once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const ensureLeaflet = () => {
      if (window.L) return Promise.resolve(window.L);
      return new Promise((resolve) => {
        if (!document.querySelector('link[data-leaflet]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
          link.dataset.leaflet = "1";
          document.head.appendChild(link);
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.onload = () => resolve(window.L);
        document.body.appendChild(script);
      });
    };

    let map;
    ensureLeaflet().then((L) => {
      leafletRef.current = L;
      map = L.map(container, {
        center: [48, 67],
        zoom: MAP_MIN_ZOOM,
        maxBounds: KZ_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });
      const zoomCtrl = L.control.zoom({ position: "topright" });
      zoomCtrl.addTo(map);
      const zcEl = zoomCtrl.getContainer();
      if (zcEl && container) {
        container.appendChild(zcEl);
        zcEl.style.position = "absolute";
        zcEl.style.right = "12px";
        zcEl.style.top = "50%";
        zcEl.style.transform = "translateY(-50%)";
        zcEl.style.margin = "0";
        zcEl.style.zIndex = "800";
      }

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd" },
      ).addTo(map);

      KZ_CITIES.forEach((city) => {
        L.marker(city.coords, {
          icon: L.divIcon({
            className: "city-label",
            html: `<span style="font-size:10px; color:#a8a29e; font-weight:bold; text-transform:uppercase; letter-spacing:1px; white-space:nowrap; pointer-events:none; opacity:0.8;">${city.name}</span>`,
            iconSize: [100, 20],
            iconAnchor: [50, 10],
          }),
          interactive: false,
          zIndexOffset: -100,
        }).addTo(map);
      });

      KZ_REGIONS.forEach((reg) => {
        L.marker(reg.coords, {
          icon: L.divIcon({
            className: "region-label",
            html: `<span style="font-size:9px; color:#d1d1d1; font-weight:500; text-transform:uppercase; letter-spacing:1px; white-space:nowrap; pointer-events:none;">${reg.name}</span>`,
            iconSize: [120, 20],
            iconAnchor: [60, 10],
          }),
          interactive: false,
          zIndexOffset: -500,
        }).addTo(map);
      });

      mapRef.current = map;
      resizeObserverRef.current = new ResizeObserver(() => applyKzMapConstraints(L, map));
      resizeObserverRef.current.observe(container);
    });

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
      if (container) delete container._leaflet_id;
    };
  }, []);

  // Sync markers whenever items list changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const items = [
      ...directions.map((d) => toItem("direction", d)),
      ...tours.map((t) => toItem("tour", t)),
    ].filter((it) => Array.isArray(it.coords));

    const nextKeys = new Set(items.map((i) => i.key));

    // Remove markers no longer present
    Object.keys(markersRef.current).forEach((k) => {
      if (!nextKeys.has(k)) {
        markersRef.current[k].marker.remove();
        delete markersRef.current[k];
      }
    });

    // Add or update markers
    items.forEach((item) => {
      const existing = markersRef.current[item.key];
      const isSel = item.key === selected?.key;
      if (existing) {
        existing.item = item;
        existing.marker.setIcon(buildIcon(L, item.kind, isSel));
        existing.marker.setPopupContent(popupHtml(item));
      } else {
        const marker = L.marker(item.coords, { icon: buildIcon(L, item.kind, isSel) })
          .bindPopup(L.popup({ closeButton: false }).setContent(popupHtml(item)))
          .addTo(map)
          .on("click", () => onSelect(item));
        markersRef.current[item.key] = { marker, item };
      }
    });
  }, [directions, tours, selected, buildIcon, popupHtml, onSelect]);

  // Selection: fly to + open popup
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const prevKey = prevSelRef.current;
    if (prevKey && prevKey !== selected?.key && markersRef.current[prevKey]) {
      const prev = markersRef.current[prevKey];
      prev.marker.setIcon(buildIcon(L, prev.item.kind, false));
    }
    if (selected?.key && markersRef.current[selected.key]) {
      const entry = markersRef.current[selected.key];
      entry.marker.setIcon(buildIcon(L, entry.item.kind, true));
      if (Array.isArray(selected.coords)) {
        map.flyTo(selected.coords, 8, { duration: 1.2 });
      }
      clearTimeout(pendingOpenRef.current);
      pendingOpenRef.current = setTimeout(
        () => markersRef.current[selected.key]?.marker.openPopup(),
        700,
      );
    }
    prevSelRef.current = selected?.key ?? null;
    return () => clearTimeout(pendingOpenRef.current);
  }, [selected, buildIcon]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      <style>{`
        .leaflet-popup-content-wrapper{background:transparent!important;box-shadow:none!important;padding:0!important;}
        .leaflet-popup-content{margin:0!important;}
        .leaflet-popup-tip-container{display:none!important;}
        .leaflet-container{background:#f8f7f5!important;}
        .city-label{background:transparent!important; border:none!important; text-align:center;}
        @keyframes dirMarkerPulse{ 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.55);} 50%{box-shadow:0 0 32px rgba(251,191,36,0.8);} }
        @keyframes tourMarkerPulse{ 0%,100%{box-shadow:0 0 20px rgba(34,197,94,0.55);} 50%{box-shadow:0 0 32px rgba(34,197,94,0.8);} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({ mode, setMode, isMobile }) {
  const modes = [
    { k: "list", label: "Список", Icon: List },
    { k: "both", label: "Оба", Icon: LayoutTemplate },
    { k: "map", label: "Карта", Icon: Map },
  ];

  return (
    <div className="flex items-center justify-center px-4 py-2.5 backdrop-blur-md border-b border-[#1a6b1a]/20 shadow-sm shrink-0 z-10">
      {!isMobile ? (
        <div className="flex gap-0.5rounded-xl p-1 border rounded-2xl">
          {modes.map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer",
                mode === k
                  ? " shadow-sm border border-stone-200 bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent)"
                  : "text-stone-500 hover:text-stone-700",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex rounded-xl p-1 border border-stone-200 bg-white/80 backdrop-blur-sm">
          {[
            { k: "list", label: "Список", Icon: List },
            { k: "map", label: "Карта", Icon: Map },
          ].map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                mode === k
                  ? "bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) shadow-sm"
                  : "text-stone-500 hover:text-stone-700",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function KazakhstanMap({
  directions = [],
  tours = [],
  loadingTours = false,
}) {
  const [mode, setMode] = useState("list");
  const [tab, setTab] = useState("tours"); // 'directions' | 'tours'
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fn = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setMode((m) => (m === "both" ? "list" : m));
    };
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const directionItems = useMemo(
    () => directions.map((d) => toItem("direction", d)),
    [directions],
  );
  const tourItems = useMemo(
    () => tours.map((t) => toItem("tour", t)),
    [tours],
  );

  const listItems = tab === "tours" ? tourItems : directionItems;

  const handleSelect = useCallback((item) => {
    if (!item) return;
    setSelected(item);
    // Переключаем вкладку в зависимости от типа выбранного объекта
    setTab(item.kind === "tour" ? "tours" : "directions");
  }, []);

  const showList = isMobile ? mode === "list" : mode === "list" || mode === "both";
  const twoCols = isMobile ? false : mode === "list";

  const listW = isMobile
    ? mode === "list" ? "100%" : "0%"
    : mode === "both" ? "50%" : mode === "list" ? "100%" : "0%";

  const mapW = isMobile
    ? mode === "map" ? "100%" : "0%"
    : mode === "map" ? "100%" : mode === "both" ? "50%" : "0%";

  return (
    <div
      className="flex flex-col overflow-hidden border border-[#1a6b1a]/20 rounded-2xl"
      style={{ width: "100vw", height: "100vh" }}
    >
      <TopBar mode={mode} setMode={setMode} isMobile={isMobile} />

      <div className="flex-1 flex overflow-hidden relative">
        <div
          className="h-full overflow-hidden shrink-0 transition-[width,opacity] duration-500"
          style={{ width: listW, opacity: showList ? 1 : 0 }}
        >
          {showList && (
            <ListPanel
              items={listItems}
              tab={tab}
              setTab={setTab}
              directionsCount={directionItems.length}
              toursCount={tourItems.length}
              selected={selected}
              onSelect={handleSelect}
              loading={tab === "tours" && loadingTours}
              twoCols={twoCols}
            />
          )}
        </div>

        {!isMobile && mode === "both" && (
          <div className="w-px shrink-0 bg-linear-to-b from-transparent via-stone-300 to-transparent" />
        )}

        <div
          className="h-full overflow-hidden shrink-0 transition-[width,opacity] duration-500"
          style={{
            width: mapW,
            opacity: mapW === "0%" ? 0 : 1,
            pointerEvents: mapW === "0%" ? "none" : undefined,
          }}
        >
          <MapPanel
            directions={directions}
            tours={tours}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
