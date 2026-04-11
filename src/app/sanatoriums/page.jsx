"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import Carousel2 from "@/components/sections/Carousel2";
import WhyUs from "@/components/sections/WhyUs";
import {
  Star,
  MapPin,
  Wifi,
  Utensils,
  Waves,
  Dumbbell,
  Heart,
  Leaf,
  Thermometer,
  Wind,
  Sun,
  Moon,
  Check,
  ArrowRight,
  Phone,
  Bath,
  Activity,
  Shield,
  Clock,
} from "lucide-react";
import Image from "next/image";

const sanatoriums = [
  {
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&q=75",
    name: "Лесная Здравница",
    location: "Боровое, Казахстан",
    rating: 4.9,
    reviews: 312,
    price: 8500,
    currency: "₸/сутки",
    speciality: "Нервная система",
    amenities: ["СПА", "Бассейн", "Фитнес", "Диетпитание"],
    tag: "Лучший выбор",
    tagColor: "bg-(--site-accent) text-(--site-on-accent)",
    desc: "Оздоровительный комплекс в сосновом бору с полным спектром физиотерапевтических процедур и современным медицинским оборудованием.",
  },
  {
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=75",
    name: "Горный Кристалл",
    location: "Алматы, Казахстан",
    rating: 4.8,
    reviews: 218,
    price: 12000,
    currency: "₸/сутки",
    speciality: "Опорно-двигательный",
    amenities: [
      "Термальные ванны",
      "Гидромассаж",
      "Галокамера",
      "Кедровая бочка",
    ],
    tag: "Горный воздух",
    tagColor: "bg-(--site-accent-bright) text-(--site-on-accent)",
    desc: "Высокогорный санаторий на высоте 1 800 м над уровнем моря. Чистейший воздух и природные минеральные источники.",
  },
  {
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=75",
    name: "Степная Жемчужина",
    location: "Актау, Казахстан",
    rating: 4.7,
    reviews: 164,
    price: 9800,
    currency: "₸/сутки",
    speciality: "Кардиология",
    amenities: ["Морские процедуры", "Талассотерапия", "Йога", "Диетология"],
    tag: "Море рядом",
    tagColor: "bg-blue-400 text-white",
    desc: "Единственный прибрежный санаторий Казахстана на берегу Каспийского моря с уникальными талассотерапевтическими программами.",
  },
  {
    img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=700&q=75",
    name: "Байкал Резорт",
    location: "Иркутск, Россия",
    rating: 4.9,
    reviews: 189,
    price: 15000,
    currency: "₸/сутки",
    speciality: "Общеукрепляющий",
    amenities: ["Озёрные ванны", "Баня", "Экскурсии", "Фитопроцедуры"],
    tag: "Премиум",
    tagColor: "bg-purple-500 text-white",
    desc: "Элитный оздоровительный курорт на берегу Байкала. Уникальные программы с байкальской водой и сибирскими травами.",
  },
];

const procedures = [
  {
    icon: Bath,
    title: "Бальнеотерапия",
    desc: "Лечебные ванны с минеральными водами, грязями и растительными экстрактами для восстановления организма.",
  },
  {
    icon: Wind,
    title: "Галотерапия",
    desc: "Соляные пещеры и галокамеры для лечения органов дыхания и укрепления иммунитета.",
  },
  {
    icon: Activity,
    title: "Физиотерапия",
    desc: "Современное оборудование: магнит, лазер, УЗ-терапия, электрофорез и многое другое.",
  },
  {
    icon: Leaf,
    title: "Фитотерапия",
    desc: "Авторские сборы целебных трав, фиточаи и ароматерапия по традиционным рецептам.",
  },
  {
    icon: Heart,
    title: "Кардиопрограммы",
    desc: "Специализированные программы для профилактики и реабилитации сердечно-сосудистых заболеваний.",
  },
  {
    icon: Sun,
    title: "Климатотерапия",
    desc: "Использование целебного климата горной зоны, степи и приморского воздуха для оздоровления.",
  },
];

const programs = [
  {
    name: "Антистресс",
    days: 7,
    price: "59 500 ₸",
    includes: ["Диагностика", "Психотерапия", "Массаж", "СПА"],
  },
  {
    name: "Детокс",
    days: 10,
    price: "87 000 ₸",
    includes: [
      "Разгрузочная диета",
      "Лимфодренаж",
      "Обёртывания",
      "Фитотерапия",
    ],
  },
  {
    name: "Кардио",
    days: 14,
    price: "126 000 ₸",
    includes: ["ЭКГ мониторинг", "ЛФК", "Бальнеотерапия", "Диетология"],
  },
  {
    name: "Омоложение",
    days: 7,
    price: "74 000 ₸",
    includes: ["Плазмолифтинг", "Мезотерапия", "Пилинг", "Массаж лица"],
  },
];

const amenityIcons = {
  СПА: Waves,
  Бассейн: Waves,
  Фитнес: Dumbbell,
  Диетпитание: Utensils,
  "Термальные ванны": Thermometer,
  Гидромассаж: Waves,
  Галокамера: Wind,
  "Кедровая бочка": Leaf,
  "Морские процедуры": Waves,
  Талассотерапия: Wind,
  Йога: Activity,
  Диетология: Utensils,
  "Озёрные ванны": Waves,
  Баня: Thermometer,
  Экскурсии: MapPin,
  Фитопроцедуры: Leaf,
};

export default function SanatoriumsPage() {
  const [activeProgram, setActiveProgram] = useState(0);

  return (
    <main>
      <Hero
        title="Санатории"
        highlight="и курорты"
        subtitle="Восстановите здоровье, обретите силы и вернитесь к жизни полной грудью. Лучшие здравницы Казахстана и ближнего зарубежья."
        badge="Здоровье и долголетие"
      />
      <MarqueeTicker />

      {/* Sanatorium cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Здравницы
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Лучшие санатории
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {sanatoriums.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col sm:flex-row rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/20 transition-all duration-500 card-hover cursor-pointer"
              >
                <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden media-contrast">
                  <Image
                    src={s.img}
                    alt={s.name}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 192px"
                    style={{objectFit: "cover"}}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#030f03]/20" />
                  <span
                    className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${s.tagColor}`}
                  >
                    {s.tag}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                      <MapPin className="w-3 h-3" /> {s.location}
                    </div>
                    <h3
                      className="text-white font-bold text-xl mb-1"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {s.name}
                    </h3>
                    <div className="flex items-center gap-1 text-(--site-accent) mb-3">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-sm">{s.rating}</span>
                      <span className="text-white/40 text-xs">
                        ({s.reviews} отзывов)
                      </span>
                    </div>
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">
                      {s.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {s.amenities.map((a) => (
                        <span
                          key={a}
                          className="text-xs px-2 py-1 rounded-full bg-[#1a6b1a]/20 border border-[#1a6b1a]/30 text-[#86c986]"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/40 text-xs">от</div>
                      <div className="text-(--site-accent) font-bold">
                        {s.price.toLocaleString()} {s.currency}
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-full border border-(--site-accent)/30 text-(--site-accent) text-sm hover:bg-(--site-accent)/10 transition-colors flex items-center gap-1.5">
                      Подробнее <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Procedures */}
      <section className="py-20 px-6 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Методики
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Лечебные процедуры
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procedures.map((proc, i) => (
              <motion.div
                key={proc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 group hover:border-(--site-accent)/20 transition-all card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--site-accent)/20 to-(--site-accent-bright)/5 border border-(--site-accent)/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <proc.icon className="w-5 h-5 text-(--site-accent)" />
                </div>
                <h4
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {proc.title}
                </h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {proc.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs tabs */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Программы
            </div>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Оздоровительные программы
            </h2>
          </motion.div>

          {/* Program tabs */}
          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {programs.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActiveProgram(i)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeProgram === i
                    ? "text-(--site-on-accent)"
                    : "text-white/60 border border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {activeProgram === i && (
                  <motion.div
                    layoutId="prog-pill"
                    className="absolute inset-0 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright)"
                  />
                )}
                <span className="relative z-10">{p.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 p-8"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <h3
                    className="text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Программа «{programs[activeProgram].name}»
                  </h3>
                  <div className="flex items-center gap-3 text-white/50 text-sm mb-6">
                    <Clock className="w-4 h-4 text-(--site-accent)" />
                    {programs[activeProgram].days} дней /{" "}
                    {programs[activeProgram].days - 1} ночей
                  </div>
                  <div className="space-y-3">
                    {programs[activeProgram].includes.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-white/70"
                      >
                        <div className="w-5 h-5 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-(--site-accent)" />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-center">
                  <div className="text-white/40 text-sm mb-1">Стоимость</div>
                  <div
                    className="text-4xl font-bold text-(--site-accent) mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {programs[activeProgram].price}
                  </div>
                  <button className="px-6 py-3 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm hover:shadow-[0_0_30px_var(--site-shadow-strong)] transition-all flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Записаться
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery carousel */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-white mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Атмосфера здравниц
          </h2>
          <Carousel2 />
        </div>
      </section>

      <WhyUs />
      <MarqueeTicker />
      <Footer />
    </main>
  );
}
