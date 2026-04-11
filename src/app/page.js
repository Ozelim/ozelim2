import Hero from "@/components/sections/Hero";
import TourCards from "@/components/sections/TourCards";
import TourTabs from "@/components/sections/TourTabs";
import WhyUs from "@/components/sections/WhyUs";
import Carousel1 from "@/components/sections/Carousel1";
import Carousel2 from "@/components/sections/Carousel2";
import Carousel3 from "@/components/sections/Carousel3";
import NewsBlock from "@/components/sections/NewsBlock";
import Accordion from "@/components/sections/Accordion";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero
        title="Открой Казахстан"
        subtitle="Подберите тур в нашем калькуляторе туров"
      />

      <MarqueeTicker />
      <NewsBlock />
      <TourCards />
      <WhyUs />
      <TourTabs />

      {/* Carousels section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[#FFD700] text-xs uppercase tracking-widest mb-2">
              Галерея
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Вдохновись путешествием
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Carousel1 />
            <Carousel2 />
          </div>
          <Carousel3 />
        </div>
      </section>

      <Accordion />
      <MarqueeTicker />
      <Footer />
    </main>
  );
}
