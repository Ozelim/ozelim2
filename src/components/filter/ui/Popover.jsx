'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Popover({
  trigger,
  children,
  className = '',
  align = 'left',
  open: controlledOpen,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const ref = useRef(null)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setOpen])

  const alignClass =
    align === 'right'
      ? 'right-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0'

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 top-full mt-1.5 rounded-xl border border-[#1a6b1a]/30 bg-[#0a1a0a] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden ${alignClass} ${className}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
