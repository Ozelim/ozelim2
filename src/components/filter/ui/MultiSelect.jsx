'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  icon,
  className = '',
  maxShow = 2,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(v) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }

  function clear(e) {
    e.stopPropagation()
    onChange([])
  }

  const selectedLabels = options.filter((o) => value.includes(o.value)).map((o) => o.label)

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

        <span className="flex-1 min-w-0">
          {value.length === 0 ? (
            <span className="text-app-faint">{placeholder}</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {selectedLabels.slice(0, maxShow).map((l) => (
                <span key={l} className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-(--site-accent)/15 border border-(--site-accent)/20 text-(--site-accent) text-[10px] leading-none">
                  {l}
                </span>
              ))}
              {value.length > maxShow && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#1a6b1a]/30 text-white/60 text-[10px] leading-none">
                  +{value.length - maxShow}
                </span>
              )}
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0">
          {value.length > 0 && (
            <span
              onClick={clear}
              className="w-4 h-4 rounded-full bg-app-elevated flex items-center justify-center hover:bg-app-surface-deep transition-colors"
            >
              <X className="w-2.5 h-2.5 text-app-muted" />
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-app-faint"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </span>
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
            {value.length > 0 && (
              <div className="px-3.5 py-2 border-b border-app-border flex items-center justify-between">
                <span className="text-xs text-app-faint">Выбрано: {value.length}</span>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-xs text-(--site-accent)/60 hover:text-(--site-accent) transition-colors"
                >
                  Сбросить
                </button>
              </div>
            )}
            <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
              {options.map((opt) => {
                const checked = value.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 text-sm transition-colors duration-150 text-left
                      ${checked ? 'bg-(--site-accent)/8 text-app-fg' : 'text-app-muted hover:bg-app-elevated hover:text-app-fg'}`}
                  >
                    {/* Custom checkbox */}
                    <span className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-all duration-150
                      ${checked
                        ? 'bg-(--site-accent) border-(--site-accent)'
                        : 'border-app-border bg-transparent'
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5 text-(--site-on-accent)" strokeWidth={3} />}
                    </span>
                    <span className="truncate">{opt.label}</span>
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
