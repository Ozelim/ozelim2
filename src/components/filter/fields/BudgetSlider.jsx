"use client";

import { useCallback } from "react";
import { CURRENCIES } from "../FilterState";

const BUDGET_MAX = { KZT: 2_000_000 };
const BUDGET_STEP = { KZT: 10_000 };

function formatBudget(v) {
  return `${(v / 1000).toFixed(0)}K ₸`;
}

export function BudgetSlider({
  min,
  max,
  currency,
  onMinChange,
  onMaxChange,
  onCurrencyChange,
}) {
  const absMax = BUDGET_MAX[currency] ?? 2_000_000;
  const step = BUDGET_STEP[currency] ?? 10_000;

  // Thumb position % for the track highlight
  const minPct = (min / absMax) * 100;
  const maxPct = (max / absMax) * 100;

  return (
    <div className="space-y-3">
      {/* Currency tabs */}
      <div className="flex rounded-xl border border-app-border overflow-hidden bg-app-card p-0.5 gap-0.5">
        {CURRENCIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              onCurrencyChange(c.value);
              const newMax = BUDGET_MAX[c.value] ?? 2_000_000;
              onMinChange(0);
              onMaxChange(newMax);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
              ${
                currency === c.value
                  ? "bg-(--site-accent) text-(--site-on-accent)"
                  : "text-app-muted hover:text-app-fg"
              }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Range display */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-app-faint">Бюджет на туриста</span>
        <span className="text-xs font-medium text-app-fg">
          {formatBudget(min)} — {formatBudget(max)}
        </span>
      </div>

      {/* Dual range track */}
      <div className="relative h-5 flex items-center">
        {/* Track bg */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-app-elevated" />
        {/* Active range */}
        <div
          className="absolute h-1.5 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright)"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={0}
          max={absMax}
          step={step}
          value={min}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < max) onMinChange(v);
          }}
          className="absolute inset-x-0 w-full appearance-none bg-transparent cursor-pointer range-thumb-gold"
          style={{ zIndex: min > absMax * 0.9 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={0}
          max={absMax}
          step={step}
          value={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > min) onMaxChange(v);
          }}
          className="absolute inset-x-0 w-full appearance-none bg-transparent cursor-pointer range-thumb-gold"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        <span className="text-[10px] text-app-faint">0</span>
        <span className="text-[10px] text-app-faint">
          {formatBudget(absMax)}
        </span>
      </div>
    </div>
  );
}
