"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, X } from "lucide-react";
import Image from "next/image";

const tagColor = {
  Акции: "text-(--site-accent) bg-(--site-accent)/10 border-(--site-accent)/20",
  Новости: "text-(--site-accent-bright) bg-(--site-accent-bright)/10 border-(--site-accent-bright)/20",
  Советы: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Направления: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const defaultTagColor = "text-white/70 bg-white/5 border-white/10";

function NewsModal({ article, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-(--site-accent)/20 bg-[#0a2a0a] shadow-2xl"
      >
        <div className="relative h-64 md:h-80 overflow-hidden">
          {article.img && (
            <Image
              src={article.img}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a2a0a] via-[#0a2a0a]/40 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${tagColor[article.tag] || defaultTagColor}`}
            >
              {article.tag}
            </span>
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <Calendar className="w-3 h-3" /> {article.date}
            </span>
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <Clock className="w-3 h-3" /> {article.readTime}
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-white/60 text-base leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}
          {article.content ? (
            <div
              className="news-content text-white/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-white/40 text-sm italic">Контент недоступен.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NewsBlock({ items = [] }) {
  const [active, setActive] = useState(null);
  const news = items;
  if (!news.length) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Блог
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Новости и советы
            </h2>
          </div>
          <button className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group">
            Все статьи{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Big card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setActive(news[0])}
            className="md:col-span-1 md:row-span-2 group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-300 card-hover cursor-pointer flex flex-col"
          >
            <div className="relative h-56 overflow-hidden shrink-0 media-contrast">
              <Image
                src={news[0].img}
                alt=""
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${tagColor[news[0].tag] || defaultTagColor}`}
                >
                  {news[0].tag}
                </span>
              </div>
              <h3
                className="text-white font-bold text-2xl mb-3 flex-1"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {news[0].title}
              </h3>
              <p className="text-white/50 text-sm mb-5 leading-relaxed">
                {news[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {news[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {news[0].readTime}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Small cards */}
          {news.slice(1).map((article, i) => (
            <motion.div
              id={`news-${article.id}-${i}`}
              key={`news-${article.id}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
              onClick={() => setActive(article)}
              className="group flex gap-4 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-300 p-4 cursor-pointer overflow-hidden"
            >
              <div className="relative w-48 h-50 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={article.img}
                  alt=""
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="96px"
                  priority={i === 0}
                />
              </div>
              <div className="flex flex-col justify-between min-w-0">
                <div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${tagColor[article.tag] || defaultTagColor} mb-2 inline-block`}
                  >
                    {article.tag}
                  </span>
                  <h4
                    className="text-white font-semibold text-sm leading-snug mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {article.title}
                  </h4>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-xs whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <NewsModal article={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
