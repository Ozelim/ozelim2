import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import Accordion from "@/components/sections/Accordion";
import KazakhstanMapClient from "./KazakhstanMapClient";

export default function TripsPage() {
  return (
    <main>
      <Hero
        title="Открой"
        highlight="Казахстан"
        subtitle="Подберите поездку в нашем калькуляторе"
      />
      <MarqueeTicker />

      <KazakhstanMapClient />

      <Accordion />
      <MarqueeTicker />
      <Footer />
    </main>
  );
}
