'use client'
import { useState, useEffect } from 'react'
import { Star, MessageSquare, Edit2, Trash2, Check, MapPin, ExternalLink, Clock, AlertCircle } from 'lucide-react'
import { Card, CardBody, Badge, Button, SectionHeader, EmptyState, Modal, Textarea, Toast, cn } from './ui'
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

const STATUS_BADGE = {
  pending: { variant: 'pending',  label: 'На модерации' },
  visible: { variant: 'active',   label: 'Опубликован' },
  hidden:  { variant: 'inactive', label: 'Скрыт' },
}

function ReviewCard({ review, onEdit, onDelete }) {
  const status = STATUS_BADGE[review.status] || null
  return (
    <Card>
      <CardBody>
        <div className="flex items-start gap-4">
          <div className="relative shrink-0 w-16 aspect-video rounded-xl overflow-hidden">
            <Image
              src={review.hero_image || REVIEW_FALLBACK_IMG}
              alt={review.resort_name}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="text-white font-semibold text-sm truncate">{review.resort_name}</h4>
                <Link
                  href={`/tours/${review.resort_id}`}
                  className="shrink-0 w-4 h-4 text-white/30 hover:text-(--profile-accent) transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex gap-1.5 shrink-0 items-center">
                {status && <Badge variant={status.variant}>{status.label}</Badge>}
                {/* Опубликованный отзыв уже на сайте — править и удалять его нельзя. */}
                {review.status !== 'visible' && (
                  <>
                    <button onClick={() => onEdit(review)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-(--profile-accent) hover:bg-(--profile-accent-soft) transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(review.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
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
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{review.text}</p>
            {review.status === 'hidden' && review.rejection_reason && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <span className="font-semibold">Причина скрытия:</span> {review.rejection_reason}
              </div>
            )}
            {review.reply && (
              <div className="mt-3 ml-3 pl-3 border-l-2 border-(--profile-accent)/40">
                <div className="text-(--profile-accent) text-[11px] font-semibold uppercase tracking-wider mb-1">
                  Ответ организатора · {formatReviewDate(review.reply_at)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{review.reply}</p>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function Reviews() {
  const [reviews, setReviews] = useState(null)
  const [eligible, setEligible] = useState([])
  const [editModal, setEditModal] = useState(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(5)
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState(false)
  const [createModal, setCreateModal] = useState(null) // null | { lead_id, tour_title, ... }
  const [createText, setCreateText] = useState('')
  const [createRating, setCreateRating] = useState(5)
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  function reload() {
    Promise.all([
      fetch('/api/reviews?my=true').then(r => r.json()).catch(() => ({ reviews: [] })),
      fetch('/api/reviews/eligible').then(r => r.json()).catch(() => ({ eligible: [] })),
    ]).then(([rev, el]) => {
      setReviews(Array.isArray(rev?.reviews) ? rev.reviews : [])
      setEligible(Array.isArray(el?.eligible) ? el.eligible : [])
    })
  }

  useEffect(() => { reload() }, [])

  function openEdit(rev) {
    setEditModal(rev)
    setEditText(rev.text)
    setEditRating(rev.rating)
    setEditError('')
  }

  async function saveEdit() {
    if (!editModal || saving) return
    const trimmed = editText.trim()
    if (trimmed.length < 10) { setEditError('Минимум 10 символов'); return }
    if (trimmed.length > 2000) { setEditError('Максимум 2000 символов'); return }
    setSaving(true)
    setEditError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editModal.id, rating: editRating, text: trimmed }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setEditError(body?.error || 'Не удалось сохранить')
        return
      }
      setReviews(prev => prev.map(r => r.id === editModal.id
        ? { ...r, text: trimmed, rating: editRating, status: 'pending', rejection_reason: null }
        : r))
      setEditModal(null)
    } finally {
      setSaving(false)
    }
  }

  async function deleteReview(id) {
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' }).catch(() => {})
    setReviews(prev => prev.filter(r => r.id !== id))
    // освободили заявку — может появиться обратно в eligible
    reload()
  }

  function openCreate(item) {
    setCreateModal(item)
    setCreateText('')
    setCreateRating(5)
    setCreateError('')
  }

  async function submitCreate() {
    if (!createModal || creating) return
    const trimmed = createText.trim()
    if (trimmed.length < 10) { setCreateError('Минимум 10 символов'); return }
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: createModal.lead_id, rating: createRating, text: trimmed }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCreateError(body?.error || 'Не удалось отправить')
        return
      }
      setCreateModal(null)
      reload()
    } finally {
      setCreating(false)
    }
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

      {eligible.length > 0 && (
        <div className="rounded-2xl border border-(--profile-accent)/30 bg-(--profile-accent-soft) p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-(--profile-accent)/15 border border-(--profile-accent-border) flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-(--profile-accent)" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold mb-1">
                Расскажите о {eligible.length === 1 ? 'поездке' : 'поездках'}
              </div>
              <div className="text-white/60 text-xs mb-3">
                {eligible.length === 1
                  ? 'Вы завершили один тур и ещё не оставили отзыв.'
                  : `У вас ${eligible.length} завершённых тура без отзыва.`}
              </div>
              <div className="flex flex-wrap gap-2">
                {eligible.map(item => (
                  <button
                    key={item.lead_id}
                    onClick={() => openCreate(item)}
                    className="px-3 py-1.5 rounded-full bg-(--profile-accent) text-(--profile-on-accent, #052e05) text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    + {item.tour_title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0
        ? <EmptyState
            icon={MessageSquare}
            title="Отзывов пока нет"
            subtitle={
              eligible.length > 0
                ? 'Нажмите на тур выше, чтобы оставить первый отзыв'
                : 'Отзыв можно оставить после завершения тура'
            }
          />
        : <div className="space-y-3">{reviews.map(r => <ReviewCard key={r.id} review={r} onEdit={openEdit} onDelete={deleteReview} />)}</div>
      }

      {/* Edit modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Редактировать отзыв">
        <div className="space-y-4">
          <div className="text-white/50 text-xs">
            После редактирования отзыв снова пройдёт модерацию.
          </div>
          <div>
            <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Оценка</div>
            <StarRating value={editRating} onChange={setEditRating} />
          </div>
          <Textarea label="Текст отзыва" value={editText} onChange={e => setEditText(e.target.value)} rows={5} maxLength={2000} />
          {editError && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">{editError}</p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setEditModal(null)}>Отмена</Button>
            <Button variant="primary" onClick={saveEdit} disabled={saving}>
              <Check className="w-4 h-4" />{saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create modal */}
      <Modal open={!!createModal} onClose={() => setCreateModal(null)} title={createModal ? `Отзыв о туре «${createModal.tour_title}»` : 'Новый отзыв'}>
        <div className="space-y-4">
          <div className="text-white/50 text-xs">
            Отзыв появится на странице тура после проверки модератором.
          </div>
          <div>
            <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Оценка</div>
            <StarRating value={createRating} onChange={setCreateRating} />
          </div>
          <Textarea
            label="Текст отзыва"
            value={createText}
            onChange={e => setCreateText(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Что понравилось? Что можно улучшить? (минимум 10 символов)"
          />
          {createError && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">{createError}</p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setCreateModal(null)}>Отмена</Button>
            <Button variant="primary" onClick={submitCreate} disabled={creating}>
              <Check className="w-4 h-4" />{creating ? 'Отправляем…' : 'Отправить'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
// Правила смены пакета (зеркалит сервер /api/package-applications):
//   - нет пакета → доступны все;
//   - family → можно только agent (corporate недоступен);
//   - agent / corporate → финальные, ничего больше купить нельзя.
function canApplyForPackage(current, target) {
  if (!current) return true
  if (current === target) return false
  if (current === 'agent' || current === 'corporate') return false
  if (current === 'family') return target === 'agent'
  return true
}

function PackageCard({ pkgKey, info, isActive, pendingType, activePackage, onApply, submitting }) {
  const colorMap = {
    emerald: { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/25', text: 'text-emerald-400', btn: 'bg-emerald-500 text-white hover:bg-emerald-400' },
    blue:    { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/25', text: 'text-blue-400', btn: 'bg-blue-500 text-white hover:bg-blue-400' },
    amber:   { bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/25', text: 'text-amber-400', btn: 'bg-amber-500 text-white hover:bg-amber-400' },
  }
  const c = colorMap[info.color]
  const isPending = pendingType === pkgKey
  const blocked = !canApplyForPackage(activePackage, pkgKey)

  let label, disabled
  if (isActive) { label = 'Текущий пакет'; disabled = true }
  else if (isPending) { label = 'Заявка на проверке'; disabled = true }
  else if (pendingType) { label = 'У вас уже есть заявка'; disabled = true }
  else if (blocked) { label = 'Недоступно'; disabled = true }
  else { label = submitting ? 'Отправляем…' : 'Отправить заявку'; disabled = !!submitting }

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
      {isPending && !isActive && (
        <div className="absolute top-3 right-3">
          <Badge variant="pending">На проверке</Badge>
        </div>
      )}
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl leading-none">{info.icon}</span>
          <h3 className="text-app-fg dark:text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{info.name}</h3>
        </div>
        {info.subtitle && (
          <div className={cn('text-sm font-semibold', c.text)}>{info.subtitle}</div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-1.5 flex-1">
        {info.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-app-subtle dark:text-white/60">
            <Check className={cn('w-4 h-4 shrink-0 mt-0.5', c.text)} />
            {f}
          </li>
        ))}
      </ul>

      {/* Реферальная программа (агент) */}
      {info.referral && (
        <div className={cn('rounded-xl border bg-white/5 dark:bg-white/5 p-3 flex items-start gap-3', c.border)}>
          <div className={cn('shrink-0 rounded-lg px-2.5 py-1 text-base font-bold', c.btn)}>{info.referral.percent}</div>
          <p className="text-xs text-app-subtle dark:text-white/60 leading-snug">{info.referral.text}</p>
        </div>
      )}

      {/* Годовая подписка + подвал */}
      <div>
        <div className="text-center text-app-faint dark:text-white/40 text-xs mb-2">Годовая подписка</div>
        {info.footer && (
          <div className="flex flex-col gap-1.5">
            {[info.footer.people, info.footer.price, info.footer.discount].map((cell, i) => (
              <div key={i} className={cn('rounded-lg px-3 py-2 text-center text-sm font-semibold leading-tight', c.btn)}>
                {cell}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => onApply(pkgKey)}
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
          disabled ? 'bg-white/10 text-app-faint dark:text-white/50 cursor-not-allowed' : c.btn,
        )}
        disabled={disabled}
      >
        {label}
      </button>
    </div>
  )
}

export function PackagesSection({ user }) {
  const activePackage = user?.pocket_type ?? null
  const [pending, setPending] = useState(null) // { type, created_at } | null
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2800)
  }

  useEffect(() => {
    let alive = true
    fetch('/api/package-applications/my', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return
        setPending(data.pending ?? null)
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  async function apply(pkgKey) {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/package-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: pkgKey }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Не удалось отправить заявку', 'error')
        return
      }
      setPending({ type: pkgKey, created_at: data.application?.created_at ?? new Date().toISOString() })
      showToast('Заявка отправлена. Админ свяжется с вами для подтверждения.', 'success')
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Пакеты и подписки"
        subtitle="Выберите пакет — заявку подтверждает админ"
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm shadow-lg">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {pending && !activePackage && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-0.5">
              Заявка на {PACKAGE_FEATURES[pending.type]?.name?.toLowerCase() ?? pending.type} пакет на рассмотрении
            </div>
            <div className="opacity-80">Админ подтвердит подписку, после чего пакет станет активным.</div>
          </div>
        </div>
      )}

      {activePackage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">
              Активен {PACKAGE_FEATURES[activePackage]?.name?.toLowerCase() ?? activePackage} пакет
            </div>
            <div className="opacity-80">Чтобы сменить пакет — обратитесь в поддержку.</div>
          </div>
        </div>
      )}

      {/* Package cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {Object.entries(PACKAGE_FEATURES).map(([key, info]) => (
          <PackageCard
            key={key}
            pkgKey={key}
            info={info}
            isActive={activePackage === key}
            pendingType={pending?.type ?? null}
            activePackage={activePackage}
            onApply={apply}
            submitting={submitting || loading}
          />
        ))}
      </div>

    </div>
  )
}
