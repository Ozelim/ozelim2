'use client'
import { useState, useEffect } from 'react'
import { Star, MessageSquare, Edit2, Trash2, Check, X, Zap, MapPin, ExternalLink } from 'lucide-react'
import { Card, CardBody, Badge, Button, SectionHeader, EmptyState, Modal, Textarea, cn } from './ui'
import { PACKAGE_FEATURES } from '../../lib/mockData'
import Image from 'next/image'
import Link from 'next/link'

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
const REVIEW_FALLBACK_IMG = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=75";

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className={(hover || value) >= i ? 'text-(--profile-accent)' : 'text-app-faint'}
        >
          <Star className="w-5 h-5 transition-colors" fill={(hover || value) >= i ? 'currentColor' : 'none'} stroke="currentColor" />
        </button>
      ))}
    </div>
  )
}

function formatReviewDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ReviewCard({ review, onEdit, onDelete }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start gap-4">
          <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden">
            <Image
              src={review.hero_image || REVIEW_FALLBACK_IMG}
              alt={review.resort_name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="text-white font-semibold text-sm truncate">{review.resort_name}</h4>
                <Link
                  href={`/resort/${review.resort_id}`}
                  className="shrink-0 w-4 h-4 text-white/30 hover:text-(--profile-accent) transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => onEdit(review)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-(--profile-accent) hover:bg-(--profile-accent-soft) transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDelete(review.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={cn('w-3 h-3', i <= review.rating ? 'text-(--profile-accent)' : 'text-app-faint')} fill={i <= review.rating ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/35 text-xs">{formatReviewDate(review.created_at)}</span>
            </div>
            {review.location && (
              <div className="flex items-center gap-1 text-white/35 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                {review.location}
              </div>
            )}
            <p className="text-white/60 text-sm leading-relaxed">{review.text}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function Reviews() {
  const [reviews, setReviews] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(5)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/reviews?my=true')
      .then(r => r.json())
      .then(({ reviews: rv }) => setReviews(rv ?? []))
      .catch(() => setReviews([]))
  }, [])

  function openEdit(rev) { setEditModal(rev); setEditText(rev.text); setEditRating(rev.rating) }

  async function saveEdit() {
    if (!editModal || saving) return
    setSaving(true)
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resort_id: editModal.resort_id, rating: editRating, text: editText }),
      })
      setReviews(prev => prev.map(r => r.id === editModal.id ? { ...r, text: editText, rating: editRating } : r))
      setEditModal(null)
    } catch {
      // silently ignore
    } finally {
      setSaving(false)
    }
  }

  async function deleteReview(id) {
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' }).catch(() => {})
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  if (reviews === null) {
    return (
      <div className="space-y-5">
        <SectionHeader title="Мои отзывы" subtitle="Загрузка..." />
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const subtitle = reviews.length === 0 ? 'Нет отзывов'
    : reviews.length === 1 ? '1 отзыв'
    : `${reviews.length} отзыв${reviews.length < 5 ? 'а' : 'ов'}`

  return (
    <div className="space-y-5">
      <SectionHeader title="Мои отзывы" subtitle={subtitle} />
      {reviews.length === 0
        ? <EmptyState icon={MessageSquare} title="Отзывов пока нет" subtitle="Нажмите «Оставить отзыв» на странице курорта, чтобы добавить первый" />
        : <div className="space-y-3">{reviews.map(r => <ReviewCard key={r.id} review={r} onEdit={openEdit} onDelete={deleteReview} />)}</div>
      }

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Редактировать отзыв">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Оценка</div>
            <StarRating value={editRating} onChange={setEditRating} />
          </div>
          <Textarea label="Текст отзыва" value={editText} onChange={e => setEditText(e.target.value)} rows={5} />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setEditModal(null)}>Отмена</Button>
            <Button variant="primary" onClick={saveEdit} disabled={saving}>
              <Check className="w-4 h-4" />{saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
const COMPARISON_FEATURES = [
  { label: 'Участников', family: 'до 5', corporate: 'до 20', agent: '1 агент' },
  { label: 'Скидка на туры', family: '15%', corporate: '20%', agent: 'B2B цены' },
  { label: 'Реферальная программа', family: '—', corporate: '—', agent: '8% комиссия' },
  { label: 'Приоритетная поддержка', family: '✓', corporate: '✓', agent: '✓' },
  { label: 'Менеджер аккаунта', family: '—', corporate: '✓', agent: '—' },
  { label: 'Корпоративные туры', family: '—', corporate: '✓', agent: '—' },
]

function PackageCard({ pkgKey, info, isActive, onSelect }) {
  const colorMap = {
    emerald: { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/25', text: 'text-emerald-400', btn: 'bg-emerald-500 text-white hover:bg-emerald-400' },
    blue:    { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/25', text: 'text-blue-400', btn: 'bg-blue-500 text-white hover:bg-blue-400' },
    amber:   { bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/25', text: 'text-amber-400', btn: 'bg-amber-500 text-white hover:bg-amber-400' },
  }
  const c = colorMap[info.color]

  return (
    <div className={cn(
      'relative rounded-2xl border bg-linear-to-br p-5 flex flex-col gap-4 transition-all duration-300',
      c.bg, c.border,
      isActive && 'ring-2 ring-(--profile-accent)/40',
    )}>
      {isActive && (
        <div className="absolute top-3 right-3">
          <Badge variant="gold">Активен</Badge>
        </div>
      )}
      <div className="text-3xl">{info.icon}</div>
      <div>
        <h3 className="text-white font-bold text-xl mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{info.name}</h3>
        <div className={cn('text-lg font-bold', c.text)}>{info.price}</div>
      </div>
      <ul className="space-y-1.5 flex-1">
        {info.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/60">
            <Check className={cn('w-4 h-4 shrink-0', c.text)} />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(pkgKey)}
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
          isActive ? 'bg-white/10 text-white/50 cursor-default' : c.btn,
        )}
        disabled={isActive}
      >
        {isActive ? 'Текущий пакет' : 'Выбрать'}
      </button>
    </div>
  )
}

export function PackagesSection({ activePackage, onSelectPackage }) {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Пакеты и подписки"
        subtitle="Выберите пакет, который подходит именно вам"
      />

      {/* Package cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {Object.entries(PACKAGE_FEATURES).map(([key, info]) => (
          <PackageCard key={key} pkgKey={key} info={info} isActive={activePackage === key} onSelect={onSelectPackage} />
        ))}
      </div>

      {/* Comparison table */}
      <div>
        <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Сравнение пакетов</h3>
        <div className="rounded-2xl border border-[#1a6b1a]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a6b1a]/20 bg-[#0a2a0a]/60">
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide w-1/2">Возможность</th>
                  <th className="text-center px-4 py-3 text-emerald-400 font-medium text-xs">👨‍👩‍👧‍👦 Семейный</th>
                  <th className="text-center px-4 py-3 text-blue-400 font-medium text-xs">🏢 Корпоративный</th>
                  <th className="text-center px-4 py-3 text-amber-400 font-medium text-xs">🤝 Агентский</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={row.label} className={cn('border-b border-[#1a6b1a]/10', i % 2 === 0 ? 'bg-transparent' : 'bg-[#0a2a0a]/20')}>
                    <td className="px-4 py-3 text-white/60">{row.label}</td>
                    {[row.family, row.corporate, row.agent].map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        {val === '✓' ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          : val === '—' ? <X className="w-4 h-4 text-white/20 mx-auto" />
                          : <span className="text-white/70 text-xs">{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
