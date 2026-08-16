'use client'

import { NumberStepper } from './NumberStepper'

export function PriceRange({ priceMin, priceMax, onMinChange, onMaxChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumberStepper
        label="От"
        value={priceMin}
        min={0}
        step={1000}
        onChange={(v) => {
          onMinChange(v)
          if (priceMax != null && v > priceMax) onMaxChange(v)
        }}
      />
      <NumberStepper
        label="До"
        value={priceMax}
        min={0}
        step={1000}
        onChange={(v) => {
          onMaxChange(v)
          if (priceMin != null && v < priceMin) onMinChange(v)
        }}
      />
    </div>
  )
}
