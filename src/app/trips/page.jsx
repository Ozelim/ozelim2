"use client";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import Accordion from "@/components/sections/Accordion";
import TourFilter from "@/components/filter/TourFilter";
import KazakhstanMap, { RESORTS } from "./KazakhstanMap";

export default function TripsPage() {
  return (
    <main>
      <Hero
        title="Открой"
        highlight="Казахстан"
        subtitle="Подберите поездку в нашем калькуляторе"
      />
      <MarqueeTicker />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-10 md:h-auto">
        <TourFilter />
      </div>

      {/* Kurorts heading + count */}
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6 flex flex-col items-center gap-4">
        <h2
          className="text-xl md:text-2xl font-medium text-white tracking-wide"
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
        >
          Курорты Казахстана
        </h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/40 shadow-[0_0_20px_rgba(251,191,36,0.18)]">
          <span className="text-2xl font-bold text-(--site-accent) leading-none">
            {RESORTS.length}
          </span>
          <span className="text-xs uppercase tracking-widest text-white/70">
            мест
          </span>
        </div>
      </div>

      <KazakhstanMap />

      <Accordion />
      <MarqueeTicker />
      <Footer />
    </main>
  );
}
