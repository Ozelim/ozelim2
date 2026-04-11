'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import {
  Trophy, Users, Globe, Star, Shield, Headphones, Leaf, Award
} from 'lucide-react'

const stats = [
  { value: 15000, suffix: '+', label: 'Довольных клиентов', icon: Users },
  { value: 48, suffix: '', label: 'Стран мира', icon: Globe },
  { value: 12, suffix: '', label: 'Лет опыта', icon: Trophy },
  { value: 4.9, suffix: '/5', label: 'Средний рейтинг', icon: Star, decimal: true },
]

const reasons = [
  {
    icon: Shield,
    title: 'Надёжная защита',
    desc: 'Полное страхование каждого тура и гарантия безопасности на всех маршрутах. Ваш покой — наш приоритет.',
  },
  {
    icon: Headphones,
    title: 'Поддержка 24/7',
    desc: 'Наша команда на связи круглосуточно. Любой вопрос или непредвиденная ситуация — мы всегда рядом.',
  },
  {
    icon: Leaf,
    title: 'Экотуризм',
    desc: 'Мы заботимся о природе и используем только экологически ответственные практики в каждом туре.',
  },
  {
    icon: Award,
    title: 'Премиальное качество',
    desc: 'Отобранные отели, опытные гиды, продуманные маршруты — всё для незабываемых впечатлений.',
  },
]

function Counter({ value, suffix, decimal }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const duration = 2000
    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(decimal ? parseFloat((eased * value).toFixed(1)) : Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, value, decimal])

  return <span ref={ref}>{count}</span>
}

export default function WhyUs() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-(--site-accent)/20 bg-(--site-accent)/5 text-(--site-accent) text-xs uppercase tracking-widest mb-6">
            <Star className="w-3 h-3" /> Почему выбирают нас
          </div>
          <h2
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Опыт, которому{' '}
            <span className="text-gradient">доверяют</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            За 12 лет работы мы создали тысячи незабываемых путешествий и заработали репутацию самого надёжного туроператора страны.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative p-6 rounded-2xl border border-(--site-accent)/10 bg-[#0a2a0a]/50 text-center overflow-hidden group hover:border-(--site-accent)/30 transition-colors"
            >
              <div className="absolute inset-0 bg-linear-to-br from-(--site-accent)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <s.icon className="w-6 h-6 text-(--site-accent) mx-auto mb-3" />
              <div
                className="text-4xl font-bold text-white mb-1"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                <Counter value={s.value} suffix={s.suffix} decimal={s.decimal} />
                {s.suffix}
              </div>
              <div className="text-white/50 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-6 rounded-2xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/30 group hover:border-(--site-accent)/20 transition-all duration-300 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <r.icon className="w-5 h-5 text-(--site-accent)" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {r.title}
              </h4>
              <p className="text-white/50 text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
