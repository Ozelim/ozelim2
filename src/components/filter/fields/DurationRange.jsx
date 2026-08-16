'use client'

import { DURATION_MIN_DAYS, DURATION_MAX_DAYS } from '../FilterState'

export { DURATION_MIN_DAYS, DURATION_MAX_DAYS }

const MIN = DURATION_MIN_DAYS
const MAX = DURATION_MAX_DAYS

// Подписи под рельсом. Все 30 делений не влезут, показываем опорные.
const TICKS = [1, 7, 14, 21, 30]

// Быстрый выбор типовых длительностей — на шкале в 30 дней тянуть бегунок
// ради «недели» слишком долго.
const PRESETS = [
  { label: '1—3', from: 1, to: 3 },
  { label: 'Неделя', from: 2, to: 7 },
  { label: '2 недели', from: 8, to: 14 },
  { label: 'Все', from: MIN, to: MAX },
]

// «1 день / 2 дня / 5 дней»
function dayWord(n) {
  const d10 = n % 10
  const d100 = n % 100
  if (d10 === 1 && d100 !== 11) return 'день'
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return 'дня'
  return 'дней'
}

// Два <input type="range">, положенные друг на друга: сам инпут прозрачен и не
// ловит клики, кликабельны только бегунки. Верхний (min) при пересечении
// толкает нижний (max) — так диапазон нельзя вывернуть наизнанку.
const RANGE =
  'absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-4 appearance-none bg-transparent ' +
  'pointer-events-none focus:outline-none ' +
  '[&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:bg-transparent ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none ' +
  '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full ' +
  '[&::-webkit-slider-thumb]:bg-(--site-accent) [&::-webkit-slider-thumb]:border-2 ' +
  '[&::-webkit-slider-thumb]:border-app-card [&::-webkit-slider-thumb]:cursor-grab ' +
  '[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)] ' +
  '[&::-moz-range-track]:h-4 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-none ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 ' +
  '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-(--site-accent) ' +
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-app-card ' +
  '[&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)]'

export function DurationRange({ minDays, maxDays, onMinChange, onMaxChange }) {
  const lo = Math.min(Math.max(minDays ?? MIN, MIN), MAX)
  const hi = Math.min(Math.max(maxDays ?? MAX, MIN), MAX)

  const pct = (v) => ((v - MIN) / (MAX - MIN)) * 100
  const isFull = lo === MIN && hi === MAX

  function setLo(v) {
    onMinChange(v)
    if (v > hi) onMaxChange(v)
  }

  function setHi(v) {
    onMaxChange(v)
    if (v < lo) onMinChange(v)
  }

  function apply(p) {
    onMinChange(p.from)
    onMaxChange(p.to)
  }

  return (
    <div className="rounded-xl border border-app-border bg-app-card px-3.5 pt-2.5 pb-3">
      {/* Читаемая сводка — цифры крупные, а не втиснутые в поле ввода */}
      <div className="flex items-baseline gap-1.5 mb-2.5">
        <span className="text-base font-bold tabular-nums text-app-fg leading-none">{lo}</span>
        <span className="text-app-faint leading-none">—</span>
        <span className="text-base font-bold tabular-nums text-app-fg leading-none">{hi}</span>
        <span className="text-xs text-app-muted ml-0.5 leading-none">{dayWord(hi)}</span>
        {isFull && (
          <span className="text-[10px] text-app-faint ml-auto leading-none">без ограничений</span>
        )}
      </div>

      <div className="relative h-4">
        {/* Рельс */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-app-border" />
        {/* Выбранный отрезок */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-(--site-accent)"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={lo}
          onChange={(e) => setLo(Number(e.target.value))}
          aria-label="Минимум дней"
          className={`${RANGE} z-20`}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={hi}
          onChange={(e) => setHi(Number(e.target.value))}
          aria-label="Максимум дней"
          className={`${RANGE} z-10`}
        />
      </div>

      {/* Шкала */}
      <div className="relative h-3.5 mt-1">
        {TICKS.map((d) => (
          <span
            key={d}
            style={{ left: `${pct(d)}%` }}
            className={`absolute -translate-x-1/2 text-[10px] tabular-nums leading-none select-none ${
              d >= lo && d <= hi ? 'text-(--site-accent)' : 'text-app-faint'
            }`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Быстрый выбор */}
      <div className="flex flex-wrap gap-1 mt-1.5">
        {PRESETS.map((p) => {
          const active = lo === p.from && hi === p.to
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => apply(p)}
              className={`px-2 py-1 rounded-lg border text-[10px] font-medium transition-all ${
                active
                  ? 'border-(--site-accent) bg-(--site-accent)/15 text-(--site-accent)'
                  : 'border-app-border text-app-muted hover:border-(--site-accent)/40 hover:text-app-fg'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
