"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const items = [
  {
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=200&q=60",
    label: "Азия",
    title: "Таинственный Вьетнам",
    tag: "ТОП НАПРАВЛЕНИЕ",
  },
  {
    img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=200&q=60",
    label: "Европа",
    title: "Сантьяго де Компостела",
    tag: "ПАЛОМНИЧЕСТВО",
  },
  {
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=200&q=60",
    label: "Африка",
    title: "Сафари в Кении",
    tag: "ЭКЗОТИКА",
  },
  {
    img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200&q=60",
    label: "Природа",
    title: "Ниагарский водопад",
    tag: "ЧУДО ПРИРОДЫ",
  },
];

export default function Carousel2() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % items.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden">
      {/* Main image with crossfade */}
      <div className="relative h-[440px] media-contrast">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{
              opacity: i === current ? 1 : 0,
              scale: i === current ? 1 : 1.04,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="w-full h-full object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/90 via-[#030f03]/20 to-transparent" />
          </motion.div>
        ))}

        {/* Text overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-8 left-8 right-8"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/30 text-(--site-accent) text-[10px] tracking-widest uppercase mb-3">
              {items[current].tag}
            </span>
            <div className="text-white/50 text-sm mb-1">
              {items[current].label}
            </div>
            <h3
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {items[current].title}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-0.5 bg-[#0a2a0a]">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative flex-1 h-16 overflow-hidden group"
          >
            <Image
              src={item.thumb}
              alt=""
              fill
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 900px) 100vw, 900px"
              priority={i === 0}
            />
            <div
              className={`absolute inset-0 transition-all duration-300 ${i === current ? "bg-(--site-accent)/30" : "bg-[#030f03]/60 group-hover:bg-[#030f03]/30"}`}
            />
            {i === current && (
              <motion.div
                layoutId="thumb-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--site-accent)"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
