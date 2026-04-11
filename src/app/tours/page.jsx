"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import Carousel1 from "@/components/sections/Carousel1";
import Accordion from "@/components/sections/Accordion";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  ArrowRight,
  Filter,
  Grid,
  List,
  ChevronDown,
  Flame,
  Mountain,
  Waves,
  Trees,
  Building2,
  Compass,
  Globe,
} from "lucide-react";
import Image from "next/image";
import TourFilter from "@/components/filter/TourFilter";
import KazakhstanMap from "./KazakhstanMap";

const allTours = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=700&q=75",
    country: "Испания",
    city: "Барселона",
    title: "Сокровища Каталонии",
    days: 8,
    group: "6–12",
    rating: 4.9,
    reviews: 128,
    price: 2100,
    type: "Город",
    hot: true,
    month: "Апрель",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1527549993586-dff825b37782?w=700&q=75",
    country: "Исландия",
    city: "Рейкьявик",
    title: "Северное сияние",
    days: 7,
    group: "4–10",
    rating: 5.0,
    reviews: 67,
    price: 3400,
    type: "Природа",
    hot: true,
    month: "Январь",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=75",
    country: "Аргентина",
    city: "Патагония",
    title: "Дикая Патагония",
    days: 14,
    group: "6–12",
    rating: 4.9,
    reviews: 42,
    price: 5200,
    type: "Горы",
    hot: false,
    month: "Март",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&q=75",
    country: "Норвегия",
    city: "Берген",
    title: "Фьорды Норвегии",
    days: 12,
    group: "6–14",
    rating: 4.9,
    reviews: 83,
    price: 3100,
    type: "Природа",
    hot: false,
    month: "Июнь",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=700&q=75",
    country: "Хорватия",
    city: "Дубровник",
    title: "Адриатическая жемчужина",
    days: 10,
    group: "10–18",
    rating: 4.7,
    reviews: 151,
    price: 2600,
    type: "Море",
    hot: false,
    month: "Июль",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=75",
    country: "Кения",
    city: "Масаи Мара",
    title: "Сафари: Великое переселение",
    days: 11,
    group: "4–8",
    rating: 5.0,
    reviews: 45,
    price: 5800,
    type: "Экзотика",
    hot: true,
    month: "Август",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=700&q=75",
    country: "Вьетнам",
    city: "Ханой",
    title: "Тайны Вьетнама",
    days: 15,
    group: "8–16",
    rating: 4.8,
    reviews: 94,
    price: 2400,
    type: "Экзотика",
    hot: false,
    month: "Февраль",
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=75",
    country: "Швейцария",
    city: "Церматт",
    title: "Альпийская сказка",
    days: 9,
    group: "6–12",
    rating: 4.8,
    reviews: 76,
    price: 3900,
    type: "Горы",
    hot: false,
    month: "Декабрь",
  },
  {
    id: 9,
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=700&q=75",
    country: "Франция",
    city: "Прованс",
    title: "Лавандовые поля",
    days: 6,
    group: "8–16",
    rating: 4.8,
    reviews: 94,
    price: 1850,
    type: "Город",
    hot: false,
    month: "Июль",
  },
];

const types = ["Все", "Горы", "Море", "Город", "Природа", "Экзотика"];
const typeIcons = {
  Горы: Mountain,
  Море: Waves,
  Город: Building2,
  Природа: Trees,
  Экзотика: Globe,
  Все: Compass,
};

const priceRanges = ["Любая цена", "до €2 000", "€2 000 – €3 500", "от €3 500"];

export default function ToursPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("Все");
  const [priceRange, setPriceRange] = useState("Любая цена");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allTours.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.country.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "Все" || t.type === activeType;
    const matchPrice =
      priceRange === "Любая цена" ||
      (priceRange === "до €2 000" && t.price < 2000) ||
      (priceRange === "€2 000 – €3 500" &&
        t.price >= 2000 &&
        t.price <= 3500) ||
      (priceRange === "от €3 500" && t.price > 3500);
    return matchSearch && matchType && matchPrice;
  });

  return (
    <main>
      <Hero
        title="Открой"
        highlight="Казахстан"
        subtitle="Подберите тур в нашем калькуляторе туров"
      />
      <MarqueeTicker />

      {/* Filter bar */}
      {/* <section className="py-12 px-6 sticky top-20 z-30 bg-[#030f03]/90 backdrop-blur-xl border-b border-[#1a6b1a]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск тура или страны..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FFD700]/40 transition-colors"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {types.map((type) => {
                const Icon = typeIcons[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeType === type
                        ? "text-[#030f03]"
                        : "text-white/50 border border-white/10 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {activeType === type && (
                      <motion.div
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-linear-to-r from-[#FFD700] to-[#C8FF00]"
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{type}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 rounded-2xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-white/70 text-sm focus:outline-none focus:border-[#FFD700]/40 cursor-pointer"
                >
                  {priceRanges.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
              </div>

              <div className="flex rounded-xl overflow-hidden border border-[#1a6b1a]/30">
                {["grid", "list"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === mode ? "bg-[#FFD700] text-[#030f03]" : "text-white/40 hover:text-white"}`}
                  >
                    {mode === "grid" ? (
                      <Grid className="w-3.5 h-3.5" />
                    ) : (
                      <List className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-10 md:h-auto">
        <TourFilter />
      </div>

      <KazakhstanMap />

      {/* Tours Grid / List */}
      {/* <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-white/50 text-sm">
              Найдено{" "}
              <span className="text-[#FFD700] font-bold">
                {filtered.length}
              </span>{" "}
              туров
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + activeType + priceRange + search}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((tour, i) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-[#FFD700]/20 transition-all duration-500 card-hover cursor-pointer ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${viewMode === "list" ? "w-56 shrink-0" : "h-52"}`}
                  >
                    <Image
                      src={tour.img}
                      alt={tour.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
                    {tour.hot && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FFD700] text-[#030f03] text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Горящий
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[#FFD700]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-sm font-bold">{tour.rating}</span>
                      <span className="text-white/50 text-xs">
                        ({tour.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                        <MapPin className="w-3 h-3" /> {tour.city},{" "}
                        {tour.country}
                        <span className="ml-auto text-[#1a6b1a] border border-[#1a6b1a]/40 rounded-full px-2 py-0.5">
                          {tour.type}
                        </span>
                      </div>
                      <h3
                        className="text-white font-bold text-xl mb-3"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {tour.title}
                      </h3>
                      {viewMode === "list" && (
                        <p className="text-white/40 text-sm mb-4 line-clamp-2">
                          Незабываемое путешествие по живописным маршрутам с
                          опытными гидами. Включены проживание, трансфер и
                          экскурсионная программа.
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {tour.days} дней
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {tour.group} чел.
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/40 text-xs">от</div>
                          <div className="text-[#FFD700] font-bold text-xl">
                            € {tour.price.toLocaleString()}
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-full bg-linear-to-r from-[#FFD700]/20 to-[#C8FF00]/10 border border-[#FFD700]/30 text-[#FFD700] text-sm font-medium hover:from-[#FFD700] hover:to-[#C8FF00] hover:text-[#030f03] transition-all duration-300">
                          Забронировать
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-white/30"
            >
              <Globe className="w-12 h-12 mx-auto mb-4 text-white/10" />
              <p className="text-lg">
                Туры не найдены. Попробуйте изменить фильтры.
              </p>
            </motion.div>
          )}
        </div>
      </section> */}

      {/* Carousel promo */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-white mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Вдохновляющие маршруты
          </h2>
          <Carousel1 />
        </div>
      </section>

      <Accordion />
      <MarqueeTicker />
      <Footer />
    </main>
  );
}
