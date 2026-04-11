'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Как забронировать тур на сайте?',
    a: 'Процесс бронирования прост: выберите интересующий маршрут, укажите даты и количество туристов, заполните контактную форму. Наш менеджер свяжется с вами в течение 2 часов для подтверждения и уточнения деталей поездки.',
  },
  {
    q: 'Включено ли страхование в стоимость тура?',
    a: 'Да, все наши туры включают базовое медицинское страхование. По желанию можно оформить расширенное страхование, включающее страхование багажа, задержку рейсов и другие риски — это добавит спокойствия в путешествии.',
  },
  {
    q: 'Можно ли отменить или перенести тур?',
    a: 'Бронирование можно отменить за 30 и более дней до начала тура с полным возвратом средств. При отмене за 15–29 дней удерживается 25% стоимости. За 7–14 дней — 50%. За менее чем 7 дней — 100%.',
  },
  {
    q: 'Предоставляете ли вы визовую поддержку?',
    a: 'Разумеется! Мы предлагаем полный комплекс визовых услуг: консультации, помощь в сборе документов, подача заявлений. Для граждан Казахстана мы имеем наработанную практику получения виз в десятки стран.',
  },
  {
    q: 'Есть ли туры для детей и семей?',
    a: 'Конечно! У нас богатая программа семейных туров, специально разработанных с учётом интересов и потребностей детей разного возраста. Детские скидки до 30% от стоимости взрослого тура.',
  },
]

export default function Accordion() {
  const [open, setOpen] = useState(0)

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">FAQ</div>
          <h2
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Часто задаваемые вопросы
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                open === i
                  ? 'border-(--site-accent)/30 bg-[#0f3d0f]/50'
                  : 'border-[#1a6b1a]/20 bg-[#0a2a0a]/10 hover:border-[#1a6b1a]/40'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-medium pr-4">{item.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                    open === i
                      ? 'border-(--site-accent) bg-(--site-accent) text-(--site-on-accent)'
                      : 'border-[#1a6b1a]/40 text-white/50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 text-white/60 leading-relaxed text-sm border-t border-(--site-accent)/10 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
