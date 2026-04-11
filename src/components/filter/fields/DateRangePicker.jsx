'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Monday-based weekday offset
function getMonOffset(d) {
  return (d.getDay() + 6) % 7
}

function formatDate(d) {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
}

export function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => new Date())
  const [hovered, setHovered] = useState(null)
  const [picking, setPicking] = useState('from')
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  function handleDayClick(day) {
    if (picking === 'from') {
      onChange(day, null)
      setPicking('to')
    } else {
      if (from && day < from) {
        onChange(day, from)
      } else {
        onChange(from, day)
      }
      setPicking('from')
      setOpen(false)
    }
  }

  function isInRange(day) {
    const end = to || hovered
    if (from && end) {
      const a = from <= end ? from : end
      const b = from <= end ? end : from
      return day > a && day < b
    }
    return false
  }

  function isStart(day) { return !!from && isSameDay(day, from) }
  function isEnd(day) { return !!to && isSameDay(day, to) }
  function isPast(day) { return day < new Date(new Date().setHours(0,0,0,0)) }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysCount = getDaysInMonth(year, month)
  const offset = getMonOffset(startOfMonth(viewDate))
  const totalCells = Math.ceil((daysCount + offset) / 7) * 7

  const displayText = from && to
    ? `${formatDate(from)} — ${formatDate(to)}`
    : from
    ? `${formatDate(from)} — ...`
    : 'Выберите даты'

  function clearDates(e) {
    e.stopPropagation()
    onChange(null, null)
    setPicking('from')
  }

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
        <Calendar className="w-4 h-4 text-(--site-accent) shrink-0" />
        <span className={`flex-1 truncate ${(from || to) ? 'text-app-fg' : 'text-app-faint'}`}>
          {displayText}
        </span>
        {(from || to) && (
          <span onClick={clearDates} className="w-4 h-4 rounded-full bg-app-elevated flex items-center justify-center hover:bg-app-surface-deep transition-colors shrink-0">
            <X className="w-2.5 h-2.5 text-app-muted" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 top-full mt-1.5 left-0 rounded-xl border border-app-border bg-app-card shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 w-72"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-app-muted hover:bg-app-elevated hover:text-app-fg transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-app-fg">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-app-muted hover:bg-app-elevated hover:text-app-fg transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-app-faint py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - offset + 1
                if (dayNum < 1 || dayNum > daysCount) {
                  return <div key={i} />
                }
                const day = new Date(year, month, dayNum)
                const start = isStart(day)
                const end = isEnd(day)
                const inRange = isInRange(day)
                const past = isPast(day)

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={past}
                    onClick={() => !past && handleDayClick(day)}
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative h-8 text-xs font-medium transition-all duration-100 rounded-lg
                      ${past ? 'text-app-faint cursor-not-allowed' : 'cursor-pointer'}
                      ${(start || end) ? 'bg-(--site-accent) text-(--site-on-accent) rounded-lg z-10' : ''}
                      ${inRange && !start && !end ? 'bg-(--site-accent)/12 text-app-fg rounded-none' : ''}
                      ${!past && !start && !end && !inRange ? 'text-app-muted hover:bg-app-elevated hover:text-app-fg' : ''}
                    `}
                  >
                    {dayNum}
                  </button>
                )
              })}
            </div>

            {/* Hint */}
            <div className="mt-3 pt-3 border-t border-app-border text-center text-[10px] text-app-faint">
              {picking === 'from' ? 'Выберите дату заезда' : 'Выберите дату выезда'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
