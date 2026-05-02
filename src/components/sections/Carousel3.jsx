"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight } from "lucide-react";
import Image from "next/image";

const cards = [
  {
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80",
    country: "Швейцария",
    price: "1 600 000 ₸",
    days: "10 дней",
    color: "#1a6b1a",
  },
  {
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80",
    country: "Норвегия",
    price: "1 900 000 ₸",
    days: "12 дней",
    color: "#145214",
  },
  {
    img: "https://images.unsplash.com/photo-1527549993586-dff825b37782?w=500&q=80",
    country: "Исландия",
    price: "2 250 000 ₸",
    days: "8 дней",
    color: "#0f3d0f",
  },
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    country: "Австрия",
    price: "1 150 000 ₸",
    days: "7 дней",
    color: "#0a2a0a",
  },
];

export default function Carousel3() {
  const [active, setActive] = useState(0);

  const rotate = () => setActive((a) => (a + 1) % cards.length);

  return (
    <div className="relative overflow-x-clip">
      <div
        className="relative h-[360px] flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {cards.map((card, i) => {
          const offset = (i - active + cards.length) % cards.length;
          const isActive = offset === 0;
          const isNext = offset === 1;
          const isPrev = offset === cards.length - 1;
          const isHidden = offset > 1 && offset < cards.length - 1;

          const xPos =
            offset === 0
              ? 0
              : offset === 1
                ? "65%"
                : offset === cards.length - 1
                  ? "-65%"
                  : "0";
          const scale = isActive ? 1 : isNext || isPrev ? 0.8 : 0.6;
          const rotateY = isNext ? "-25deg" : isPrev ? "25deg" : "0deg";
          const zIndex = isActive ? 30 : isNext || isPrev ? 20 : 10;
          const opacity = isHidden ? 0 : isActive ? 1 : 0.6;

          return (
            <motion.div
              key={card.country}
              className="absolute w-52 h-72 rounded-2xl overflow-hidden cursor-pointer shadow-2xl media-contrast"
              animate={{
                x: xPos,
                scale,
                rotateY,
                zIndex,
                opacity,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => !isActive && setActive(i)}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={card.img}
                alt={card.country}
                fill
                className="w-full h-full object-cover"
                sizes="224px"
                priority={isActive}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#030f03] to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-0.5">
                  {card.days}
                </div>
                <div
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {card.country}
                </div>
                <div className="text-(--site-accent-bright) font-bold mt-1">
                  {card.price}
                </div>
              </div>
              {isActive && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 rounded-full bg-(--site-accent) animate-pulse" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          onClick={rotate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-(--site-accent)/30 text-(--site-accent) text-sm hover:bg-(--site-accent)/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Следующий тур
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
}
