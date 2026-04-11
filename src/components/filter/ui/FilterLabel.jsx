
export function FilterLabel({ children, className = '' }) {
  return (
    <div className={`text-[10px] font-semibold uppercase tracking-widest text-white/35 mb-1.5 px-0.5 ${className}`}>
      {children}
    </div>
  )
}

export function FilterDivider() {
  return <div className="h-px bg-linear-to-r from-transparent via-[#1a6b1a]/30 to-transparent my-1" />
}
