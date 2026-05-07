'use client'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const diffColor = {
  'Лёгкий': 'text-(--site-accent-bright) border-(--site-accent-bright)/30 bg-(--site-accent-bright)/10',
  'Средний': 'text-(--site-accent) border-(--site-accent)/30 bg-(--site-accent)/10',
  'Сложный': 'text-red-400 border-red-400/30 bg-red-400/10',
}

function TourCard({ tour, i }) {
  return (
    <Link
      href={tour.id ? `/tours/${tour.id}` : '#'}
      className="group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 block"
    >
      <div className="relative h-52 overflow-hidden media-contrast">
        <Image
          src={tour.img}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={i < 3}
          draggable={false}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        {tour.diff && (
          <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full border ${diffColor[tour.diff] || ''}`}>
            {tour.diff}
          </span>
        )}
      </div>
      <div className="p-5 tour-card-body">
        {(tour.city || tour.country) && (
          <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
            <MapPin className="w-3 h-3" />
            {[tour.city, tour.country].filter(Boolean).join(', ')}
          </div>
        )}
        <h3
          className="text-white font-bold text-xl mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {tour.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-white/50 mb-5">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {tour.duration}
          </span>
          {tour.group && tour.group !== '—' && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {tour.group} чел.
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/40 text-xs">от</div>
            <div className="text-(--site-accent) font-bold text-xl">{tour.price}</div>
          </div>
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-linear-to-r from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/30 text-(--site-accent) text-sm font-medium hover:from-(--site-accent) hover:to-(--site-accent-bright) hover:text-(--site-on-accent) transition-all duration-300"
          >
            Подробнее
          </motion.span>
        </div>
      </div>
    </Link>
  )
}

export default function TourTabs({ items = [] }) {
  if (!items.length) return null

  const grid = items.slice(0, 9)

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">Туры</div>
          <h2
            className="text-5xl font-bold text-white mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Наши туры
          </h2>
          <p className="text-white/50">Откройте мир вместе с нами — от горных вершин до тропических пляжей</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grid.map((tour, i) => (
            <motion.div
              key={tour.id ?? `${tour.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.07 + Math.floor(i / 3) * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <TourCard tour={tour} i={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
