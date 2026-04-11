'use client'
import Image from 'next/image'
import { X } from 'lucide-react'

// ─── cn helper ───────────────────────────────────────────────────────────────
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-gradient-to-r from-(--profile-gradient-from) to-(--profile-gradient-to) text-(--profile-on-accent) hover:shadow-[0_0_24px_rgba(22,101,52,0.35)] focus:ring-(--profile-accent) active:scale-[0.98] dark:hover:shadow-[0_0_24px_rgba(255,215,0,0.4)]',
    secondary: 'border border-[#1a6b1a]/40 bg-app-card text-[#1a6b1a] hover:border-(--profile-accent)/45 hover:text-(--profile-accent) focus:ring-[#1a6b1a] dark:bg-[#0a2a0a]/60 dark:text-[#86c986]',
    ghost:     'text-app-muted hover:text-app-fg hover:bg-app-fg/5 focus:ring-app-border dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 dark:focus:ring-white/20',
    danger:    'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 focus:ring-red-500',
    outline:   'border border-(--profile-accent)/40 text-(--profile-accent) hover:bg-(--profile-accent-soft) focus:ring-(--profile-accent)',
  }
  const sizes = {
    sm:  'px-3 py-1.5 text-xs',
    md:  'px-4 py-2.5 text-sm',
    lg:  'px-6 py-3 text-base',
    icon:'w-9 h-9 p-0',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:   'bg-[#1a6b1a]/30 border border-[#1a6b1a]/40 text-[#86c986]',
    gold:      'bg-(--profile-accent-soft) border border-(--profile-accent-border) text-(--profile-accent)',
    active:    'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400',
    completed: 'bg-blue-500/15 border border-blue-500/25 text-blue-400',
    pending:   'bg-amber-500/15 border border-amber-500/25 text-amber-400',
    inactive:  'bg-stone-500/15 border border-stone-500/25 text-stone-400',
    danger:    'bg-red-500/15 border border-red-500/25 text-red-400',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide', variants[variant], className)}>
      {children}
    </span>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div onClick={onClick}
      className={cn(
        'rounded-2xl border border-app-border bg-app-card/95 backdrop-blur-sm dark:bg-[#0a2a0a]/60',
        hover && 'cursor-pointer hover:border-(--profile-accent)/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300',
        className,
      )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn('p-5 border-b border-app-border', className)}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-faint dark:text-white/30 pointer-events-none" />}
        <input
          className={cn(
            'w-full rounded-xl border bg-app-input-bg text-app-fg placeholder:text-app-faint dark:bg-[#0a2a0a]/80 dark:text-white dark:placeholder-white/25 text-sm px-3.5 py-2.5 transition-all duration-200',
            'focus:outline-none focus:ring-2',
            Icon ? 'pl-10' : '',
            error
              ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
              : 'border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45',
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider">{label}</label>}
      <textarea
        className={cn(
          'w-full rounded-xl border bg-app-input-bg text-app-fg placeholder:text-app-faint dark:bg-[#0a2a0a]/80 dark:text-white dark:placeholder-white/25 text-sm px-3.5 py-2.5 transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/50 focus:ring-red-500/30'
            : 'border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45',
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">⚠ {error}</p>}
    </div>
  )
}

export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider">{label}</label>}
      <select
        className={cn(
          'w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 transition-all duration-200',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/50 focus:ring-red-500/30'
            : 'border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45',
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">⚠ {error}</p>}
    </div>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-base', lg: 'w-20 h-20 text-2xl', xl: 'w-24 h-24 text-3xl' }
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'
  return src ? (
    <Image
      src={src}
      alt={name}
      width={size === 'xl' ? 96 : size === 'lg' ? 80 : size === 'md' ? 48 : 32}
      height={size === 'xl' ? 96 : size === 'lg' ? 80 : size === 'md' ? 48 : 32}
      className={cn('rounded-full object-cover shrink-0', sizes[size], className)}
      style={{ objectFit: 'cover' }}
    />
  ) : (
    <div className={cn('rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-(--profile-accent)/20 to-(--profile-accent-bright)/10 border border-(--profile-accent-border) font-bold text-(--profile-accent)', sizes[size], className)}>
      {initials}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, className = '' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative z-10 w-full max-w-lg rounded-2xl border border-app-border bg-app-card shadow-[0_24px_64px_rgba(0,0,0,0.15)] dark:bg-[#061506] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden',
        className,
      )}>
        <div className="flex items-center justify-between p-5 border-b border-app-border">
          <h3 className="font-semibold text-app-fg dark:text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-app-subtle hover:text-app-fg hover:bg-app-fg/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-app-fg dark:text-white font-semibold text-2xl leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {title}
        </h2>
        {subtitle && <p className="text-app-subtle dark:text-white/45 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Stats card ───────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color = 'gold' }) {
  const colors = {
    gold:    'from-(--profile-accent)/10 to-(--profile-accent-bright)/5 border-(--profile-accent-border) text-(--profile-accent)',
    green:   'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    blue:    'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    amber:   'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400',
  }
  return (
    <div className={cn('flex flex-col gap-2 p-4 rounded-2xl border bg-linear-to-br', colors[color])}>
      <Icon className="w-5 h-5" />
      <div className="text-2xl font-bold text-app-fg dark:text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{value}</div>
      <div className="text-xs text-app-subtle dark:text-white/45">{label}</div>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="h-px bg-linear-to-r from-transparent via-[#1a6b1a]/30 to-transparent my-6" />
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-(--profile-accent)/50" />
      </div>
      <h3 className="text-app-muted dark:text-white/60 font-medium mb-1">{title}</h3>
      <p className="text-app-faint dark:text-white/30 text-sm max-w-xs">{subtitle}</p>
    </div>
  )
}

// ─── Toast (simple inline notification) ──────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  const styles = {
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    error:   'bg-red-500/15 border-red-500/30 text-red-300',
    info:    'bg-blue-500/15 border-blue-500/30 text-blue-300',
  }
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border text-sm', styles[type])}>
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>}
    </div>
  )
}
