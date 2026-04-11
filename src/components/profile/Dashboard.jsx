'use client'
import { Plane, Heart, MessageSquare, Star, ChevronRight, Zap, Calendar, MapPin } from 'lucide-react'
import { Card, CardBody, Avatar, Badge, Button, StatCard, Divider } from './ui'
import { PACKAGE_FEATURES, MOCK_TRIPS } from '../../lib/mockData'
import Image from 'next/image'

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
          <h3 className="text-white font-semibold text-lg mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Откройте расширенные возможности
          </h3>
          <p className="text-white/50 text-sm">Семейный, корпоративный или агентский пакет — выберите своё.</p>
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
        <div className="text-white/40 text-[10px]">{info.price} · Активен</div>
      </div>
      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
    </div>
  )
}

function RecentTripCard({ trip }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#1a6b1a]/15 bg-[#0a2a0a]/40 hover:border-[#1a6b1a]/30 transition-colors cursor-pointer group">
      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative">
        <Image
          src={trip.img}
          alt={trip.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium text-sm truncate">{trip.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <Calendar className="w-3 h-3 text-white/30" />
          <span className="text-white/40 text-xs">{trip.date}</span>
          <span className="text-white/25 text-xs">·</span>
          <span className="text-white/40 text-xs">{trip.duration}</span>
        </div>
      </div>
      <Badge variant={trip.status === 'active' ? 'active' : 'completed'}>
        {trip.status === 'active' ? 'Активен' : 'Завершён'}
      </Badge>
    </div>
  )
}

export function Dashboard({ user, onNavigate }) {
  const recent = MOCK_TRIPS.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Profile hero */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <Avatar src={user.avatar} name={user.name} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-[#061506]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-white font-bold text-2xl mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {user.name}
            </h2>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-2">
              <MapPin className="w-3.5 h-3.5 text-white/35" />
              <span className="text-white/45 text-sm">{user.city}, {user.country}</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-4">{user.bio}</p>
            {user.activePackage && <ActivePackageBadge pkg={user.activePackage} />}
          </div>
          <Button variant="secondary" onClick={() => onNavigate('edit')} className="shrink-0">
            Редактировать
          </Button>
        </CardBody>
      </Card>

      {/* Upgrade banner if no package */}
      {!user.activePackage && <UpgradeBanner onUpgrade={() => onNavigate('packages')} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Plane} label="Поездок" value="5" color="gold" />
        <StatCard icon={Heart} label="Избранное" value="4" color="green" />
        <StatCard icon={Star} label="Отзывов" value="3" color="amber" />
      </div>

      {/* Recent trips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider">Последние поездки</h3>
          <button onClick={() => onNavigate('trips')} className="text-(--profile-accent) text-xs hover:underline flex items-center gap-1">
            Все <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map(trip => <RecentTripCard key={trip.id} trip={trip} />)}
        </div>
      </div>
    </div>
  )
}
