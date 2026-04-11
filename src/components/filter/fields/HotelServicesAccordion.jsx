'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SERVICE_GROUPS } from '../FilterState'

export function HotelServicesAccordion({ value, onChange }) {
  const [openGroups, setOpenGroups] = useState(['hotel'])

  function toggleGroup(id) {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  function toggle(v) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }

  function groupCheckedCount(groupId) {
    const group = SERVICE_GROUPS.find((g) => g.id === groupId)
    if (!group) return 0
    return group.items.filter((item) => value.includes(item.value)).length
  }

  return (
    <div className="space-y-1.5">
      {SERVICE_GROUPS.map((group) => {
        const isOpen = openGroups.includes(group.id)
        const checkedCount = groupCheckedCount(group.id)

        return (
          <div
            key={group.id}
            className={`rounded-xl border overflow-hidden transition-colors duration-200
              ${isOpen ? 'border-(--site-accent)/30' : 'border-app-border bg-app-card'}`}
          >
            {/* Group header */}
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{group.icon}</span>
                <span className="text-sm font-medium text-app-fg">{group.label}</span>
                {checkedCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-(--site-accent)/15 border border-(--site-accent)/20 text-(--site-accent) text-[10px] font-medium">
                    {checkedCount}
                  </span>
                )}
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-app-faint"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>

            {/* Items */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-[#1a6b1a]/15 pt-3">
                    {group.items.map((item) => {
                      const checked = value.includes(item.value)
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => toggle(item.value)}
                          className="flex items-center gap-2 text-left group"
                        >
                          <span className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-all duration-150
                            ${checked
                              ? 'bg-(--site-accent) border-(--site-accent)'
                              : 'border-[#1a6b1a]/50 bg-transparent group-hover:border-[#1a6b1a]/80'
                            }`}
                          >
                            {checked && <Check className="w-2.5 h-2.5 text-(--site-on-accent)" strokeWidth={3} />}
                          </span>
                          <span className={`text-xs truncate transition-colors duration-150 ${checked ? 'text-white' : 'text-white group-hover:text-white/80'}`}>
                            {item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
