"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Utensils,
  Mountain,
  Bed,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import { RequestFormDialog } from "@/components/request-form/request-form";
import FavoriteButton from "@/components/favorite/FavoriteButton";

const MONTH_LABELS = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

function formatPrice(p) {
  if (!p) return null;
  return Number(p).toLocaleString("ru-RU") + " ₸";
}

function seasonLabel(from, to) {
  if (!from || !to) return null;
  return `${MONTH_LABELS[from - 1]} — ${MONTH_LABELS[to - 1]}`;
}

function TagPill({ children, color = "amber" }) {
  const map = {
    amber:   "bg-amber-500/15  text-amber-200   border-amber-400/30",
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    blue:    "bg-blue-500/15   text-blue-200    border-blue-400/30",
    purple:  "bg-purple-500/15 text-purple-200  border-purple-400/30",
    red:     "bg-red-500/15    text-red-200     border-red-400/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${map[color]}`}>
      {children}
    </span>
  );
}

function TagSection({ icon: Icon, title, items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-(--site-accent)" />
        <h3 className="text-white/90 text-sm uppercase tracking-wider font-semibold">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <TagPill key={it.id} color={color}>{it.name}</TagPill>
        ))}
      </div>
    </div>
  );
}

function PhotoCarousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const hasMultiple = total > 1;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % total),
    [total],
  );

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-(--site-accent)/20 bg-[#0a2a0a]/40 aspect-[16/9]">
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt={`${alt} — фото ${i + 1}`}
            fill
            priority={i === 0}
            className="object-cover"
            unoptimized
            sizes="100vw"
          />
        </div>
      ))}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Предыдущее фото"
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Следующее фото"
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Перейти к фото ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-(--site-accent)"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function DirectionClient({ direction, tours }) {
  const season = seasonLabel(direction.best_month_from, direction.best_month_to);

  // Direction carousel images: основное фото + первые фото туров этого направления
  // (даёт возможность реально полистать, пока у direction нет своей галереи).
  const galleryImages = [];
  const seen = new Set();
  if (direction.image_url) {
    galleryImages.push(direction.image_url);
    seen.add(direction.image_url);
  }
  for (const t of tours) {
    const g = Array.isArray(t.gallery) ? t.gallery : [];
    for (const item of g) {
      const src = typeof item === "string" ? item : item?.src;
      if (src && !seen.has(src)) {
        galleryImages.push(src);
        seen.add(src);
        if (galleryImages.length >= 8) break;
      }
    }
    if (galleryImages.length >= 8) break;
  }

  return (
    <main className="bg-[#030f03]">
      {/* spacer под фиксированный хедер */}
      <div className="h-20" aria-hidden="true" />

      {/* Бегущая строка — прямо под navbar, не уходит за него */}
      <MarqueeTicker />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* Заголовок направления */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {direction.region && (
            <div className="inline-flex items-center gap-1.5 text-(--site-accent) text-xs uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              {direction.region}
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <h1
              className="text-4xl md:text-6xl font-bold text-white flex-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {direction.name}
            </h1>
            <FavoriteButton
              kind="direction"
              id={direction.id}
              variant="icon"
              className="mt-2 shrink-0"
            />
          </div>
          {direction.description_short && (
            <p className="text-base md:text-lg text-white/70 max-w-3xl">
              {direction.description_short}
            </p>
          )}
        </motion.div>

        {/* Карусель фото */}
        <section>
          <PhotoCarousel images={galleryImages} alt={direction.name} />
        </section>

        {/* Цены + сезон + CTA «оставить заявку» */}
        <section className="grid md:grid-cols-2 gap-6">
          {(direction.price_adults || direction.price_kids || direction.price_youth) && (
            <div className="rounded-2xl border border-(--site-accent)/30 bg-[#0a2a0a]/50 p-6">
              <h2 className="text-(--site-accent) text-xs uppercase tracking-widest mb-4">Стоимость от</h2>
              <div className="space-y-2 text-white">
                {direction.price_adults && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/70 text-sm">Взрослые</span>
                    <span className="text-2xl font-bold text-(--site-accent)">{formatPrice(direction.price_adults)}</span>
                  </div>
                )}
                {direction.price_youth && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/70 text-sm">Молодёжь</span>
                    <span className="text-xl font-semibold">{formatPrice(direction.price_youth)}</span>
                  </div>
                )}
                {direction.price_kids && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/70 text-sm">Дети</span>
                    <span className="text-xl font-semibold">{formatPrice(direction.price_kids)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {season && (
            <div className="rounded-2xl border border-emerald-500/30 bg-[#0a2a0a]/50 p-6 flex flex-col justify-center">
              <h2 className="text-emerald-300 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Лучшее время
              </h2>
              <p className="text-3xl font-bold text-white">{season}</p>
              <p className="text-white/60 text-sm mt-2">Рекомендуемый сезон для посещения</p>
            </div>
          )}

          {/* Заявка */}
          <div className="md:col-span-2 rounded-2xl border border-(--site-accent)/30 bg-linear-to-br from-[#0a2a0a]/70 to-[#0a2a0a]/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Хотите поехать в {direction.name}?
              </h2>
              <p className="text-white/65 text-sm md:text-base">
                Оставьте заявку — мы подберём программу под ваш состав группы, даты и бюджет.
              </p>
            </div>
            <RequestFormDialog
              kind="tour_request"
              resortDirectionId={direction.id}
              directionPreset={{ id: direction.id, name: direction.name }}
              source={`/directions/${direction.id}`}
              context={{ directionName: direction.name }}
              trigger={
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-semibold text-sm tracking-wider uppercase shadow-lg hover:shadow-[0_8px_24px_var(--site-shadow-strong)] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Оставить заявку
                </motion.button>
              }
            />
          </div>
        </section>

        {/* Полное описание */}
        {direction.description_full && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6"
                style={{ fontFamily: "Cormorant Garamond, serif" }}>
              О направлении
            </h2>
            <div
              className="prose prose-invert max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: direction.description_full }}
            />
          </section>
        )}

        {/* Теги */}
        <section className="grid md:grid-cols-2 gap-10">
          <TagSection icon={Mountain}  title="Природа"     items={direction.nature}         color="emerald" />
          <TagSection icon={Activity}  title="Активности"  items={direction.activities}     color="red" />
          <TagSection icon={Bed}       title="Где жить"    items={direction.accommodations} color="purple" />
          <TagSection icon={Utensils}  title="Где поесть"  items={direction.eating}         color="amber" />
          <TagSection icon={Users}     title="Для кого"    items={direction.for_groups}     color="blue" />
        </section>

        {/* Карта */}
        {direction.lat && direction.lng && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6"
                style={{ fontFamily: "Cormorant Garamond, serif" }}>
              На карте
            </h2>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src={`https://maps.google.com/maps?q=${direction.lat},${direction.lng}&z=10&output=embed`}
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* Туры в этом направлении */}
        {tours.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-3xl font-bold text-white"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Туры в {direction.name}
              </h2>
              <Link href="/tours" className="text-(--site-accent) text-sm hover:underline inline-flex items-center gap-1">
                Все туры <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((t) => {
                const img = Array.isArray(t.gallery) && t.gallery[0]
                  ? (typeof t.gallery[0] === "string" ? t.gallery[0] : t.gallery[0].src)
                  : direction.image_url;
                return (
                  <div
                    key={t.id}
                    className="group relative rounded-2xl overflow-hidden border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 hover:border-(--site-accent)/40 transition"
                  >
                    <FavoriteButton kind="tour" id={t.id} variant="absolute" />
                    <Link href={`/tours/${t.id}`} className="block">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={img}
                        alt={t.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-white font-semibold">{t.title}</h3>
                      {t.city && (
                        <p className="text-white/50 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {t.city}
                        </p>
                      )}
                      {t.price && (
                        <div className="text-(--site-accent) text-lg font-bold pt-1">
                          от {formatPrice(t.price)}
                        </div>
                      )}
                    </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
