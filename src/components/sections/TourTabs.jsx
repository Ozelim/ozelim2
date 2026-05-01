'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Waves, Building2, Trees } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const tabs = [
  { id: 'mountains', label: 'Горные туры', icon: Mountain },
  { id: 'sea', label: 'Морские туры', icon: Waves },
  { id: 'city', label: 'Городские', icon: Building2 },
  { id: 'eco', label: 'Экотуры', icon: Trees },
]

const diffColor = {
  'Лёгкий': 'text-(--site-accent-bright) border-(--site-accent-bright)/30 bg-(--site-accent-bright)/10',
  'Средний': 'text-(--site-accent) border-(--site-accent)/30 bg-(--site-accent)/10',
  'Сложный': 'text-red-400 border-red-400/30 bg-red-400/10',
}

export default function TourTabs({ items = [] }) {
  const [active, setActive] = useState('mountains')
  if (!items.length) return null
  const current = { items }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2
            className="text-5xl font-bold text-white mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Наши туры
          </h2>
          <p className="text-white/50">Откройте мир вместе с нами — от горных вершин до тропических пляжей</p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                active === tab.id ? 'text-(--site-on-accent)' : 'text-white/60 hover:text-white border border-white/10 hover:border-white/25'
              }`}
            >
              {active === tab.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright)"
                />
              )}
              <tab.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-3 gap-6"
          >
            {current.items.map((item, i) => (
              <motion.div
                key={item.id ?? item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-300 card-hover cursor-pointer"
              >
                <Link href={item.id ? `/tours/${item.id}` : '#'} className="block">
                <div className="relative h-48 overflow-hidden media-contrast">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/70 to-transparent" />
                  <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full border ${diffColor[item.diff]}`}>
                    {item.diff}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className="text-white font-bold text-xl mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">{item.duration}</span>
                    <span className="text-(--site-accent) font-bold">{item.price}</span>
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
