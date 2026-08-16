'use client'

import { NumberStepper } from './NumberStepper'

export const DURATION_MIN_DAYS = 1
export const DURATION_MAX_DAYS = 7

export function DurationRange({ minDays, maxDays, onMinChange, onMaxChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumberStepper
        label="От, дней"
        value={minDays}
        min={DURATION_MIN_DAYS}
        max={DURATION_MAX_DAYS}
        onChange={(v) => {
          onMinChange(v)
          if (maxDays != null && v > maxDays) onMaxChange(v)
        }}
      />
      <NumberStepper
        label="До, дней"
        value={maxDays}
        min={DURATION_MIN_DAYS}
        max={DURATION_MAX_DAYS}
        onChange={(v) => {
          onMaxChange(v)
          if (minDays != null && v < minDays) onMinChange(v)
        }}
      />
    </div>
  )
}
