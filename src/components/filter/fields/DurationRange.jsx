'use client'

export function DurationRange({ minDays, maxDays, onMinChange, onMaxChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="block">
        <span className="text-[10px] text-app-faint mb-1 block">От, дней</span>
        <input
          type="number"
          min={1}
          max={365}
          value={minDays ?? ''}
          onChange={(e) => {
            const v = e.target.value === '' ? 1 : Math.max(1, Number(e.target.value))
            onMinChange(v)
          }}
          className="w-full px-3 py-2 rounded-xl border border-app-border bg-app-card text-sm text-app-fg focus:border-(--site-accent)/60 focus:outline-none focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all"
        />
      </label>
      <label className="block">
        <span className="text-[10px] text-app-faint mb-1 block">До, дней</span>
        <input
          type="number"
          min={1}
          max={365}
          value={maxDays ?? ''}
          onChange={(e) => {
            const v = e.target.value === '' ? 1 : Math.max(1, Number(e.target.value))
            onMaxChange(v)
          }}
          className="w-full px-3 py-2 rounded-xl border border-app-border bg-app-card text-sm text-app-fg focus:border-(--site-accent)/60 focus:outline-none focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all"
        />
      </label>
    </div>
  )
}
