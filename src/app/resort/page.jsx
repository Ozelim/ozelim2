"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Utensils,
  Waves,
  Dumbbell,
  Heart,
  Leaf,
  Thermometer,
  Wind,
  Sun,
  Check,
  ArrowRight,
  Phone,
  Bath,
  Activity,
  Shield,
  Clock,
  Calendar,
  Users,
  Camera,
  MessageSquare,
  Navigation,
  Award,
  ChevronDown,
  Bed,
  Coffee,
  Car,
  Snowflake,
  Tv,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Data ──────────────────────────────────────────────────────────────────────

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80",
    caption: "Главный корпус",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80",
    caption: "СПА и бассейн",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    caption: "Номерной фонд",
  },
  {
    src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80",
    caption: "Ресторан",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80",
    caption: "Территория",
  },
  {
    src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80",
    caption: "Лечебный корпус",
  },
];

const ROOMS = [
  {
    name: "Стандарт",
    size: 28,
    guests: 2,
    price: 12000,
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75",
    amenities: ["Двуспальная кровать", "Телевизор", "Мини-бар", "Балкон"],
  },
  {
    name: "Делюкс",
    size: 42,
    guests: 2,
    price: 18500,
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=75",
    amenities: ["King-size кровать", "Джакузи", "Гостиная зона", "Вид на горы"],
    badge: "Популярный",
  },
  {
    name: "Люкс",
    size: 68,
    guests: 3,
    price: 28000,
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=75",
    amenities: [
      "Спальня + гостиная",
      "Панорамный вид",
      "Личный тренажёр",
      "Дворецкий",
    ],
    badge: "Премиум",
  },
  {
    name: "Апартаменты",
    size: 95,
    guests: 4,
    price: 42000,
    img: "https://images.unsplash.com/photo-1551776235-dde6d482980b?w=600&q=75",
    amenities: [
      "2 спальни",
      "Кухня",
      "Терраса с бассейном",
      "VIP-обслуживание",
    ],
    badge: "VIP",
  },
];

const AMENITIES_GROUPS = [
  {
    title: "Здоровье и СПА",
    icon: Bath,
    items: [
      "Бальнеологический корпус",
      "Грязелечебница",
      "Соляная пещера",
      "Сауна и хаммам",
      "Массажный кабинет",
      "Кедровая бочка",
    ],
  },
  {
    title: "Спорт и активность",
    icon: Dumbbell,
    items: [
      "Открытый бассейн 25м",
      "Крытый бассейн",
      "Фитнес-зал",
      "Теннисный корт",
      "Прогулочные маршруты",
      "Велопрокат",
    ],
  },
  {
    title: "Питание",
    icon: Utensils,
    items: [
      "Ресторан (диетическое меню)",
      "Лечебный буфет",
      "Бар у бассейна",
      "Room service 24/7",
      "Детокс-программы",
      "Фитобар",
    ],
  },
  {
    title: "Сервис",
    icon: Shield,
    items: [
      "Медицинская служба 24/7",
      "Консьерж-сервис",
      "Трансфер из аэропорта",
      "Бесплатный Wi-Fi",
      "Парковка",
      "Детский клуб",
    ],
  },
];

const REVIEWS = [
  {
    name: "Алина Кравцова",
    date: "Март 2026",
    rating: 5,
    avatar: "https://i.pravatar.cc/64?img=1",
    text: "Провела здесь 14 дней по программе детокс. Это лучшее, что я делала для своего здоровья. Персонал очень внимательный, процедуры — на высшем уровне. Вернусь обязательно!",
    program: "Детокс 14 дней",
  },
  {
    name: "Сергей Мамедов",
    date: "Февраль 2026",
    rating: 5,
    avatar: "https://i.pravatar.cc/64?img=3",
    text: "Отличная реабилитация после операции. Врачи составили индивидуальный план, все процедуры строго по расписанию. Питание диетическое, но очень вкусное. Горячо рекомендую.",
    program: "Реабилитация",
  },
  {
    name: "Наталья Дмитриева",
    date: "Январь 2026",
    rating: 4,
    avatar: "https://i.pravatar.cc/64?img=5",
    text: "Прекрасное место для отдыха и оздоровления. Природа вокруг просто восхитительная. Чуть не хватило звёзд из-за очереди в бальнеологию, но всё остальное — безупречно.",
    program: "Антистресс 7 дней",
  },
  {
    name: "Дмитрий Тихонов",
    date: "Декабрь 2025",
    rating: 5,
    avatar: "https://i.pravatar.cc/64?img=7",
    text: "Я посетил уже 4 раза. Каждый год качество только растёт. Новый СПА-корпус — просто шедевр. Номера Делюкс с видом на горы — незабываемо.",
    program: "Кардио 14 дней",
  },
];

const PROGRAMS = [
  {
    name: "Антистресс",
    days: 7,
    price: "84 000 ₸",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    icon: Leaf,
    includes: [
      "Первичная диагностика",
      "Психотерапия (3 сеанса)",
      "Ароматерапевтический массаж",
      "Флоатинг-терапия",
      "Медитации и йога",
      "Диетическое питание",
    ],
  },
  {
    name: "Детокс",
    days: 10,
    price: "124 000 ₸",
    color: "from-lime-500/20 to-emerald-500/10",
    border: "border-lime-500/20",
    icon: Droplets,
    includes: [
      "Полная детокс-диагностика",
      "Разгрузочная диета",
      "Лимфодренажный массаж",
      "Кишечное орошение",
      "Грязевые обёртывания",
      "Кедровая бочка",
    ],
  },
  {
    name: "Кардиология",
    days: 14,
    price: "176 000 ₸",
    color: "from-red-500/10 to-rose-500/5",
    border: "border-red-500/20",
    icon: Activity,
    includes: [
      "ЭКГ и холтер-мониторинг",
      "Консультация кардиолога",
      "Бальнеотерапия",
      "ЛФК + физиотерапия",
      "Диетология",
      "Климатотерапия",
    ],
  },
  {
    name: "Омоложение",
    days: 7,
    price: "98 000 ₸",
    color: "from-purple-500/15 to-violet-500/10",
    border: "border-purple-500/20",
    icon: Sun,
    includes: [
      "Биоимпедансный анализ",
      "Плазмолифтинг",
      "Мезотерапия лица",
      "Аппаратные процедуры",
      "Массаж лица и шеи",
      "Авторские косметические SPA",
    ],
  },
];

const TABS = [
  { id: "overview", label: "Обзор", icon: Award },
  { id: "rooms", label: "Номера", icon: Bed },
  { id: "amenities", label: "Услуги", icon: Waves },
  { id: "programs", label: "Программы", icon: Activity },
  { id: "reviews", label: "Отзывы", icon: MessageSquare },
  { id: "location", label: "Расположение", icon: Navigation },
];

// ─── Lightbox Modal ────────────────────────────────────────────────────────────
function LightboxModal({ initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (idx) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent((idx + GALLERY.length) % GALLERY.length);
    },
    [current],
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          {current + 1} / {GALLERY.length}
        </div>

        {/* Main image */}
        <div
          className="relative flex-1 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
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
                  src={GALLERY[current].src}
                  alt={GALLERY[current].caption}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <span className="text-white/90 text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              {GALLERY[current].caption}
            </span>
          </div>

          {/* Arrows */}
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

        {/* Thumbnails */}
        <div
          className="flex gap-2 p-4 justify-center overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {GALLERY.map((item, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative rounded-xl overflow-hidden shrink-0 w-16 h-16 transition-all duration-300 ${
                i === current
                  ? "ring-2 ring-(--site-accent) ring-offset-2 ring-offset-black scale-110"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Image Slider ──────────────────────────────────────────────────────────────
function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const timerRef = useRef(null);

  const go = useCallback(
    (idx) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent((idx + GALLERY.length) % GALLERY.length);
    },
    [current],
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
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="flex flex-col gap-4 h-full">
        {/* Main slide */}
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
                src={GALLERY[current].src}
                alt={GALLERY[current].caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {GALLERY[current].caption}
                </span>
                <span className="text-white/60 text-xs bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  {current + 1} / {GALLERY.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
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

          {/* Dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {GALLERY.map((_, i) => (
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

        {/* Thumbnails */}
        <div className="grid grid-cols-6 gap-2">
          {GALLERY.map((item, i) => (
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

// ─── Tab content components ───────────────────────────────────────────────────

function OverviewTab() {
  const stats = [
    { label: "Лет работы", value: "25+" },
    { label: "Врачей", value: "48" },
    { label: "Процедур", value: "120+" },
    { label: "Гостей в год", value: "12 000" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-5 text-center"
          >
            <div
              className="text-3xl font-bold text-(--site-accent) mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {s.value}
            </div>
            <div className="text-white/50 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3
            className="text-2xl font-bold text-white mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            О курорте
          </h3>
          <div className="space-y-4 text-white/60 text-sm leading-relaxed">
            <p>
              Горный Кристалл — один из ведущих оздоровительных курортов
              Казахстана, расположенный на высоте 1 800 метров над уровнем моря
              в живописном ущелье предгорий Алатау. Основан в 1999 году и с тех
              пор принял более 250 000 гостей.
            </p>
            <p>
              Уникальное сочетание природного климата, минеральных источников и
              современных медицинских технологий позволяет достичь выдающихся
              результатов в лечении и профилактике целого ряда заболеваний.
            </p>
            <p>
              Курорт располагает четырьмя специализированными корпусами:
              бальнеологическим, физиотерапевтическим, косметологическим и
              реабилитационным. Все они соединены крытыми переходами.
            </p>
          </div>
        </div>
        <div>
          <h3
            className="text-2xl font-bold text-white mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Медицинский профиль
          </h3>
          <div className="space-y-3">
            {[
              "Заболевания опорно-двигательного аппарата",
              "Сердечно-сосудистые заболевания",
              "Болезни органов дыхания",
              "Неврологические расстройства",
              "Метаболические нарушения и ожирение",
              "Стресс и синдром хронической усталости",
              "Восстановление после операций",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-white/70 text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-(--site-accent)" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div>
        <h3
          className="text-2xl font-bold text-white mb-6"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Лицензии и сертификаты
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "ISO 9001:2015",
              desc: "Система менеджмента качества",
              icon: Award,
            },
            {
              title: "JCI Accreditation",
              desc: "Международная аккредитация больниц",
              icon: Shield,
            },
            {
              title: "МЗ РК №0847",
              desc: "Лицензия на медицинскую деятельность",
              icon: Shield,
            },
          ].map((cert) => (
            <div
              key={cert.title}
              className="flex items-start gap-4 p-4 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/30"
            >
              <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/20 flex items-center justify-center shrink-0">
                <cert.icon className="w-4 h-4 text-(--site-accent)" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">{cert.title}</div>
                <div className="text-white/40 text-xs mt-0.5">{cert.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RoomsTab() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const roomIcons = {
    "Двуспальная кровать": Bed,
    "King-size кровать": Bed,
    default: Check,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-5">
        {ROOMS.map((room, i) => (
          <motion.div
            key={room.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`group rounded-3xl overflow-hidden border bg-[#0a2a0a]/40 transition-all duration-500 card-hover cursor-pointer ${
              selectedRoom === i
                ? "border-(--site-accent)/40"
                : "border-[#1a6b1a]/20 hover:border-(--site-accent)/20"
            }`}
            onClick={() => setSelectedRoom(selectedRoom === i ? null : i)}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={room.img}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              {room.badge && (
                <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-(--site-accent) text-(--site-on-accent) font-bold">
                  {room.badge}
                </span>
              )}
              <div className="absolute bottom-4 left-4">
                <h4
                  className="text-white! font-bold text-xl"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {room.name}
                </h4>
                <div className="flex items-center gap-3 text-white/90 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" /> {room.size} м²
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> до {room.guests} гостей
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    className="text-xs px-2 py-1 rounded-full bg-[#1a6b1a]/20 border border-[#1a6b1a]/30 text-[#266426] dark:text-[#6db86d]"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/40 text-xs">от</div>
                  <div className="text-(--site-accent) font-bold text-xl">
                    {room.price.toLocaleString()} ₸
                    <span className="text-white/50 font-normal text-xs">
                      {" "}
                      /сутки
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-full bg-linear-to-r from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/30 text-(--site-accent) text-sm font-medium hover:from-(--site-accent) hover:to-(--site-accent-bright) hover:text-(--site-on-accent) transition-all duration-300">
                  Забронировать
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Room features legend */}
      <div className="rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/30 p-6">
        <h4 className="text-white font-bold mb-4">В каждом номере</h4>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: Wifi, label: "Бесплатный Wi-Fi" },
            { icon: Tv, label: 'Smart TV 55"' },
            { icon: Snowflake, label: "Климат-контроль" },
            { icon: Coffee, label: "Чай / кофе" },
            { icon: Shield, label: "Сейф" },
            { icon: Car, label: "Парковка включена" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-white/60 text-sm"
            >
              <Icon className="w-4 h-4 text-(--site-accent) shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AmenitiesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid md:grid-cols-2 gap-6"
    >
      {AMENITIES_GROUPS.map((group, i) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/20 flex items-center justify-center">
              <group.icon className="w-5 h-5 text-(--site-accent)" />
            </div>
            <h4
              className="text-white font-bold text-lg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {group.title}
            </h4>
          </div>
          <div className="space-y-2.5">
            {group.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-white/60 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-(--site-accent)/60 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProgramsTab() {
  const [activeProgram, setActiveProgram] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Program selector */}
      <div className="flex gap-2 flex-wrap">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActiveProgram(i)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeProgram === i
                ? "text-(--site-on-accent)"
                : "text-white/60 border border-white/10 hover:text-white hover:border-white/30"
            }`}
          >
            {activeProgram === i && (
              <motion.div
                layoutId="prog-tab"
                className="absolute inset-0 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright)"
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <p.icon className="w-3.5 h-3.5" />
              {p.name}
            </span>
          </button>
        ))}
      </div>

      {/* Program detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProgram}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className={`rounded-3xl border bg-[#0a2a0a]/40 p-8 bg-linear-to-br ${PROGRAMS[activeProgram].color} ${PROGRAMS[activeProgram].border}`}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/20 flex items-center justify-center">
                  {(() => {
                    const Icon = PROGRAMS[activeProgram].icon;
                    return <Icon className="w-5 h-5 text-(--site-accent)" />;
                  })()}
                </div>
                <h3
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Программа «{PROGRAMS[activeProgram].name}»
                </h3>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-sm mb-6">
                <Clock className="w-4 h-4 text-(--site-accent)" />
                {PROGRAMS[activeProgram].days} дней /{" "}
                {PROGRAMS[activeProgram].days - 1} ночей
              </div>
              <div className="space-y-3">
                {PROGRAMS[activeProgram].includes.map((item) => (
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
            </div>
            <div className="shrink-0 flex flex-col items-center justify-between gap-6">
              <div className="text-center">
                <div className="text-white/50 text-sm mb-1">Стоимость</div>
                <div
                  className="text-4xl font-bold text-(--site-accent)"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {PROGRAMS[activeProgram].price}
                </div>
                <div className="text-white/50 text-xs mt-1">
                  включая проживание и питание
                </div>
              </div>
              <div className="space-y-3 w-full">
                <button className="w-full px-6 py-3 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm hover:shadow-[0_0_30px_var(--site-shadow-strong)] transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Записаться
                </button>
                <button className="w-full px-6 py-3 rounded-full border border-(--site-accent)/30 text-(--site-accent) text-sm hover:bg-(--site-accent)/10 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" /> Выбрать дату
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* All programs mini grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActiveProgram(i)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeProgram === i
                ? "border-(--site-accent)/40 bg-(--site-accent)/8"
                : "border-[#1a6b1a]/20 bg-[#0a2a0a]/30 hover:border-(--site-accent)/20"
            }`}
          >
            <div
              className="text-(--site-accent) font-bold text-lg mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {p.name}
            </div>
            <div className="text-white/40 text-xs">{p.days} дней</div>
            <div className="text-white/80 text-sm font-bold mt-2">
              {p.price}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ReviewsTab() {
  const avg = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40">
        <div className="text-center shrink-0">
          <div
            className="text-6xl font-bold text-(--site-accent)"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {avg}
          </div>
          <div className="flex justify-center gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(Number(avg)) ? "text-(--site-accent) fill-current" : "text-white/20"}`}
              />
            ))}
          </div>
          <div className="text-white/40 text-xs">{REVIEWS.length} отзывов</div>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = REVIEWS.filter((r) => r.rating === star).length;
            const pct = Math.round((count / REVIEWS.length) * 100);
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-white/40 text-xs w-4 text-right">
                  {star}
                </span>
                <Star className="w-3 h-3 text-(--site-accent) fill-current shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                    className="h-full rounded-full bg-(--site-accent)"
                  />
                </div>
                <span className="text-white/30 text-xs w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-(--site-accent)/30">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">
                    {review.name}
                  </span>
                  <span className="text-white/30 text-xs">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= review.rating ? "text-(--site-accent) fill-current" : "text-white/20"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {review.text}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#1a6b1a]/20 border border-[#1a6b1a]/30 text-[#86c986]">
              <Activity className="w-3 h-3" /> {review.program}
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-4 rounded-2xl border border-(--site-accent)/20 text-(--site-accent) text-sm hover:bg-(--site-accent)/8 transition-colors">
        Показать все отзывы (312)
      </button>
    </motion.div>
  );
}

function LocationTab() {
  const details = [
    {
      icon: MapPin,
      label: "Адрес",
      value: "Алматы, предгорья Алатау, Медеу ущелье, 1800м н.у.м.",
    },
    {
      icon: Car,
      label: "Трансфер",
      value: "Аэропорт — Курорт: 45 мин. Бесплатный трансфер при заезде",
    },
    {
      icon: Clock,
      label: "Время заезда",
      value: "Заезд с 14:00 · Выезд до 12:00",
    },
    { icon: Phone, label: "Телефон", value: "+7 (727) 399-55-55" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Map placeholder */}
      <div className="relative rounded-3xl overflow-hidden h-72 bg-[#0a2a0a]/40 border border-[#1a6b1a]/20 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1200&q=80')",
          }}
        />
        <div className="relative z-10 text-center">
          <Navigation className="w-12 h-12 text-(--site-accent) mx-auto mb-3" />
          <div className="text-white font-bold">Горный Кристалл</div>
          <div className="text-white/50 text-sm">
            Алматы, Казахстан · 1800м н.у.м.
          </div>
          <button className="mt-4 px-5 py-2 rounded-full border border-(--site-accent)/40 text-(--site-accent) text-sm hover:bg-(--site-accent)/10 transition-colors">
            Открыть в Google Maps
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid sm:grid-cols-2 gap-4">
        {details.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-4 p-4 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40"
          >
            <div className="w-9 h-9 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-(--site-accent)" />
            </div>
            <div>
              <div className="text-white/40 text-xs mb-0.5">{label}</div>
              <div className="text-white text-sm">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Nearby */}
      <div>
        <h4 className="text-white font-bold mb-4">Рядом с курортом</h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { place: "Каток Медеу", dist: "3 км" },
            { place: "Чимбулак (горнолыжный)", dist: "8 км" },
            { place: "Центр Алматы", dist: "22 км" },
            { place: "Аэропорт", dist: "38 км" },
            { place: "Большое Алматинское озеро", dist: "15 км" },
            { place: "Ботанический сад", dist: "12 км" },
          ].map(({ place, dist }) => (
            <div
              key={place}
              className="flex items-center justify-between p-3 rounded-xl border border-[#1a6b1a]/15 bg-[#0a2a0a]/30 text-sm"
            >
              <span className="text-white/70">{place}</span>
              <span className="text-(--site-accent) text-xs font-bold">
                {dist}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ResortPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlisted, setWishlisted] = useState(false);

  const tabContent = {
    overview: <OverviewTab />,
    rooms: <RoomsTab />,
    amenities: <AmenitiesTab />,
    programs: <ProgramsTab />,
    reviews: <ReviewsTab />,
    location: <LocationTab />,
  };

  return (
    <main>
      {/* ── Hero Banner ── */}
      <section className="relative h-72 overflow-hidden px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030f03]/60 via-[#030f03]/30 to-app-bg" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Курорт · Казахстан
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Горный Кристалл
            </h1>
            <Button variant="link" className="text-xs uppercase tracking-widest mt-4 cursor-pointer text-white underline">
              Crazy Mega Resorts
            </Button>
            
          </motion.div>
        </div>
      </section>

      {/* ── Main content: Slider + Info ── */}
      <section className="pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <ImageSlider />
            </motion.div>

            {/* RIGHT: Info panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5"
            >
              {/* Price card */}
              <div className="rounded-3xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-white/40 text-sm mb-1">от</div>
                    <div
                      className="text-4xl font-bold text-(--site-accent)"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      12 000 ₸
                    </div>
                    <div className="text-white/50 text-xs">
                      за сутки, включая питание
                    </div>
                  </div>
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                      wishlisted
                        ? "border-red-400/50 bg-red-500/15 text-red-400"
                        : "border-white/15 text-white/40 hover:border-white/30"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Номера", value: "186" },
                    { label: "Процедур", value: "120+" },
                    { label: "Рейтинг", value: "★ 4.9" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[#1a6b1a]/15 bg-[#0a2a0a]/30 p-3 text-center"
                    >
                      <div className="text-white font-bold text-sm">
                        {s.value}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-5">
                  <button className="w-full py-3.5 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm hover:shadow-[0_0_30px_var(--site-shadow-strong)] transition-all flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" /> Забронировать
                  </button>
                  <button className="w-full py-3.5 rounded-full border border-(--site-accent)/30 text-(--site-accent) text-sm hover:bg-(--site-accent)/10 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Позвонить
                  </button>
                </div>

                <div className="text-center text-white/50 text-xs">
                  Бесплатная отмена за 24 часа · Трансфер включён
                </div>
              </div>

              {/* Quick features */}
              <div className="rounded-3xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-6">
                <div className="flex items-center flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-(--site-accent)" />
                    Алматы, Казахстан · 1800м н.у.м.
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-(--site-accent) fill-current" />
                    <span className="text-white font-bold">4.9</span>
                    <span className="text-white/40 text-sm">(312 отзывов)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-(--site-accent)/15 border border-(--site-accent)/30 text-(--site-accent) text-xs font-bold">
                    Горный воздух
                  </span>
                </div>
                <h3
                  className="text-white font-bold text-lg mb-4 mt-3"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Ключевые особенности
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Thermometer, label: "Минеральные источники" },
                    { icon: Wind, label: "Соляная пещера" },
                    { icon: Waves, label: "Крытый бассейн" },
                    { icon: Bath, label: "Бальнеология" },
                    { icon: Leaf, label: "Фитотерапия" },
                    { icon: Dumbbell, label: "Фитнес и йога" },
                    { icon: Utensils, label: "Диетическое меню" },
                    { icon: Shield, label: "Врачи 24/7" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-white/60 text-sm"
                    >
                      <div className="w-7 h-7 rounded-lg bg-(--site-accent)/12 border border-(--site-accent)/15 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-(--site-accent)" />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Горный воздух",
                  "Семьи",
                  "Пожилые",
                  "Реабилитация",
                  "Детокс",
                  "Антистресс",
                  "Кардио",
                  "Омоложение",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs border border-[#1a6b1a]/25 bg-[#1a6b1a]/12 text-[#2f4730] dark:text-[#afc7b1]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tabs section ── */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Tab bar */}
          <div className="sticky top-20 z-20 mb-8">
            <div className="flex gap-1 p-1 rounded-2xl bg-[#0a2a0a]/80 backdrop-blur-xl border border-[#1a6b1a]/20 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-(--site-on-accent)"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright)"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <tab.icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <div key={activeTab}>{tabContent[activeTab]}</div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden relative"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#030f03]/90 dark:from-[#030f03]/90 dark:to-[#030f03]/20" />
            <div className="relative z-10 p-10 md:p-14">
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Специальное предложение
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                <span className="text-white!">Раннее бронирование</span>
                <br />
                <span className="text-gradient">скидка 15%</span>
              </h2>
              <p className="text-white/90 mb-8 max-w-md">
                При бронировании за 30+ дней до заезда. Предложение действует до
                конца апреля 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-8 py-4 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm hover:shadow-[0_0_30px_var(--site-shadow-strong)] transition-all">
                  Забронировать со скидкой
                </button>
                <button className="px-8 py-4 rounded-full border border-white/30 text-white hover:border-(--site-accent)/50 hover:bg-white/5 font-medium text-sm transition-colors">
                  Узнать детали
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
