export const dynamic = 'force-dynamic';

import Hero from "@/components/sections/Hero";
import KurortCards from "@/components/sections/KurortCards";
import TourTabs from "@/components/sections/TourTabs";
import HomePackages from "@/components/sections/HomePackages";
import WhyUs from "@/components/sections/WhyUs";
import { getCurrentUser } from "@/lib/auth";
import Carousel1 from "@/components/sections/Carousel1";
import Carousel2 from "@/components/sections/Carousel2";
import NewsBlock from "@/components/sections/NewsBlock";
import Accordion from "@/components/sections/Accordion";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import { getLatestNews } from "@/lib/news";
import { listPublishedDirections } from "@/lib/resort-directions";
import { getLatestTours } from "@/lib/tours";
import { getMainPageStats } from "@/lib/stats";
import { getHomeGallery } from "@/lib/home-gallery";
import { getPackagePrices } from "@/lib/package-prices";

export default async function HomePage() {
  const [news, directions, tours, pageStats, homeGallery, currentUser, packagePrices] = await Promise.all([
    getLatestNews(5),
    listPublishedDirections(12),
    getLatestTours(9, { random: true }),
    getMainPageStats(),
    getHomeGallery(),
    getCurrentUser(),
    getPackagePrices(),
  ]);

  return (
    <main>
      <Hero
        title="Открой"
        highlight="Казахстан"
        subtitle="Подберите тур в нашем калькуляторе туров"
      />

      <MarqueeTicker />
      <NewsBlock items={news} />
      <KurortCards items={directions} />
      <TourTabs items={tours} />

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
            <Carousel1 items={homeGallery.carousel1} />
            <Carousel2 items={homeGallery.carousel2} />
          </div>
        </div>
      </section>

      <WhyUs stats={pageStats} />

      <Accordion />

      <HomePackages isAuthed={!!currentUser} prices={packagePrices} />

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
