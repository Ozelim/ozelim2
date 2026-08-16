"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import TourFilter from "@/components/filter/TourFilter";
import {
  DEFAULT_FILTER,
  DURATION_MIN_DAYS,
  DURATION_MAX_DAYS,
} from "@/components/filter/FilterState";

// next/dynamic c ssr:false можно использовать только из клиентских компонентов.
// Сама карта Leaflet — browser-only, поэтому подгружаем её здесь.
const KazakhstanMap = dynamic(() => import("./KazakhstanMap"), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-6">
      <div className="h-[480px] rounded-2xl bg-[#0a2a0a]/40 border border-[#1a6b1a]/20 animate-pulse" />
    </div>
  ),
});

function formatDate(d) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function buildSearchParams(filter) {
  const sp = new URLSearchParams();
  if (!filter) return sp;
  if (filter.directionId) sp.set("directionId", String(filter.directionId));
  (filter.tourTypes ?? []).forEach((t) => sp.append("tourType", t));
  if (filter.hotelClass) sp.set("hotelClass", String(filter.hotelClass));
  if (filter.onlyHot) sp.set("onlyHot", "1");
  if (filter.onlyPopular) sp.set("onlyPopular", "1");
  // Длительность уходит на сервер всегда, кроме случая «весь диапазон 1—30»,
  // который фильтром не является. Первичная выдача сюда не попадает вообще:
  // она грузится с filter === null и показывает все туры.
  {
    const lo = filter.durationMinDays ?? DURATION_MIN_DAYS;
    const hi = filter.durationMaxDays ?? DURATION_MAX_DAYS;
    if (!(lo <= DURATION_MIN_DAYS && hi >= DURATION_MAX_DAYS)) {
      sp.set("durationMin", String(lo));
      sp.set("durationMax", String(hi));
    }
  }
  if (filter.priceMin != null && filter.priceMin !== DEFAULT_FILTER.priceMin) {
    sp.set("priceMin", String(filter.priceMin));
  }
  if (filter.priceMax != null && filter.priceMax !== DEFAULT_FILTER.priceMax) {
    sp.set("priceMax", String(filter.priceMax));
  }
  const df = formatDate(filter.dateFrom);
  const dt = formatDate(filter.dateTo);
  if (df) sp.set("dateFrom", df);
  if (dt) sp.set("dateTo", dt);
  return sp;
}

export default function TripsExplorer() {
  const [directions, setDirections] = useState([]);
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const fetchSeq = useRef(0);

  const fetchTours = useCallback(async (filter) => {
    const seq = ++fetchSeq.current;
    setLoadingTours(true);
    try {
      const sp = buildSearchParams(filter);
      const qs = sp.toString();
      const res = await fetch(`/api/tours/search${qs ? `?${qs}` : ""}`);
      const json = await res.json();
      if (seq === fetchSeq.current) {
        setTours(Array.isArray(json?.tours) ? json.tours : []);
      }
    } catch {
      if (seq === fetchSeq.current) setTours([]);
    } finally {
      if (seq === fetchSeq.current) setLoadingTours(false);
    }
  }, []);

  // Mount: загрузка направлений (один раз) + первичная загрузка туров без фильтра.
  useEffect(() => {
    let alive = true;
    fetch("/api/resort-directions/published")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setDirections(Array.isArray(d?.directions) ? d.directions : []);
      })
      .catch(() => {
        if (alive) setDirections([]);
      });
    fetchTours(null);
    return () => {
      alive = false;
    };
  }, [fetchTours]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-10 md:h-auto">
        <TourFilter onSearch={fetchTours} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6 flex flex-col items-center gap-4">
        <h2
          className="text-xl md:text-2xl font-medium text-white tracking-wide"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Выберите направление или готовый тур
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.18)]">
            <span className="text-2xl font-bold text-amber-400 leading-none">
              {directions.length}
            </span>
            <span className="text-xs uppercase tracking-widest text-white/70">
              направлений
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/15 border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.18)]">
            <span className="text-2xl font-bold text-green-400 leading-none">
              {loadingTours ? "…" : tours.length}
            </span>
            <span className="text-xs uppercase tracking-widest text-white/70">
              туров
            </span>
          </div>
        </div>
      </div>

      <KazakhstanMap
        directions={directions}
        tours={tours}
        loadingTours={loadingTours}
      />
    </>
  );
}
