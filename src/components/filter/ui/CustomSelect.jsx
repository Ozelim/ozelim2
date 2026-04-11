'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  icon,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left
          ${open
            ? 'border-(--site-accent)/60 bg-app-elevated shadow-[0_0_0_3px_var(--site-ring)]'
            : 'border-app-border bg-app-card hover:border-(--site-accent)/40 hover:bg-app-elevated'
          }`}
      >
        {icon && <span className="text-(--site-accent) shrink-0">{icon}</span>}
        <span className={`flex-1 truncate ${selected?.value ? 'text-app-fg' : 'text-app-faint'}`}>
          {selected?.label || placeholder}
        </span>
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
            className="absolute z-50 top-full mt-1.5 left-0 right-0 rounded-xl border border-app-border bg-app-card shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
              {options.map((opt) => {
                const active = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors duration-150 text-left
                      ${active ? 'bg-(--site-accent)/10 text-(--site-accent)' : 'text-app-muted hover:bg-app-elevated hover:text-app-fg'}`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
