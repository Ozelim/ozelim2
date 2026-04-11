'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Palmtree, Tag, Star, Utensils, Home,
  SlidersHorizontal, Search, RotateCcw, X, Filter,
} from 'lucide-react'

import {
  DEFAULT_FILTER, REGIONS, RESORTS, TOUR_TYPES,
  HOTEL_CLASSES, ACCOMMODATION_TYPES, MEAL_PLANS,
} from './FilterState'

import { CustomSelect } from './ui/CustomSelect'
import { MultiSelect } from './ui/MultiSelect'
import { FilterLabel, FilterDivider } from './ui/FilterLabel'
import { DateRangePicker } from './fields/DateRangePicker'
import { TouristCounter } from './fields/TouristCounter'
import { BudgetSlider } from './fields/BudgetSlider'
import { HotelServicesAccordion } from './fields/HotelServicesAccordion'
import { Button } from '../ui/button'

// ─── Active filter count badge ────────────────────────────────────────────────
function countActiveFilters(f) {
  let n = 0
  if (f.region) n++
  if (f.resort) n++
  if (f.tourTypes.length) n++
  if (f.dateFrom || f.dateTo) n++
  if (f.adults !== 2 || f.children !== 0) n++
  if (f.hotelClass) n++
  if (f.accommodation.length) n++
  if (f.meal) n++
  if (f.budgetMin > 0 || f.budgetMax < 2000000) n++
  if (f.services.length) n++
  return n
}

// ─── Filter panel inner content ───────────────────────────────────────────────

function FilterPanel({ filter, setFilter, onSearch, onClose }) {
  function set(key, val) {
    setFilter(prev => ({ ...prev, [key]: val }))
  }

  function reset() {
    setFilter(DEFAULT_FILTER)
  }

  const activeCount = countActiveFilters(filter)

  return (
    <div className="flex flex-col overflow-y-scroll h-screen lg:h-auto">
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
      <div className="px-5 py-4 flex lg:flex-wrap flex-col lg:flex-row  gap-x-6 gap-y-4 overflow-y-scroll">

        {/* ── Регион + Курорт ─────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 min-w-[200px]">
          <FilterLabel>Направление</FilterLabel>
          <CustomSelect
            options={REGIONS}
            value={filter.region}
            onChange={v => set('region', v)}
            placeholder="Весь Казахстан"
            icon={<MapPin className="w-4 h-4" />}
          />
          <CustomSelect
            options={RESORTS}
            value={filter.resort}
            onChange={v => set('resort', v)}
            placeholder="Любой курорт"
            icon={<Palmtree className="w-4 h-4" />}
          />
        </div>

        {/* ── Вид отдыха ──────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[300px]">
          <FilterLabel>Вид отдыха</FilterLabel>
          <MultiSelect
            options={TOUR_TYPES}
            value={filter.tourTypes}
            onChange={v => set('tourTypes', v)}
            placeholder="Все виды отдыха"
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

        {/* ── Туристы ─────────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[140px]">
          <FilterLabel>Туристы</FilterLabel>
          <TouristCounter
            adults={filter.adults}
            childrenCount={filter.children}
            onAdultsChange={v => set('adults', v)}
            onChildrenChange={v => set('children', v)}
          />
        </div>

        {/* ── Отель ───────────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[300px]">
          <FilterLabel>Класс и тип отеля</FilterLabel>
          <CustomSelect
            options={HOTEL_CLASSES}
            value={filter.hotelClass}
            onChange={v => set('hotelClass', v)}
            placeholder="Любой класс"
            icon={<Star className="w-4 h-4" />}
          />
          <MultiSelect
            options={ACCOMMODATION_TYPES}
            value={filter.accommodation}
            onChange={v => set('accommodation', v)}
            placeholder="Любой тип размещения"
            icon={<Home className="w-4 h-4" />}
            maxShow={2}
          />
        </div>

        {/* ── Питание ─────────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[140px]">
          <FilterLabel>Питание</FilterLabel>
          <CustomSelect
            options={MEAL_PLANS}
            value={filter.meal}
            onChange={v => set('meal', v)}
            placeholder="Любое питание"
            icon={<Utensils className="w-4 h-4" />}
          />
        </div>

        {/* ── Бюджет ──────────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[180px]">
          <FilterLabel>Бюджет</FilterLabel>
          <div className="px-1 pb-1">
            <BudgetSlider
              min={filter.budgetMin}
              max={filter.budgetMax}
              currency={filter.currency}
              onMinChange={v => set('budgetMin', v)}
              onMaxChange={v => set('budgetMax', v)}
              onCurrencyChange={v => set('currency', v)}
            />
          </div>
        </div>

        {/* ── Услуги отеля ────────────────────────────────────────────────── */}
        <div className="space-y-2 flex-1 lg:min-w-[500px]">
          <FilterLabel>Услуги отеля</FilterLabel>
          <HotelServicesAccordion
            value={filter.services}
            onChange={v => set('services', v)}
          />
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

function ActiveChips({ filter, onRemove, onReset }) {
  const chips = []

  if (filter.region) {
    const r = REGIONS.find(x => x.value === filter.region)
    chips.push({ label: r?.label || filter.region, onRemove: () => onRemove('region') })
  }
  if (filter.resort) {
    const r = RESORTS.find(x => x.value === filter.resort)
    chips.push({ label: r?.label || filter.resort, onRemove: () => onRemove('resort') })
  }
  filter.tourTypes.forEach(t => {
    const o = TOUR_TYPES.find(x => x.value === t)
    chips.push({ label: o?.label || t, onRemove: () => onRemove('tourTypes', t) })
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
  if (filter.meal) {
    const m = MEAL_PLANS.find(x => x.value === filter.meal)
    chips.push({ label: m?.label?.split(' — ')[0] || filter.meal, onRemove: () => onRemove('meal') })
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
      if (key === 'accommodation' && val) {
        return { ...prev, accommodation: prev.accommodation.filter(v => v !== val) }
      }
      if (key === 'services' && val) {
        return { ...prev, services: prev.services.filter(v => v !== val) }
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
        <div className="rounded-2xl border border-[#1a6b1a]/25 backdrop-blur-sm overflow-hidden shadow-[0_8px_15px_rgba(0,0,0,0.2)]">
          <FilterPanel
            filter={filter}
            setFilter={setFilter}
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
              <ActiveChips filter={filter} onRemove={removeFilter} onReset={() => setFilter(DEFAULT_FILTER)} />
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
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-[#1a6b1a]/30 bg-[#061506] overflow-hidden"
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


