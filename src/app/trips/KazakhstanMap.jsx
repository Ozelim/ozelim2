"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Star,
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
} from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
export const RESORTS = [
  {
    id: 1,
    name: "Боровое",
    region: "Акмолинская обл.",
    coords: [53.09, 70.28],
    description:
      "Жемчужина Казахстана — кристальные озёра среди вековых сосен. Идеальное место для летнего отдыха и зимних лыжных прогулок.",
    rating: 4.9,
    tags: ["Озёра", "Лес", "Лыжи"],
    images: [
      "https://picsum.photos/seed/borovoe11/420/290",
      "https://picsum.photos/seed/borovoe22/420/290",
      "https://picsum.photos/seed/forest77/420/290",
    ],
  },
  {
    id: 2,
    name: "Медеу",
    region: "Алматы",
    coords: [43.18, 77.08],
    description:
      "Легендарный высокогорный каток на высоте 1691 м — дом множества мировых рекордов. Окружён снежными вершинами Заилийского Алатау.",
    rating: 4.7,
    tags: ["Горы", "Каток", "Спорт"],
    images: [
      "https://picsum.photos/seed/medeu11/420/290",
      "https://picsum.photos/seed/medeu22/420/290",
      "https://picsum.photos/seed/alp11/420/290",
    ],
  },
  {
    id: 3,
    name: "Шымбулак",
    region: "Алматы",
    coords: [43.22, 77.07],
    description:
      "Лучший горнолыжный курорт Центральной Азии на склонах Алатау. Трассы для любого уровня, современный подъёмник и уютные шале.",
    rating: 4.8,
    tags: ["Горные лыжи", "Альпинизм", "SPA"],
    images: [
      "https://picsum.photos/seed/shymb11/420/290",
      "https://picsum.photos/seed/shymb22/420/290",
      "https://picsum.photos/seed/winter11/420/290",
    ],
  },
  {
    id: 4,
    name: "Кольсайские озёра",
    region: "Алматинская обл.",
    coords: [43.01, 78.51],
    description:
      "Три горных озера — Нижнее, Среднее и Верхнее — образуют жемчужное ожерелье в ущелье. Природное наследие ЮНЕСКО.",
    rating: 4.9,
    tags: ["Треккинг", "Озёра", "Природа"],
    images: [
      "https://picsum.photos/seed/kolsai11/420/290",
      "https://picsum.photos/seed/kolsai22/420/290",
      "https://picsum.photos/seed/mtn11/420/290",
    ],
  },
  {
    id: 5,
    name: "Чарынский каньон",
    region: "Алматинская обл.",
    coords: [43.35, 79.07],
    description:
      "Величественный каньон — «младший брат» Гранд-Каньона протяжённостью 154 км. Красно-оранжевый песчаник и неземные пейзажи.",
    rating: 4.8,
    tags: ["Каньон", "Хайкинг", "Фото"],
    images: [
      "https://picsum.photos/seed/charyn11/420/290",
      "https://picsum.photos/seed/charyn22/420/290",
      "https://picsum.photos/seed/canyon11/420/290",
    ],
  },
  {
    id: 6,
    name: "Актау",
    region: "Мангистауская обл.",
    coords: [43.65, 51.17],
    description:
      "Город на берегу Каспийского моря с прекрасными пляжами. Тёплое море, меловые горы и уникальные подводные котловины.",
    rating: 4.5,
    tags: ["Пляж", "Каспий", "Дайвинг"],
    images: [
      "https://picsum.photos/seed/aktau11/420/290",
      "https://picsum.photos/seed/aktau22/420/290",
      "https://picsum.photos/seed/sea11/420/290",
    ],
  },
  {
    id: 7,
    name: "Баянаул",
    region: "Павлодарская обл.",
    coords: [50.79, 75.7],
    description:
      "Первый национальный парк Казахстана — живописные горы и озёра среди бескрайней степи Сарыарки. Уникальная флора и фауна.",
    rating: 4.6,
    tags: ["Нацпарк", "Степь", "Пешие походы"],
    images: [
      "https://picsum.photos/seed/bayan11/420/290",
      "https://picsum.photos/seed/bayan22/420/290",
      "https://picsum.photos/seed/steppe11/420/290",
    ],
  },
  {
    id: 8,
    name: "Большое Алматинское озеро",
    region: "Алматы",
    coords: [43.06, 76.99],
    description:
      "Высокогорное реликтовое озеро на 2510 м в окружении заснеженных трёхтысячников. Вода меняет цвет с бирюзового до изумрудного.",
    rating: 4.9,
    tags: ["Озеро", "Горы", "Фотография"],
    images: [
      "https://picsum.photos/seed/bal11/420/290",
      "https://picsum.photos/seed/bal22/420/290",
      "https://picsum.photos/seed/turq11/420/290",
    ],
  },
  {
    id: 9,
    name: "Каинды",
    region: "Алматинская обл.",
    coords: [43.07, 78.52],
    description:
      "Мистическое затопленное озеро с торчащими из воды стволами елей — живые свидетели землетрясения 1911 года. Идеально для дайвинга.",
    rating: 4.7,
    tags: ["Дайвинг", "Мистика", "Фото"],
    images: [
      "https://picsum.photos/seed/kaindy11/420/290",
      "https://picsum.photos/seed/kaindy22/420/290",
      "https://picsum.photos/seed/lake11/420/290",
    ],
  },
];

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

const PER_PAGE = 8;

// Kazakhstan strict bounds — prevents zooming out beyond the country
// SW corner: ~[40.5, 49.5]  NE corner: ~[55.6, 87.5]
const KZ_BOUNDS = [
  [40.5, 45.5],
  [55.6, 87.5],
];
const MAP_MIN_ZOOM = 6;
const MAP_MAX_ZOOM = 13;

/** After container width/height changes (layout tabs, split view), Leaflet must be synced and bounds re-applied. */
function applyKzMapConstraints(L, map) {
  map.invalidateSize();
  const bounds = L.latLngBounds(KZ_BOUNDS[0], KZ_BOUNDS[1]);
  map.setMaxBounds(bounds);
  map.setMinZoom(MAP_MIN_ZOOM);
  map.setMaxZoom(MAP_MAX_ZOOM);
  map.options.maxBoundsViscosity = 1.0;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function tagIcon(tag) {
  const t = tag.toLowerCase();
  if (t.includes("гор") || t.includes("лыж") || t.includes("альп"))
    return Mountain;
  if (
    t.includes("озер") ||
    t.includes("море") ||
    t.includes("каспий") ||
    t.includes("дайв")
  )
    return Waves;
  if (t.includes("лес") || t.includes("парк") || t.includes("природ"))
    return TreePine;
  if (t.includes("степ") || t.includes("каньон") || t.includes("хайк"))
    return Compass;
  if (t.includes("пляж")) return Wind;
  return CircleDot;
}

// ─────────────────────────────────────────────────────────────────────────────
// STARS
// ─────────────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3 h-3"
          fill={
            i <= Math.floor(rating) ||
            (i === Math.ceil(rating) && rating % 1 >= 0.5)
              ? "#f59e0b"
              : "none"
          }
          stroke="#f59e0b"
          strokeWidth={2}
        />
      ))}
      <span className="text-xs font-bold text-amber-500 ml-1">{rating}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL  (image on RIGHT side of card)
// ─────────────────────────────────────────────────────────────────────────────
function ResortCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const startDragX = useRef(null);
  const dragging = useRef(false);

  // Handle previous/next
  const goPrev = (e) => {
    e?.stopPropagation?.();
    setIdx((prev) => (prev - 1 + images.length) % images.length);
  };
  const goNext = (e) => {
    e?.stopPropagation?.();
    setIdx((prev) => (prev + 1) % images.length);
  };

  // Mouse drag/swipe logic
  const handleDragStart = (e) => {
    dragging.current = true;
    if (e.type === "touchstart") {
      startDragX.current = e.touches[0].clientX;
    } else {
      startDragX.current = e.clientX;
    }
  };

  const handleDragEnd = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    let endX;
    if (e.type === "touchend") {
      if (!e.changedTouches || !e.changedTouches.length) return;
      endX = e.changedTouches[0].clientX;
    } else {
      endX = e.clientX;
    }
    const delta = endX - startDragX.current;
    if (Math.abs(delta) > 35) {
      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
  };

  const handleDragMove = (e) => {
    // Optional: handle visual dragging state
  };

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shrink-0 group select-none"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={() => {
        dragging.current = false;
      }}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      onTouchMove={handleDragMove}
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
          sizes="128px"
          priority={i === 0}
          draggable={false}
        />
      ))}
      {/* gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
      {/* manual controls */}
      {images.length > 1 && (
        <>
          {/* Arrow left */}
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-1 transition-all"
            style={{ outline: "none", border: 0 }}
            aria-label="Назад"
            tabIndex={0}
            onClick={goPrev}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 20 20">
              <path
                d="M13 15l-5-5 5-5"
                stroke="var(--site-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Arrow right */}
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-1 transition-all"
            style={{ outline: "none", border: 0 }}
            aria-label="Вперед"
            tabIndex={0}
            onClick={goNext}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 20 20">
              <path
                d="M7 5l5 5-5 5"
                stroke="var(--site-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
      {/* dots */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 14 : 5,
              background: i === idx ? "var(--site-accent)" : "rgba(255,255,255,0.5)",
            }}
            aria-label={`Слайд ${i + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="flex gap-3.5 p-4 rounded-2xl border border-primary-foreground/15 bg-primary mb-3">
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-2.5 w-1/3 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-5 w-3/5 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-3 w-full rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-primary-foreground/20 animate-pulse" />
        <div className="flex gap-1.5 mt-1">
          {[55, 45, 60].map((w, k) => (
            <div
              key={k}
              className="h-5 rounded-full bg-primary-foreground/20 animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
      {/* image placeholder on RIGHT */}
      <div className="w-32 h-[104px] rounded-xl bg-primary-foreground/15 animate-pulse shrink-0" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESORT CARD  (image on RIGHT)
// ─────────────────────────────────────────────────────────────────────────────
function ResortCard({ resort, isSelected, onClick, animIdx }) {
  return (
    <div
      onClick={() => onClick(resort)}
      className={cn(
        "w-full flex gap-3.5 p-4 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/80 text-left transition-all duration-300 mb-3",
        "bg-primary backdrop-blur-sm hover:bg-primary/95",
        "hover:-translate-y-1 hover:shadow-lg",
        isSelected
          ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.35),0_8px_24px_rgba(0,0,0,0.2)]"
          : "border-primary-foreground/15 shadow-sm hover:border-primary-foreground/25",
      )}
      style={{ animationDelay: `${animIdx * 70}ms` }}
    >
      {/* ── Left: image carousel ── */}
      <div className="w-[42%] min-w-[170px] max-w-[270px] xl:max-w-[320px] h-[130px] sm:h-[150px] md:h-[160px] lg:h-[175px] xl:h-[190px] rounded-xl overflow-hidden shrink-0 grow-0">
        <ResortCarousel images={resort.images} />
      </div>

      {/* ── Right: text content ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-2.5 h-2.5 text-primary-foreground/50 shrink-0" />
            <span className="text-[10px] text-primary-foreground/55 tracking-wide">
              {resort.region}
            </span>
          </div>

          <h3
            className="font-semibold text-primary-foreground leading-tight mb-1.5"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 20,
            }}
          >
            {resort.name}
          </h3>

          <p className="text-xs text-primary-foreground/75 leading-relaxed mb-2 line-clamp-2">
            {resort.description}
          </p>
        </div>

        <div>
          <div className="mb-2">
            <Stars rating={resort.rating} />
          </div>

          <div className="flex flex-wrap gap-1">
            {resort.tags.map((tag) => {
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
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ total, page, setPage }) {
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 py-2">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all",
            p === page
              ? "bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) shadow-md border-0"
              : "border border-stone-300 text-white hover:border-amber-400 hover:text-amber-600",
          )}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === pages}
        onClick={() => setPage((p) => p + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ListPanel({ selId, onSelect, twoCols = false }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const handlePage = (p) => {
    setPage(p);
    setListKey((k) => k + 1);
  };
  const paged = RESORTS.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Cards */}
      <div
        key={`l${listKey}`}
        className="flex-1 overflow-y-auto px-4 pt-3 pr-3 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent"
      >
        {twoCols ? (
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? paged.map((_, i) => <CardSkeleton key={i} />)
              : paged.map((r, i) => (
                  <ResortCard
                    key={r.id}
                    resort={r}
                    isSelected={selId === r.id}
                    onClick={onSelect}
                    animIdx={i}
                  />
                ))}
          </div>
        ) : (
          <>
            {loading
              ? paged.map((_, i) => <CardSkeleton key={i} />)
              : paged.map((r, i) => (
                  <ResortCard
                    key={r.id}
                    resort={r}
                    isSelected={selId === r.id}
                    onClick={onSelect}
                    animIdx={i}
                  />
                ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="shrink-0 px-4 pb-3 border-t  backdrop-blur-sm">
          <Pagination total={RESORTS.length} page={page} setPage={handlePage} />
        </div>
      )}
    </div>
  );
}


function MapPanel({ selId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const prevSelRef = useRef(null);
  const leafletRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const markerHtml = useCallback(
    (isSel) => `
    <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;
      background:${isSel ? "rgba(251,191,36,0.28)" : "rgba(255,255,255,0.92)"};
      border:2px solid ${isSel ? "#f59e0b" : "rgba(251,191,36,0.65)"};
      backdrop-filter:blur(10px);
      box-shadow:${isSel
        ? "0 0 0 6px rgba(251,191,36,0.18), 0 0 18px rgba(251,191,36,0.65), 0 4px 12px rgba(0,0,0,0.2)"
        : "0 0 0 4px rgba(251,191,36,0.12), 0 0 10px rgba(251,191,36,0.35), 0 2px 8px rgba(0,0,0,0.15)"};
      transform:${isSel ? "scale(1.25)" : "scale(1)"}; transition:all 0.35s; ${isSel ? "animation: markerPulse 1.8s infinite;" : ""}">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${isSel ? "#f59e0b" : "#b45309"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 17l4-8 4 5 3-3 4 6H3z"/>
        <path d="M7 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="${isSel ? "#f59e0b" : "#b45309"}" stroke="none"/>
      </svg>
    </div>
  `,
    [],
  );

  const popupHtml = useCallback(
    (r) => `
    <div style="background:#fff; border-radius:14px; overflow:hidden; color:#1c1917; min-width:210px; font-family:sans-serif;">
      <div style="position:relative;height:110px;"><img src="${r.images[0]}" style="width:100%;height:100%;object-fit:cover;"></div>
      <div style="padding:10px 12px 13px;">
        <div style="font-size:9px;color:#a8a29e;text-transform:uppercase;">${r.region}</div>
        <h3 style="font-size:17px;margin:5px 0;">${r.name}</h3>
        <p style="font-size:11px;color:#78716c;">${r.description}</p>
      </div>
    </div>
  `,
    [],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;
      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: [48, 67],
        zoom: MAP_MIN_ZOOM,
        maxBounds: KZ_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });
      const zoomCtrl = L.control.zoom({ position: "topright" });
      zoomCtrl.addTo(map);
      // Reparent zoom control out of leaflet-top-right corner into map container
      const zcEl = zoomCtrl.getContainer();
      if (zcEl && containerRef.current) {
        containerRef.current.appendChild(zcEl);
        zcEl.style.position = "absolute";
        zcEl.style.right = "12px";
        zcEl.style.top = "50%";
        zcEl.style.transform = "translateY(-50%)";
        zcEl.style.margin = "0";
        zcEl.style.zIndex = "800";
      }

      // ── "light_nolabels" removes all global country/city text ──
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd" },
      ).addTo(map);

      // Add manual city labels for Kazakhstan
      KZ_CITIES.forEach((city) => {
        const cityIcon = L.divIcon({
          className: "city-label",
          html: `<span style="font-size:10px; color:#a8a29e; font-weight:bold; text-transform:uppercase; letter-spacing:1px; white-space:nowrap; pointer-events:none; opacity:0.8;">${city.name}</span>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10],
        });
        L.marker(city.coords, {
          icon: cityIcon,
          interactive: false,
          zIndexOffset: -100,
        }).addTo(map);
      });

      KZ_REGIONS.forEach((reg) => {
        const regIcon = L.divIcon({
          className: "region-label",
          html: `<span style="font-size:9px; color:#d1d1d1; font-weight:500; text-transform:uppercase; letter-spacing:1px; white-space:nowrap; pointer-events:none;">${reg.name}</span>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10],
        });
        L.marker(reg.coords, {
          icon: regIcon,
          interactive: false,
          zIndexOffset: -500,
        }).addTo(map);
      });

      RESORTS.forEach((r) => {
        const icon = L.divIcon({
          className: "",
          html: markerHtml(false),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -20],
        });
        const marker = L.marker(r.coords, { icon })
          .bindPopup(L.popup({ closeButton: false }).setContent(popupHtml(r)))
          .addTo(map)
          .on("click", () => onSelect(r));
        markersRef.current[r.id] = marker;
      });

      mapRef.current = map;
      resizeObserverRef.current = new ResizeObserver(() =>
        applyKzMapConstraints(L, map),
      );
      resizeObserverRef.current.observe(containerRef.current);
    };
    document.body.appendChild(script);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [markerHtml, popupHtml, onSelect]);

  useEffect(() => {
    const L = leafletRef.current;
    if (!L || !mapRef.current || !selId) return;
    if (prevSelRef.current)
      markersRef.current[prevSelRef.current]?.setIcon(
        L.divIcon({
          className: "",
          html: markerHtml(false),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -20],
        }),
      );
    const r = RESORTS.find((res) => res.id === selId);
    if (r) {
      mapRef.current.flyTo(r.coords, 8, { duration: 1.3 });
      markersRef.current[selId]?.setIcon(
        L.divIcon({
          className: "",
          html: markerHtml(true),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -20],
        }),
      );
      setTimeout(() => markersRef.current[selId]?.openPopup(), 750);
    }
    prevSelRef.current = selId;
  }, [selId, markerHtml]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      <style>{`
        .leaflet-popup-content-wrapper{background:transparent!important;box-shadow:none!important;padding:0!important;}
        .leaflet-popup-tip-container{display:none!important;}
        .leaflet-container{background:#f8f7f5!important;}
        .city-label{background:transparent!important; border:none!important; text-align:center;}
        @keyframes markerPulse{ 0%,100%{box-shadow:0 0 20px rgba(251,191,36,0.55);} 50%{box-shadow:0 0 32px rgba(251,191,36,0.8);} }
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
    <div
      className="flex items-center justify-center px-4 py-2.5
      backdrop-blur-md border-b border-[#1a6b1a]/20 shadow-sm shrink-0 z-10"
    >
      {/* Mode switcher */}
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
// APP  (main export)
// ─────────────────────────────────────────────────────────────────────────────
export default function KazakhstanMap() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "both";
    return window.innerWidth < 768 ? "list" : "both";
  });
  const [selId, setSelId] = useState(null);
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

  const handleSelect = useCallback(
    (resort) => {
      setSelId(resort.id);
    },
    [],
  );

  // Panel visibility
  const showList = isMobile ? mode === "list" : mode === "list" || mode === "both";
  // map is now ALWAYS present in DOM

  // "2 в ряд" нужно только в табе списка
  const twoCols = isMobile ? false : mode === "list";

  // Новая логика ширины:
  // если выбрана карта — карта 100%, если оба — карта 50%, если только список — карта 0% (но всегда в DOM)
  const listW = isMobile
    ? mode === "list"
      ? "100%"
      : "0%"
    : mode === "both"
      ? "50%"
      : mode === "list"
        ? "100%"
        : "0%";

  const mapW = isMobile
    ? mode === "map"
      ? "100%"
      : "0%"
    : mode === "map"
      ? "100%"
      : mode === "both"
        ? "50%"
        : "0%";

  return (
    <div
      className="flex flex-col overflow-hidden border border-[#1a6b1a]/20 rounded-2xl"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* ── Top bar ── */}
      <TopBar mode={mode} setMode={setMode} isMobile={isMobile} />

      {/* ── Main panels ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* List panel */}
        <div
          className="h-full overflow-hidden shrink-0 transition-[width,opacity] duration-500"
          style={{ width: listW, opacity: showList ? 1 : 0 }}
        >
          {showList && (
            <ListPanel selId={selId} onSelect={handleSelect} twoCols={twoCols} />
          )}
        </div>

        {/* Divider */}
        {!isMobile && mode === "both" && (
          <div className="w-px shrink-0 bg-linear-to-b from-transparent via-stone-300 to-transparent" />
        )}

        {/* Map panel (ALWAYS in DOM, but width/opacity set to 0 if not active) */}
        <div
          className="h-full overflow-hidden shrink-0 transition-[width,opacity] duration-500"
          style={{
            width: mapW,
            opacity: mapW === "0%" ? 0 : 1,
            pointerEvents: mapW === "0%" ? "none" : undefined,
          }}
          // pointer-events: none — чтобы карта не ловила мышь когда скрыта
        >
          <MapPanel selId={selId} onSelect={handleSelect} />
        </div>
      </div>

      {/* Scrollbar styles */}
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
