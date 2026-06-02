'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Check, Info, Camera, Trash2, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardBody, SectionHeader, Toast, cn } from './ui'
import { compressAvatar } from '@/lib/compress-avatar'

// Детерминированный hue по строке — у одного имени всегда один и тот же цвет.
function hueFromString(str) {
  let hash = 0
  for (let i = 0; i < (str || '').length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return hash % 360
}

function initialsFrom(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Monogram({ name, src, size = 'xl' }) {
  const sizes = {
    md: { box: 'w-12 h-12', px: 48, text: 'text-base' },
    lg: { box: 'w-20 h-20', px: 80, text: 'text-2xl' },
    xl: { box: 'w-28 h-28', px: 112, text: 'text-4xl' },
  }
  const s = sizes[size] ?? sizes.xl

  if (src) {
    return (
      <Image
        src={src}
        alt={`Аватар ${name || ''}`}
        width={s.px}
        height={s.px}
        className={cn(
          'rounded-full object-cover shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-2 ring-white/10 select-none',
          s.box,
        )}
      />
    )
  }

  const hue = hueFromString(name)
  const bg = `linear-gradient(135deg, hsl(${hue} 70% 55%) 0%, hsl(${(hue + 45) % 360} 65% 38%) 100%)`
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-2 ring-white/10 select-none',
        s.box, s.text,
      )}
      style={{ background: bg, fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
      aria-label={`Аватар ${name || ''}`}
    >
      {initialsFrom(name)}
    </div>
  )
}

export function EditProfile({ user, onBack, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name ?? '',
    surname: user.surname ?? '',
    phone: user.phone ?? '',
    city: user.city ?? '',
    bio: user.bio ?? '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, newPass: false, confirm: false })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [savedPassword, setSavedPassword] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const avatarInputRef = useRef(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleAvatarFile(e) {
    const file = e.target.files?.[0]
    if (avatarInputRef.current) avatarInputRef.current.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Можно загрузить только изображение', 'error')
      return
    }
    setAvatarBusy(true)
    try {
      const compressed = await compressAvatar(file)
      const fd = new FormData()
      fd.append('file', compressed, compressed.name || 'avatar.webp')
      const res = await fetch('/api/users/me/avatar', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        showToast(data.error || 'Не удалось загрузить фото', 'error')
        return
      }
      onUpdated?.(data.user)
      showToast('Фото профиля обновлено', 'success')
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setAvatarBusy(false)
    }
  }

  async function handleRemoveAvatar() {
    setAvatarBusy(true)
    try {
      const res = await fetch('/api/users/me/avatar', { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        showToast(data.error || 'Не удалось удалить фото', 'error')
        return
      }
      onUpdated?.(data.user)
      showToast('Фото профиля удалено', 'success')
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setAvatarBusy(false)
    }
  }

  function setF(key, val) { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })) }
  function setP(key, val) { setPasswords(p => ({ ...p, [key]: val })); setErrors(e => ({ ...e, [key]: '' })) }

  function validateProfile() {
    const e = {}
    if (!form.name.trim()) e.name = 'Имя обязательно'
    if (form.phone && !/^\+?[\d\s()-]{7,40}$/.test(form.phone.trim())) {
      e.phone = 'Формат: +7 XXX XXX XX XX'
    }
    return e
  }

  function validatePassword() {
    const e = {}
    if (!passwords.current) e.current = 'Введите текущий пароль'
    if (passwords.newPass.length < 8) e.newPass = 'Минимум 8 символов'
    if (passwords.newPass !== passwords.confirm) e.confirm = 'Пароли не совпадают'
    return e
  }

  async function handleSaveProfile() {
    const e = validateProfile()
    if (Object.keys(e).length) { setErrors(e); return }
    setSavingProfile(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          phone: form.phone,
          city: form.city,
          bio: form.bio,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Не удалось сохранить', 'error')
        return
      }
      onUpdated?.(data.user)
      setSavedProfile(true)
      showToast('Профиль сохранён', 'success')
      setTimeout(() => setSavedProfile(false), 2200)
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword() {
    const e = validatePassword()
    if (Object.keys(e).length) { setErrors(e); return }
    setSavingPassword(true)
    try {
      const res = await fetch('/api/users/me/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current: passwords.current,
          newPassword: passwords.newPass,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) setErrors({ current: data.error || 'Неверный пароль' })
        else showToast(data.error || 'Не удалось сменить пароль', 'error')
        return
      }
      setPasswords({ current: '', newPass: '', confirm: '' })
      setSavedPassword(true)
      showToast('Пароль изменён', 'success')
      setTimeout(() => setSavedPassword(false), 2200)
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setSavingPassword(false)
    }
  }

  const displayName = [form.name, form.surname].filter(Boolean).join(' ') || user.email

  return (
    <div className="space-y-6">
      <SectionHeader title="Редактирование профиля" subtitle="Обновите личные данные и пароль" />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm shadow-lg">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Avatar + Personal info */}
      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        {/* Avatar — загруженное фото или монограмма */}
        <Card className="p-6 flex flex-col items-center justify-center min-w-[200px] gap-3">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFile}
          />
          <button
            type="button"
            onClick={() => !avatarBusy && avatarInputRef.current?.click()}
            disabled={avatarBusy}
            className="group relative rounded-full focus:outline-none focus:ring-2 focus:ring-(--profile-accent)/45 disabled:cursor-wait"
            aria-label="Загрузить фото профиля"
          >
            <Monogram name={displayName} src={user.image} size="xl" />
            <span className="absolute inset-0 rounded-full flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
              {avatarBusy
                ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                : <Camera className="w-6 h-6 text-white" />}
            </span>
          </button>

          <div className="flex flex-col items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => avatarInputRef.current?.click()} disabled={avatarBusy}>
              {avatarBusy
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Загрузка…</>
                : <><Camera className="w-3.5 h-3.5" /> {user.image ? 'Сменить фото' : 'Загрузить фото'}</>}
            </Button>
            {user.image && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={avatarBusy}
                className="inline-flex items-center gap-1 text-xs text-app-faint dark:text-white/35 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Удалить фото
              </button>
            )}
          </div>

          <p className="text-app-subtle dark:text-white/40 text-xs text-center max-w-[180px] leading-relaxed">
            {user.image
              ? 'Изображение обрезается до квадрата 100×100'
              : <>Аватар формируется автоматически<br />из первых букв вашего имени</>}
          </p>
        </Card>

        {/* Personal data */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-(--profile-accent)" />
                <span className="text-app-fg dark:text-white font-medium text-sm">Личные данные</span>
              </div>
              <Button variant="secondary" size="sm" onClick={onBack}>
                Назад
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Имя" icon={User} value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} placeholder="Алия" />
              <Input label="Фамилия" value={form.surname} onChange={e => setF('surname', e.target.value)} error={errors.surname} placeholder="Сейткали" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Телефон" icon={Phone} value={form.phone} onChange={e => setF('phone', e.target.value)} error={errors.phone} placeholder="+7 777 000 00 00" />
              <Input label="Город" value={form.city} onChange={e => setF('city', e.target.value)} placeholder="Алматы" />
            </div>
            <div>
              <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider">Email</label>
              <div className="mt-1.5 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-app-border bg-app-card/60 text-sm text-app-muted dark:text-white/60">
                <Mail className="w-4 h-4 text-app-faint" />
                <span className="flex-1 truncate">{user.email}</span>
                <Info className="w-3.5 h-3.5 text-app-faint" title="Для смены email обратитесь в поддержку" />
              </div>
            </div>
            <Textarea label="О себе" value={form.bio} onChange={e => setF('bio', e.target.value)} rows={3} placeholder="Расскажите немного о себе..." />
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveProfile} disabled={savingProfile}>
                {savedProfile
                  ? <><Check className="w-4 h-4" /> Сохранено</>
                  : <><Save className="w-4 h-4" /> {savingProfile ? 'Сохранение…' : 'Сохранить изменения'}</>
                }
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Change password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-(--profile-accent)" />
            <span className="text-app-fg dark:text-white font-medium text-sm">Смена пароля</span>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { key: 'current', label: 'Текущий пароль' },
              { key: 'newPass', label: 'Новый пароль' },
              { key: 'confirm', label: 'Подтвердить' },
            ].map(({ key, label }) => (
              <div key={key} className="relative">
                <Input
                  label={label}
                  type={showPwd[key] ? 'text' : 'password'}
                  value={passwords[key]}
                  onChange={e => setP(key, e.target.value)}
                  error={errors[key]}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => ({ ...s, [key]: !s[key] }))}
                  className="absolute right-3 top-[34px] text-app-faint dark:text-white/30 hover:text-app-muted dark:hover:text-white/60 transition-colors"
                >
                  {showPwd[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
          {passwords.newPass && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-[#1a6b1a]/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: passwords.newPass.length < 6 ? '30%' : passwords.newPass.length < 10 ? '65%' : '100%',
                    background: passwords.newPass.length < 6 ? '#ef4444' : passwords.newPass.length < 10 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>
              <span className="text-xs text-app-subtle dark:text-white/40">
                {passwords.newPass.length < 6 ? 'Слабый' : passwords.newPass.length < 10 ? 'Средний' : 'Надёжный'}
              </span>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleChangePassword} disabled={savingPassword}>
              {savedPassword
                ? <><Check className="w-4 h-4" /> Изменено</>
                : <><Lock className="w-4 h-4" /> {savingPassword ? 'Сохранение…' : 'Изменить пароль'}</>
              }
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
