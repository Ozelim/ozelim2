'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const diffColor = {
  'Лёгкий': 'text-(--site-accent-bright) border-(--site-accent-bright)/30 bg-(--site-accent-bright)/10',
  'Средний': 'text-(--site-accent) border-(--site-accent)/30 bg-(--site-accent)/10',
  'Сложный': 'text-red-400 border-red-400/30 bg-red-400/10',
}

const CARD_WIDTH = 408
const GAP = 24
const STEP = CARD_WIDTH + GAP

function TourCard({ tour, i }) {
  return (
    <Link
      href={tour.id ? `/tours/${tour.id}` : '#'}
      className="w-[88vw] md:w-[408px] group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 shrink-0 block"
    >
      <div className="relative h-52 overflow-hidden media-contrast">
        <Image
          src={tour.img}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="408px"
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
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateBounds = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateBounds()
    el.addEventListener('scroll', updateBounds, { passive: true })
    window.addEventListener('resize', updateBounds)
    return () => {
      el.removeEventListener('scroll', updateBounds)
      window.removeEventListener('resize', updateBounds)
    }
  }, [items.length])

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * STEP, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">Туры</div>
            <h2
              className="text-5xl font-bold text-white mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Наши туры
            </h2>
            <p className="text-white/50">Откройте мир вместе с нами — от горных вершин до тропических пляжей</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Предыдущие туры"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-(--site-accent) hover:border-(--site-accent) transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/20"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Следующие туры"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-(--site-accent) hover:border-(--site-accent) transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/20"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto overflow-hidden px-6">
      <div
        ref={trackRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        style={{ gap: GAP }}
      >
        {items.map((tour, i) => (
          <div key={tour.id ?? `${tour.title}-${i}`} className="snap-start">
            <TourCard tour={tour} i={i} />
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
