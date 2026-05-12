'use client'
import { motion } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ResortsGrid({ items = [] }) {
  if (!items.length) return (
    <div className="py-20 text-center text-white/40">Курорты не найдены</div>
  )

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((kurort, i) => (
            <motion.div
              key={kurort.id ?? kurort.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.08 }}
              className="group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover cursor-pointer"
            >
              <Link href={kurort.id ? `/resort/${kurort.id}` : '#'} className="block">
                <div className="relative h-52 overflow-hidden media-contrast">
                  <Image
                    src={kurort.img}
                    alt={kurort.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={i < 3}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <h3
                      className="text-white font-bold text-xl drop-shadow-lg"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {kurort.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <MapPin className="w-3 h-3" />
                      {kurort.city}, {kurort.country}
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
                      <div className="text-white/40 text-xs">от</div>
                      <div className="text-(--site-accent) font-bold text-xl">
                        {kurort.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₸
                      </div>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
