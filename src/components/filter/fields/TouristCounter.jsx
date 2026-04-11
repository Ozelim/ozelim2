'use client'

import { useState, useRef, useEffect } from 'react'
import { Users, ChevronDown, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Counter({ label, sub, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-app-fg">{label}</div>
        <div className="text-xs text-app-faint">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-app-border flex items-center justify-center text-app-muted hover:border-(--site-accent)/40 hover:text-(--site-accent) disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-5 text-center text-app-fg font-semibold text-sm">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-app-border flex items-center justify-center text-app-muted hover:border-(--site-accent)/40 hover:text-(--site-accent) disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export function TouristCounter({ adults, childrenCount, onAdultsChange, onChildrenChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const label = `${adults} взр.${childrenCount > 0 ? `, ${childrenCount} дет.` : ''}`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left
          ${open
            ? 'border-(--site-accent)/60 bg-app-elevated shadow-[0_0_0_3px_var(--site-ring)]'
            : 'border-app-border bg-app-card hover:border-(--site-accent)/40 hover:bg-app-elevated'
          }`}
      >
        <Users className="w-4 h-4 text-(--site-accent) shrink-0" />
        <span className="flex-1 text-app-fg">{label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-app-faint shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 top-full mt-1.5 left-0 right-0 rounded-xl border border-app-border bg-app-card shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-4 divide-y divide-app-border"
          >
            <Counter
              label="Взрослые"
              sub="от 18 лет"
              value={adults}
              min={1}
              max={10}
              onChange={onAdultsChange}
            />
            <Counter
              label="Дети"
              sub="до 17 лет"
              value={childrenCount}
              min={0}
              max={10}
              onChange={onChildrenChange}
            />
            <div className="py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full py-2 rounded-lg bg-(--site-accent)/10 border border-(--site-accent)/20 text-(--site-accent) text-sm font-medium hover:bg-(--site-accent)/20 transition-colors"
              >
                Готово
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
