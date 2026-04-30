'use client'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users, Star, ArrowRight, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const tours = [
  {
    img: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=75',
    country: 'Испания',
    city: 'Барселона',
    title: 'Сокровища Каталонии',
    days: 8,
    group: '6–12',
    rating: 4.9,
    reviews: 128,
    price: 2100,
    hot: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=75',
    country: 'Франция',
    city: 'Прованс',
    title: 'Лавандовые поля Прованса',
    days: 6,
    group: '8–16',
    rating: 4.8,
    reviews: 94,
    price: 1850,
    hot: false,
  },
  {
    img: 'https://images.unsplash.com/photo-1527549993586-dff825b37782?w=600&q=75',
    country: 'Исландия',
    city: 'Рейкьявик',
    title: 'Северное сияние',
    days: 7,
    group: '4–10',
    rating: 5.0,
    reviews: 67,
    price: 3400,
    hot: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=600&q=75',
    country: 'Хорватия',
    city: 'Дубровник',
    title: 'Жемчужина Адриатики',
    days: 10,
    group: '10–18',
    rating: 4.7,
    reviews: 151,
    price: 2600,
    hot: false,
  },
  {
    img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=75',
    country: 'Норвегия',
    city: 'Фьорды',
    title: 'Мистические фьорды',
    days: 12,
    group: '6–14',
    rating: 4.9,
    reviews: 83,
    price: 3100,
    hot: false,
  },
  {
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=75',
    country: 'Кения',
    city: 'Масаи Мара',
    title: 'Великое переселение',
    days: 11,
    group: '4–8',
    rating: 5.0,
    reviews: 45,
    price: 5200,
    hot: true,
  },
]

export default function TourCards() {
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
            <Link href="/tours" className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group">
              Все туры <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, i) => (
            <motion.div
              key={tour.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden media-contrast">
                <Image
                  src={tour.img}
                  alt={tour.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />

                {tour.hot && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-(--site-accent) text-(--site-on-accent) text-xs font-bold">
                    🔥 Горящий
                  </div>
                )}

                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/10 transition-all">
                  <Heart className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-(--site-accent)">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-bold">{tour.rating}</span>
                  <span className="text-white/50 text-xs">({tour.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                  <MapPin className="w-3 h-3" />
                  {tour.city}, {tour.country}
                </div>
                <h3
                  className="text-white font-bold text-xl mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {tour.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-white/50 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {tour.days} дней
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {tour.group} чел.
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/40 text-xs">от</div>
                    <div className="text-(--site-accent) font-bold text-xl">€ {tour.price.toLocaleString()}</div>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
