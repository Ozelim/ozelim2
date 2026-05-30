'use client'

export function PriceRange({ priceMin, priceMax, onMinChange, onMaxChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="block">
        <span className="text-[10px] text-app-faint mb-1 block">От</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={priceMin ?? ''}
          onChange={(e) => {
            const v = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value))
            onMinChange(v)
          }}
          className="w-full px-3 py-2 rounded-xl border border-app-border bg-app-card text-sm text-app-fg focus:border-(--site-accent)/60 focus:outline-none focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all"
        />
      </label>
      <label className="block">
        <span className="text-[10px] text-app-faint mb-1 block">До</span>
        <input
          type="number"
          min={0}
          step={1000}
          value={priceMax ?? ''}
          onChange={(e) => {
            const v = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value))
            onMaxChange(v)
          }}
          className="w-full px-3 py-2 rounded-xl border border-app-border bg-app-card text-sm text-app-fg focus:border-(--site-accent)/60 focus:outline-none focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all"
        />
      </label>
    </div>
  )
}
