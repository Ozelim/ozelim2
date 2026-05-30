'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const HOMEPAGE_LIMIT = 5

export default function Accordion() {
  const [faqs, setFaqs] = useState([])
  const [open, setOpen] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/faq-items')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const items = (data.items ?? []).slice(0, HOMEPAGE_LIMIT)
        setFaqs(items)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (faqs.length === 0) return null

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

        <div className="space-y-3 mb-8">
          {faqs.map((item, i) => (
            <motion.div
              key={item.id ?? i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                open === i
                  ? 'border-(--site-accent)/30 bg-transparent dark:bg-[#0f3d0f]/50'
                  : 'border-[#1a6b1a]/20 bg-transparent dark:bg-[#0a2a0a]/10 hover:border-[#1a6b1a]/40'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-medium pr-4">{item.question}</span>
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
                    <div className="px-6 pb-6 text-white/60 leading-relaxed text-sm border-t border-(--site-accent)/10 pt-4 whitespace-pre-wrap">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-6"
        >
          <Link
            href="/faq"
            className="flex items-center gap-2 text-(--site-accent) text-sm hover:gap-3 transition-all group"
          >
            Все вопросы <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
