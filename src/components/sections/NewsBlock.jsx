"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";

const news = [
  {
    tag: "Акции",
    date: "15 марта 2026",
    readTime: "3 мин",
    title: "Раннее бронирование лета 2026: скидки до 30% на все туры",
    excerpt:
      "Успейте забронировать летний отдых по специальным ценам. Предложение действует до 1 апреля 2026 года для туров во все направления.",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70",
    big: true,
  },
  {
    tag: "Новости",
    date: "12 марта 2026",
    readTime: "2 мин",
    title: "Открыто новое направление: Патагония 2026",
    excerpt:
      "Добавлены туры в один из самых живописных регионов Южной Америки.",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=70",
    big: false,
  },
  {
    tag: "Советы",
    date: "8 марта 2026",
    readTime: "5 мин",
    title: "Как правильно подготовиться к горному походу",
    excerpt:
      "Наши опытные гиды делятся советами по экипировке, физической подготовке и акклиматизации.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=70",
    big: false,
  },
  {
    tag: "Направления",
    date: "5 марта 2026",
    readTime: "4 мин",
    title: "ТОП-5 весенних направлений 2026 года",
    excerpt:
      "Рейтинг самых популярных маршрутов весеннего сезона по отзывам наших туристов.",
    img: "https://images.unsplash.com/photo-1527549993586-dff825b37782?w=600&q=70",
    big: false,
  },
];

const tagColor = {
  Акции: "text-(--site-accent) bg-(--site-accent)/10 border-(--site-accent)/20",
  Новости: "text-(--site-accent-bright) bg-(--site-accent-bright)/10 border-(--site-accent-bright)/20",
  Советы: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Направления: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function NewsBlock() {
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
                  className={`text-xs px-2.5 py-1 rounded-full border ${tagColor[news[0].tag]}`}
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
              key={article.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
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
                    className={`text-xs px-2 py-0.5 rounded-full border ${tagColor[article.tag]} mb-2 inline-block`}
                  >
                    {article.tag}
                  </span>
                  <h4
                    className="text-white font-semibold text-sm leading-snug line-clamp-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {article.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-xs">
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
    </section>
  );
}
