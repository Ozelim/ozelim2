'use client'

export const DURATION_MIN_DAYS = 1
export const DURATION_MAX_DAYS = 7

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
  const MIN = DURATION_MIN_DAYS
  const MAX = DURATION_MAX_DAYS

  const lo = Math.min(Math.max(minDays ?? MIN, MIN), MAX)
  const hi = Math.min(Math.max(maxDays ?? MAX, MIN), MAX)

  const pct = (v) => ((v - MIN) / (MAX - MIN)) * 100

  function setLo(v) {
    onMinChange(v)
    if (v > hi) onMaxChange(v)
  }

  function setHi(v) {
    onMaxChange(v)
    if (v < lo) onMinChange(v)
  }

  return (
    <div className="rounded-xl border border-app-border bg-app-card px-3.5 pt-2.5 pb-2">
      {/* Читаемая сводка — цифры крупные, а не втиснутые в поле ввода */}
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-base font-bold tabular-nums text-app-fg leading-none">{lo}</span>
        <span className="text-app-faint leading-none">—</span>
        <span className="text-base font-bold tabular-nums text-app-fg leading-none">{hi}</span>
        <span className="text-xs text-app-muted ml-0.5 leading-none">{dayWord(hi)}</span>
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
      <div className="flex justify-between mt-1 text-[10px] tabular-nums text-app-faint select-none">
        {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map((d) => (
          <span key={d} className={d >= lo && d <= hi ? 'text-(--site-accent)' : ''}>
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}
