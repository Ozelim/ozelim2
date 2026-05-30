'use client'
import { motion } from 'framer-motion'
import { MapPin, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import FavoriteButton from '@/components/favorite/FavoriteButton'

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
              Курортные направления Казахстана
            </h2>
          </div>
          <Link href="/directions" className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group">
            Все направления <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {kurorts.map((kurort, i) => (
            <motion.div
              key={kurort.id ?? kurort.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover cursor-pointer"
            >
              {kurort.id && (
                <FavoriteButton kind="direction" id={kurort.id} variant="absolute" />
              )}
              <Link href={kurort.id ? `/directions/${kurort.id}` : '#'} className="block">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden media-contrast">
                  <Image
                    src={kurort.img}
                    alt={kurort.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    priority={i < 2}
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

                {/* Content */}
                <div className="p-5">
                  {(kurort.city || kurort.country) && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <MapPin className="w-3 h-3" />
                        {[kurort.city, kurort.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                  {kurort.short && (
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{kurort.short}</p>
                  )}
                  {kurort.group && (
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {kurort.group} чел.
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {kurort.price ? (
                      <div>
                        <div className="text-white/40 text-xs">от</div>
                        <div className="text-(--site-accent) font-bold text-xl">
                          {Number(kurort.price).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₸
                        </div>
                      </div>
                    ) : <div />}
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
