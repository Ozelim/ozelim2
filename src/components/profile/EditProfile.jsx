'use client'
import { useState, useRef } from 'react'
import { User, Mail, Phone, Lock, Eye, EyeOff, Camera, Save, Check } from 'lucide-react'
import { Button, Input, Textarea, Avatar, Card, CardHeader, CardBody, SectionHeader, Toast, Divider, cn } from './ui'

function AvatarUpload({ src, name }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(src)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
        <Avatar src={preview} name={name} size="xl" />
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity media-contrast">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
        <Camera className="w-3.5 h-3.5" />
        Загрузить фото
      </Button>
      <p className="text-white/30 text-xs text-center">JPG, PNG, GIF · до 5 МБ</p>
    </div>
  )
}

export function EditProfile({ user, onBack }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    country: user.country,
    bio: user.bio,
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, newPass: false, confirm: false })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [saved, setSaved] = useState(false)

  function setF(key, val) { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })) }
  function setP(key, val) { setPasswords(p => ({ ...p, [key]: val })); setErrors(e => ({ ...e, [key]: '' })) }

  function validateProfile() {
    const e = {}
    if (!form.name.trim()) e.name = 'Имя обязательно'
    if (!form.email.includes('@')) e.email = 'Введите корректный email'
    if (form.phone && !/^\+/.test(form.phone)) e.phone = 'Формат: +7 XXX XXX XX XX'
    return e
  }

  function validatePassword() {
    const e = {}
    if (!passwords.current) e.current = 'Введите текущий пароль'
    if (passwords.newPass.length < 8) e.newPass = 'Минимум 8 символов'
    if (passwords.newPass !== passwords.confirm) e.confirm = 'Пароли не совпадают'
    return e
  }

  function handleSaveProfile() {
    const e = validateProfile()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaved(true)
    setToast({ message: 'Профиль успешно сохранён', type: 'success' })
    setTimeout(() => setSaved(false), 3000)
  }

  function handleChangePassword() {
    const e = validatePassword()
    if (Object.keys(e).length) { setErrors(e); return }
    setPasswords({ current: '', newPass: '', confirm: '' })
    setToast({ message: 'Пароль успешно изменён', type: 'success' })
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Редактирование профиля" subtitle="Обновите ваши личные данные и настройки безопасности" />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Avatar + Personal info */}
      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        {/* Avatar */}
        <Card className="p-6 flex flex-col items-center justify-center min-w-[200px]">
          <AvatarUpload src={user.avatar} name={user.name} />
        </Card>

        {/* Personal data */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-(--profile-accent)" />
                <span className="text-white font-medium text-sm">Личные данные</span>
              </div>
              <Button variant="secondary" size="sm" onClick={onBack}>
                Назад
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Полное имя" icon={User} value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} placeholder="Ваше имя" />
              <Input label="Email" icon={Mail} value={form.email} onChange={e => setF('email', e.target.value)} error={errors.email} type="email" placeholder="email@example.kz" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Телефон" icon={Phone} value={form.phone} onChange={e => setF('phone', e.target.value)} error={errors.phone} placeholder="+7 777 000 00 00" />
              <Input label="Город" value={form.city} onChange={e => setF('city', e.target.value)} placeholder="Алматы" />
            </div>
            <Textarea label="О себе" value={form.bio} onChange={e => setF('bio', e.target.value)} rows={3} placeholder="Расскажите немного о себе..." />
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveProfile}>
                {saved ? <><Check className="w-4 h-4" /> Сохранено</> : <><Save className="w-4 h-4" /> Сохранить изменения</>}
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
            <span className="text-white font-medium text-sm">Смена пароля</span>
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
                  className="absolute right-3 top-[34px] text-white/30 hover:text-white/60 transition-colors"
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
              <span className="text-xs text-white/40">
                {passwords.newPass.length < 6 ? 'Слабый' : passwords.newPass.length < 10 ? 'Средний' : 'Надёжный'}
              </span>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleChangePassword}>
              <Lock className="w-4 h-4" />
              Изменить пароль
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
