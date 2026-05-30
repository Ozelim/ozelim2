'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Tag, Star,
  SlidersHorizontal, Search, RotateCcw, X, Filter,
  Clock, Wallet, Sparkles,
} from 'lucide-react'

import {
  DEFAULT_FILTER,
  HOTEL_CLASSES,
} from './FilterState'

import { CustomSelect } from './ui/CustomSelect'
import { MultiSelect } from './ui/MultiSelect'
import { FilterLabel } from './ui/FilterLabel'
import { DateRangePicker } from './fields/DateRangePicker'
import { DurationRange } from './fields/DurationRange'
import { PriceRange } from './fields/PriceRange'

// ─── Toggle chip (boolean filter) ─────────────────────────────────────────────
function ToggleChip({ active, onToggle, icon, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
        active
          ? 'border-(--site-accent) bg-(--site-accent)/15 text-(--site-accent) shadow-[0_0_18px_var(--site-shadow-soft)]'
          : 'border-white/15 bg-white/0 text-white/70 hover:border-white/30 hover:text-white'
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <span
        className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${
          active ? 'border-(--site-accent) bg-(--site-accent)' : 'border-white/30'
        }`}
      >
        {active && (
          <svg className="w-2 h-2 text-(--site-on-accent)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  )
}

// ─── Active filter count badge ────────────────────────────────────────────────
function countActiveFilters(f) {
  let n = 0
  if (f.directionId) n++
  if (f.tourTypes.length) n++
  if (f.dateFrom || f.dateTo) n++
  if (f.hotelClass) n++
  if (f.durationMinDays !== DEFAULT_FILTER.durationMinDays || f.durationMaxDays !== DEFAULT_FILTER.durationMaxDays) n++
  if (f.priceMin > 0 || f.priceMax < DEFAULT_FILTER.priceMax) n++
  if (f.onlyPopular) n++
  return n
}

// ─── Filter panel inner content ───────────────────────────────────────────────

function FilterPanel({ filter, setFilter, directions, relaxTypes, onSearch, onClose }) {
  function set(key, val) {
    setFilter(prev => ({ ...prev, [key]: val }))
  }

  function reset() {
    setFilter(DEFAULT_FILTER)
  }

  const activeCount = countActiveFilters(filter)

  const directionOptions = [
    { value: '', label: 'Все направления' },
    ...directions.map(d => ({ value: String(d.id), label: d.name })),
  ]

  return (
    <div className="flex flex-col overflow-y-scroll lg:overflow-visible h-screen lg:h-auto">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-[#1a6b1a]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-(--site-accent) to-(--site-accent-bright) flex items-center justify-center">
              <Filter className="w-4 h-4 text-(--site-on-accent)" />
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Фильтры
              </div>
              {activeCount > 0 && (
                <div className="text-[10px] text-(--site-accent)/70">
                  Активно: {activeCount}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-white/25 hover:text-white/80 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                Сброс
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter fields row */}
      <div className="px-5 py-4 flex lg:flex-wrap flex-col lg:flex-row  gap-x-6 gap-y-4 overflow-y-scroll lg:overflow-visible">

        {/* ── Направление ─────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 min-w-[200px]">
          <FilterLabel>Направление</FilterLabel>
          <CustomSelect
            options={directionOptions}
            value={filter.directionId}
            onChange={v => set('directionId', v)}
            placeholder="Все направления"
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* ── Вид отдыха ──────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[300px]">
          <FilterLabel>Вид отдыха</FilterLabel>
          <MultiSelect
            options={relaxTypes.map(t => ({ value: t.slug, label: t.name }))}
            value={filter.tourTypes}
            onChange={v => set('tourTypes', v)}
            placeholder={relaxTypes.length ? 'Все виды отдыха' : 'Загрузка…'}
            icon={<Tag className="w-4 h-4" />}
            maxShow={1}
          />
        </div>

        {/* ── Даты ────────────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[180px]">
          <FilterLabel>Даты отдыха</FilterLabel>
          <DateRangePicker
            from={filter.dateFrom}
            to={filter.dateTo}
            onChange={(from, to) => setFilter(p => ({ ...p, dateFrom: from, dateTo: to }))}
          />
        </div>

        {/* ── Класс отеля ─────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[200px]">
          <FilterLabel>Класс отеля</FilterLabel>
          <CustomSelect
            options={HOTEL_CLASSES}
            value={filter.hotelClass}
            onChange={v => set('hotelClass', v)}
            placeholder="Любой класс"
            icon={<Star className="w-4 h-4" />}
          />
        </div>

        {/* ── Длительность тура ───────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[200px]">
          <FilterLabel>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-(--site-accent)" />
              Длительность тура
            </span>
          </FilterLabel>
          <DurationRange
            minDays={filter.durationMinDays}
            maxDays={filter.durationMaxDays}
            onMinChange={v => set('durationMinDays', v)}
            onMaxChange={v => set('durationMaxDays', v)}
          />
        </div>

        {/* ── Стоимость ───────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[200px]">
          <FilterLabel>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-(--site-accent)" />
              Стоимость
            </span>
          </FilterLabel>
          <PriceRange
            priceMin={filter.priceMin}
            priceMax={filter.priceMax}
            onMinChange={v => set('priceMin', v)}
            onMaxChange={v => set('priceMax', v)}
          />
        </div>

        {/* ── Спец. предложения ───────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[200px]">
          <FilterLabel>Спец. предложения</FilterLabel>
          <div className="flex flex-col gap-2">
            <ToggleChip
              active={filter.onlyPopular}
              onToggle={() => set('onlyPopular', !filter.onlyPopular)}
              icon={<Sparkles className="w-3.5 h-3.5" />}
              label="Только популярные"
            />
          </div>
        </div>
      </div>

      {/* Footer with search button */}
      <div className="shrink-0 px-5 py-4 border-t border-[#1a6b1a]/20 backdrop-blur-sm flex items-center gap-3">
        <motion.button
          type="button"
          onClick={() => { onSearch(filter); onClose?.() }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 32px var(--site-shadow-soft)' }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm"
        >
          <Search className="w-4 h-4" />
          Найти туры
          {activeCount > 0 && (
            <span className="bg-[#030f03]/20 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </motion.button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="py-2 px-3 rounded-xl text-white/40 text-xs hover:text-white/60 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Сбросить все фильтры
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Mobile filter badge trigger button ──────────────────────────────────────

function MobileTrigger({ activeCount, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/80 backdrop-blur-sm text-white text-sm font-medium shadow-lg"
    >
      <SlidersHorizontal className="w-4 h-4 text-(--site-accent)" />
      Фильтры
      {activeCount > 0 && (
        <span className="w-5 h-5 rounded-full bg-(--site-accent) text-(--site-on-accent) text-[10px] font-bold flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </motion.button>
  )
}

// ─── Active filter chips (shown above results) ────────────────────────────────

function ActiveChips({ filter, directions, relaxTypes, onRemove, onReset }) {
  const chips = []

  if (filter.directionId) {
    const d = directions.find(x => String(x.id) === String(filter.directionId))
    chips.push({ label: d?.name || 'Направление', onRemove: () => onRemove('directionId') })
  }
  filter.tourTypes.forEach(t => {
    const o = relaxTypes.find(x => x.slug === t)
    chips.push({ label: o?.name || t, onRemove: () => onRemove('tourTypes', t) })
  })
  if (filter.dateFrom || filter.dateTo) {
    chips.push({
      label: `${filter.dateFrom?.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }) ?? '?'} — ${filter.dateTo?.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }) ?? '?'}`,
      onRemove: () => onRemove('dateFrom'),
    })
  }
  if (filter.hotelClass) {
    const h = HOTEL_CLASSES.find(x => x.value === filter.hotelClass)
    chips.push({ label: h?.label || filter.hotelClass, onRemove: () => onRemove('hotelClass') })
  }
  if (filter.onlyHot) {

  }
  if (filter.onlyPopular) {
    chips.push({ label: '⭐ Популярные', onRemove: () => onRemove('onlyPopular') })
  }

  if (chips.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 items-center"
    >
      {chips.map((chip, i) => (
        <motion.span
          key={`${chip.label}-${i}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-(--site-accent)/20 bg-(--site-accent)/8 text-(--site-accent) text-xs font-medium"
        >
          {chip.label}
          <button type="button" onClick={chip.onRemove} className="hover:text-white transition-colors">
            <X className="w-3 h-3" />
          </button>
        </motion.span>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-white/35 hover:text-white/60 transition-colors px-1"
      >
        Очистить всё
      </button>
    </motion.div>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────

export default function TourFilter({ onSearch }) {
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [directions, setDirections] = useState([])
  const [relaxTypes, setRelaxTypes] = useState([])

  useEffect(() => {
    let alive = true
    fetch('/api/resort-directions')
      .then(r => r.json())
      .then(d => { if (alive) setDirections(Array.isArray(d?.directions) ? d.directions : []) })
      .catch(() => { if (alive) setDirections([]) })
    fetch('/api/relax-types')
      .then(r => r.json())
      .then(d => { if (alive) setRelaxTypes(Array.isArray(d) ? d : []) })
      .catch(() => { if (alive) setRelaxTypes([]) })
    return () => { alive = false }
  }, [])

  const handleSearch = useCallback(f => {
    console.log('🔍 Search with filters:', f)
    onSearch?.(f)
  }, [onSearch])

  const activeCount = countActiveFilters(filter)

  function removeFilter(key, val) {
    setFilter(prev => {
      if (key === 'tourTypes' && val) {
        return { ...prev, tourTypes: prev.tourTypes.filter(v => v !== val) }
      }
      if (key === 'dateFrom') {
        return { ...prev, dateFrom: null, dateTo: null }
      }
      return { ...prev, [key]: DEFAULT_FILTER[key] }
    })
  }

  return (
    <>
      {/* ── Desktop layout ────────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="rounded-2xl border border-[#1a6b1a]/25 backdrop-blur-sm shadow-[0_8px_15px_rgba(0,0,0,0.2)] relative z-30">
          <FilterPanel
            filter={filter}
            setFilter={setFilter}
            directions={directions}
            relaxTypes={relaxTypes}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* ── Mobile layout ─────────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <MobileTrigger activeCount={activeCount} onClick={() => setMobileOpen(true)} />
          <div className="text-xs text-white/40">
            {activeCount > 0 ? `${activeCount} фильтров активно` : 'Нет активных фильтров'}
          </div>
        </div>

        {/* Active chips */}
        <div className="mb-4">
          <AnimatePresence>
            {activeCount > 0 && (
              <ActiveChips
                filter={filter}
                directions={directions}
                relaxTypes={relaxTypes}
                onRemove={removeFilter}
                onReset={() => setFilter(DEFAULT_FILTER)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              {/* Sheet from bottom */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-[#1a6b1a]/30 bg-[#061506]"
                style={{ maxHeight: '92dvh' }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-white/15" />
                </div>
                <div className="flex flex-col" style={{ maxHeight: 'calc(92dvh - 20px)' }}>
                  <FilterPanel
                    filter={filter}
                    setFilter={setFilter}
                    directions={directions}
                    relaxTypes={relaxTypes}
                    onSearch={handleSearch}
                    onClose={() => setMobileOpen(false)}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
