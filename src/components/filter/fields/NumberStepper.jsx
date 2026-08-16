'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

/**
 * Числовое поле с крупными кнопками − / +.
 *
 * Поле держит собственную строку, поэтому его можно полностью стереть
 * и набрать своё значение — родителю уходит уже нормализованное число.
 * Клампим на blur, а не на каждый ввод, иначе «1» невозможно удалить.
 */
export function NumberStepper({ label, value, min = 0, max = Infinity, step = 1, suffix, onChange }) {
  const [draft, setDraft] = useState(value == null ? '' : String(value))

  // Внешние изменения (сброс фильтра, кнопки ± ) переносим в поле
  useEffect(() => {
    setDraft(value == null ? '' : String(value))
  }, [value])

  const clamp = (n) => Math.min(max, Math.max(min, n))

  const commit = (raw) => {
    if (raw === '' || Number.isNaN(Number(raw))) {
      setDraft(String(min))
      onChange(min)
      return
    }
    const next = clamp(Math.round(Number(raw)))
    setDraft(String(next))
    onChange(next)
  }

  const bump = (delta) => {
    const base = draft === '' || Number.isNaN(Number(draft)) ? min : Number(draft)
    const next = clamp(base + delta)
    setDraft(String(next))
    onChange(next)
  }

  const atMin = Number(draft || min) <= min
  const atMax = Number(draft || min) >= max

  const btn =
    'w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-app-border bg-app-card text-app-fg transition-all ' +
    'hover:border-(--site-accent)/60 hover:text-(--site-accent) active:scale-95 ' +
    'disabled:opacity-40 disabled:pointer-events-none'

  return (
    <div className="block">
      {label && <span className="text-[10px] text-app-faint mb-1 block">{label}</span>}
      <div className="flex items-center gap-1.5">
        <button type="button" className={btn} onClick={() => bump(-step)} disabled={atMin} aria-label="Уменьшить">
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, '')
            setDraft(raw)
            if (raw !== '') onChange(clamp(Number(raw)))
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(e.currentTarget.value) }
            if (e.key === 'ArrowUp') { e.preventDefault(); bump(step) }
            if (e.key === 'ArrowDown') { e.preventDefault(); bump(-step) }
          }}
          className="w-full min-w-0 px-2 py-2 rounded-xl border border-app-border bg-app-card text-sm text-app-fg text-center tabular-nums focus:border-(--site-accent)/60 focus:outline-none focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all"
        />
        <button type="button" className={btn} onClick={() => bump(step)} disabled={atMax} aria-label="Увеличить">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {suffix && <span className="text-[10px] text-app-faint mt-1 block">{suffix}</span>}
    </div>
  )
}
