'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80',
    title: 'Горные вершины Алтая',
    desc: 'Захватывающие дух пейзажи и незабываемые восхождения для настоящих искателей приключений.',
  },
  {
    img: 'https://images.unsplash.com/photo-1502780809386-00b7a7fc7f0e?w=900&q=80',
    title: 'Бирюзовые озёра',
    desc: 'Кристально чистые воды горных озёр отражают небо, создавая картину идеального покоя.',
  },
  {
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
    title: 'Лесные тропы',
    desc: 'Пройдите через вековые леса и откройте для себя скрытые от посторонних глаз уголки природы.',
  },
  {
    img: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=900&q=80',
    title: 'Степные просторы',
    desc: 'Бескрайние казахстанские степи хранят тысячелетнюю историю кочевых народов.',
  },
]

export default function Carousel1() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  const go = (next) => {
    setDir(next > current ? 1 : -1)
    setCurrent((next + slides.length) % slides.length)
  }

  useEffect(() => {
    const t = setInterval(() => go(current + 1), 5000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  return (
    <div className="relative rounded-3xl overflow-hidden h-[500px] group media-contrast">
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={current}
          custom={dir}
          variants={{
            enter: (d) => ({ x: d * 100 + '%', opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d) => ({ x: d * -100 + '%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].img}
            alt={slides[current].title}
            fill
            className="w-full h-full object-cover"
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#030f03] via-[#030f03]/30 to-transparent" />
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-10 left-10 right-20"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
            <h3
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {slides[current].title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {slides[current].desc}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={() => go(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-(--site-accent) hover:text-(--site-on-accent) hover:border-(--site-accent) transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-(--site-accent) hover:text-(--site-on-accent) hover:border-(--site-accent) transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-(--site-accent)' : 'w-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
