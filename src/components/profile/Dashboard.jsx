'use client'
import { useEffect, useState } from 'react'
import { ClipboardList, Heart, MessageSquare, Star, ChevronRight, Zap, Calendar, MapPin, MapPinned, Phone, AlertTriangle } from 'lucide-react'
import { Card, CardBody, Avatar, Badge, Button, StatCard } from './ui'
import { PACKAGE_FEATURES } from '../../lib/mockData'
import Link from 'next/link'

const KIND_LABELS = {
  tour_request: 'Заявка на тур',
  tour_calculator: 'Расчёт тура',
  tour_booking: 'Бронирование тура',
  endowment: 'Эндаумент',
  legal_consult: 'Юр. консультация',
  insurance_request: 'Страхование',
  tickets_request: 'Билеты',
  kids_go_free: 'Kids Go Free',
}

const STATUS_META = {
  new: { label: 'Новая', variant: 'pending' },
  in_progress: { label: 'В работе', variant: 'active' },
  closed: { label: 'Закрыта', variant: 'completed' },
  rejected: { label: 'Отклонена', variant: 'danger' },
}

function fullName(user) {
  return [user.name, user.surname].filter(Boolean).join(' ') || user.email || '—'
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

function UpgradeBanner({ onUpgrade }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--profile-accent-border) bg-linear-to-br from-(--profile-accent-soft) via-app-card to-(--profile-accent-bright)/5 dark:via-[#0a2a0a] p-5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-(--profile-accent-soft) rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-(--profile-accent)" />
            <span className="text-(--profile-accent) text-xs font-bold uppercase tracking-wider">Улучшить аккаунт</span>
          </div>
          <h3 className="text-app-fg dark:text-white font-semibold text-lg mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Откройте расширенные возможности
          </h3>
          <p className="text-app-subtle dark:text-white/50 text-sm">Семейный, корпоративный или агентский пакет — выберите своё.</p>
        </div>
        <Button variant="primary" onClick={onUpgrade} className="shrink-0">
          Смотреть пакеты <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function ActivePackageBadge({ pkg }) {
  const info = PACKAGE_FEATURES[pkg]
  if (!info) return null
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-(--profile-accent-soft) border border-(--profile-accent-border)">
      <span className="text-lg leading-none">{info.icon}</span>
      <div>
        <div className="text-(--profile-accent) text-xs font-bold uppercase tracking-wide">{info.name} пакет</div>
        <div className="text-app-faint dark:text-white/40 text-[10px]">{info.price} · Активен</div>
      </div>
      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
    </div>
  )
}

function RecentLeadRow({ lead }) {
  const kindLabel = KIND_LABELS[lead.kind] || lead.kind
  const status = STATUS_META[lead.status] || { label: lead.status, variant: 'default' }
  const targetName = lead.tour_title || lead.direction_title
  const href = lead.tour_id
    ? `/tours/${lead.tour_id}`
    : lead.resort_direction_id
    ? `/directions/${lead.resort_direction_id}`
    : null

  const Row = (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-card/70 dark:bg-[#0a2a0a]/40 hover:border-(--profile-accent)/40 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center shrink-0">
        <ClipboardList className="w-4 h-4 text-(--profile-accent)" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-app-fg dark:text-white font-medium text-sm truncate">{kindLabel}</div>
        <div className="flex items-center gap-2 mt-0.5">
          {targetName && (
            <span className="text-app-subtle dark:text-white/45 text-xs truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {targetName}
            </span>
          )}
          <Calendar className="w-3 h-3 text-app-faint dark:text-white/30 shrink-0" />
          <span className="text-app-faint dark:text-white/40 text-xs">{formatDate(lead.created_at)}</span>
        </div>
      </div>
      <Badge variant={status.variant}>{status.label}</Badge>
    </div>
  )

  return href ? <Link href={href}>{Row}</Link> : Row
}

export function Dashboard({ user, onNavigate }) {
  const [recent, setRecent] = useState(null)
  const [stats, setStats] = useState({ leads: 0, favorites: 0, reviews: 0 })

  useEffect(() => {
    fetch('/api/leads/my?limit=3', { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ leads }) => setRecent(leads ?? []))
      .catch(() => setRecent([]))

    Promise.all([
      fetch('/api/leads/my', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ leads: [] })),
      fetch('/api/favorites', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ favorites: [] })),
      fetch('/api/reviews?my=true', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ reviews: [] })),
    ]).then(([l, f, r]) => {
      setStats({
        leads: l.leads?.length ?? 0,
        favorites: f.favorites?.length ?? 0,
        reviews: r.reviews?.length ?? 0,
      })
    })
  }, [])

  const displayName = fullName(user)
  const hasPhone = Boolean(user.phone?.trim())
  const hasCity = Boolean(user.city?.trim())
  const profileIncomplete = !hasPhone || !hasCity

  return (
    <div className="space-y-6">
      {/* Profile hero */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <Avatar src={user.image} name={displayName} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-app-card dark:border-[#061506]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-app-fg dark:text-white font-bold text-2xl mb-1.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {displayName}
            </h2>

            {/* Контактные данные: телефон и город */}
            <div className="flex flex-col gap-1.5 mb-3">
              {/* Телефон */}
              {hasPhone ? (
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Phone className="w-3.5 h-3.5 text-app-faint dark:text-white/35 shrink-0" />
                  <span className="text-app-subtle dark:text-white/45 text-sm">{user.phone}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 justify-center sm:justify-start text-red-500 dark:text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-medium">Номер контакта не указан</span>
                </div>
              )}

              {/* Город */}
              {hasCity ? (
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPinned className="w-3.5 h-3.5 text-app-faint dark:text-white/35 shrink-0" />
                  <span className="text-app-subtle dark:text-white/45 text-sm">{user.city}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 justify-center sm:justify-start text-red-500 dark:text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-medium">Город не указан</span>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="text-app-subtle dark:text-white/50 text-sm leading-relaxed max-w-md mb-4">{user.bio}</p>
            )}
            {user.pocket_type && <ActivePackageBadge pkg={user.pocket_type} />}
          </div>
          <div className="relative shrink-0">
            <Button variant="secondary" onClick={() => onNavigate('edit')}>
              Редактировать
            </Button>
            {profileIncomplete && (
              <span
                className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-red-500 ring-2 ring-app-card dark:ring-[#061506]"
                title="Профиль заполнен не полностью"
              >
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
              </span>
            )}
          </div>
        </CardBody>
      </Card>

      {!user.pocket_type && <UpgradeBanner onUpgrade={() => onNavigate('packages')} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={ClipboardList} label="Заявок" value={stats.leads} color="gold" />
        <StatCard icon={Heart} label="Избранное" value={stats.favorites} color="green" />
        <StatCard icon={Star} label="Отзывов" value={stats.reviews} color="amber" />
      </div>

      {/* Recent requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-app-muted dark:text-white/70 text-sm font-medium uppercase tracking-wider">Последние заявки</h3>
          <button onClick={() => onNavigate('requests')} className="text-(--profile-accent) text-xs hover:underline flex items-center gap-1">
            Все <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {recent === null ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-app-subtle dark:text-white/45 text-sm border border-dashed border-app-border rounded-2xl p-6 text-center">
            Заявок пока нет. Отправьте заявку на тур или направление — она появится здесь.
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((lead) => <RecentLeadRow key={lead.id} lead={lead} />)}
          </div>
        )}
      </div>
    </div>
  )
}
