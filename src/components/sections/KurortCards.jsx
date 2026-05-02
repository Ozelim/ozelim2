'use client'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, ArrowRight, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function KurortCards({ items = [] }) {
  const kurorts = items;
  if (!kurorts.length) return null;

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
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">Курорты</div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Популярные курортные зоны
            </h2>
          </div>
          <button className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group">
            <Link href="/trips" className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group">
              Все курорты <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kurorts.map((kurort, i) => (
            <motion.div
              key={kurort.id ?? kurort.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover cursor-pointer"
            >
              <Link href={kurort.id ? `/resort/${kurort.id}` : '#'} className="block">
              {/* Image */}
              <div className="relative h-52 overflow-hidden media-contrast">
                <Image
                  src={kurort.img}
                  alt={kurort.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />

                {kurort.hot && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-(--site-accent) text-(--site-on-accent) text-xs font-bold">
                    🔥 Горящий
                  </div>
                )}

                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/10 transition-all">
                  <Heart className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <h3
                    className="text-white font-bold text-xl drop-shadow-lg"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {kurort.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">
                    <MapPin className="w-3 h-3" />
                    {kurort.city}, {kurort.country}
                  </div>
                  <div className="flex items-center gap-1 text-(--site-accent)">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-sm font-bold">{kurort.rating}</span>
                    <span className="text-white/50 text-xs">({kurort.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/50 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {kurort.group} чел.
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/40 text-xs">цена за ночь от</div>
                    <div className="text-(--site-accent) font-bold text-xl">{kurort.price.toLocaleString()} ₸</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-linear-to-r from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/30 text-(--site-accent) text-sm font-medium hover:from-(--site-accent) hover:to-(--site-accent-bright) hover:text-(--site-on-accent) transition-all duration-300"
                  >
                    Подробнее
                  </motion.button>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
