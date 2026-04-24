'use client'
import { useState, useEffect, useCallback } from 'react'
import { UserPlus, Trash2, Users, Copy, Check, BarChart2, Building2, User, Baby } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Select, Badge, Modal, SectionHeader, Avatar, EmptyState, cn, Toast } from './ui'
import { MOCK_EMPLOYEES, MOCK_AGENT_INVITES } from '../../lib/mockData'

// ─── FAMILY PACKAGE ───────────────────────────────────────────────────────────
export function FamilySection() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'adult', relation: '', age: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/family', { cache: 'no-store' })
        const data = await res.json()
        if (!alive) return
        if (!res.ok) setLoadError(data.error || 'Не удалось загрузить список')
        else setMembers(data.members || [])
      } catch {
        if (alive) setLoadError('Ошибка сети')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const adults = members.filter(m => m.type === 'adult')
  const children = members.filter(m => m.type === 'child')
  const canAddAdult = adults.length < 2
  const canAddChild = children.length < 3

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Введите имя'
    const ageNum = Number(form.age)
    if (!form.age || isNaN(ageNum) || ageNum < 0 || ageNum >= 150) e.age = 'Введите корректный возраст'
    if (form.type === 'adult' && !canAddAdult) e.type = 'Максимум 2 взрослых'
    if (form.type === 'child' && !canAddChild) e.type = 'Максимум 3 детей'
    return e
  }

  async function handleAdd() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          relation: form.relation,
          age: Number(form.age),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Не удалось добавить', 'error')
        return
      }
      setMembers(prev => [...prev, data.member])
      setForm({ name: '', type: 'adult', relation: '', age: '' })
      setErrors({})
      setModal(false)
      showToast('Участник добавлен', 'success')
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function remove(id) {
    setRemovingId(id)
    try {
      const res = await fetch(`/api/family?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Не удалось удалить', 'error')
        return
      }
      setMembers(prev => prev.filter(m => m.id !== id))
      showToast('Участник удалён', 'success')
    } catch {
      showToast('Ошибка сети', 'error')
    } finally {
      setRemovingId(null)
    }
  }

  const canAddAny = canAddAdult || canAddChild

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Семейный пакет"
        subtitle="Управление членами семьи"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModal(true)}
            disabled={loading || !canAddAny}
          >
            <UserPlus className="w-4 h-4" />
            Добавить
          </Button>
        }
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm shadow-lg">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {loadError && <Toast message={loadError} type="error" />}

      {/* Counters */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {adults.length} / 2
              </div>
              <div className="text-white/40 text-xs">Взрослых</div>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[#1a6b1a]/20 overflow-hidden">
            <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${(adults.length / 2) * 100}%` }} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center">
              <Baby className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {children.length} / 3
              </div>
              <div className="text-white/40 text-xs">Детей</div>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-[#1a6b1a]/20 overflow-hidden">
            <div className="h-full rounded-full bg-pink-400 transition-all" style={{ width: `${(children.length / 3) * 100}%` }} />
          </div>
        </Card>
      </div>

      {/* Members list */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-14 rounded-xl border border-app-border bg-app-card/40 animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Пока нет участников"
          subtitle="Добавьте членов семьи, чтобы они могли пользоваться семейным пакетом"
        />
      ) : (
        ['adult', 'child'].map(type => {
          const group = members.filter(m => m.type === type)
          if (group.length === 0) return null
          return (
            <div key={type}>
              <div className="text-white/40 text-xs uppercase tracking-widest mb-3">
                {type === 'adult' ? `Взрослые (${group.length}/2)` : `Дети (${group.length}/3)`}
              </div>
              <div className="space-y-2">
                {group.map(member => {
                  const isRemoving = removingId === member.id
                  return (
                    <Card key={member.id} className="p-3 flex items-center gap-3">
                      <Avatar name={member.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{member.name}</div>
                        <div className="text-white/40 text-xs">
                          {member.relation ? `${member.relation} · ` : ''}{member.age} лет
                        </div>
                      </div>
                      <Badge variant={type === 'adult' ? 'completed' : 'pending'}>
                        {type === 'adult' ? 'Взрослый' : 'Ребёнок'}
                      </Badge>
                      <button
                        onClick={() => remove(member.id)}
                        disabled={isRemoving}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })
      )}

      <Modal open={modal} onClose={() => { if (!submitting) setModal(false) }} title="Добавить участника">
        <div className="space-y-4">
          <Select label="Тип" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} error={errors.type}>
            <option value="adult" disabled={!canAddAdult}>Взрослый{!canAddAdult ? ' (лимит)' : ''}</option>
            <option value="child" disabled={!canAddChild}>Ребёнок{!canAddChild ? ' (лимит)' : ''}</option>
          </Select>
          <Input label="Имя и фамилия" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} placeholder="Ерлан Ахметов" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Родство" value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))} placeholder="Супруг, дочь..." />
            <Input label="Возраст" type="number" min={0} max={149} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} error={errors.age} placeholder="35" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setModal(false)} disabled={submitting}>Отмена</Button>
            <Button variant="primary" onClick={handleAdd} disabled={submitting}>
              {submitting ? 'Добавление…' : (<><UserPlus className="w-4 h-4" />Добавить</>)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── AGENT PACKAGE ────────────────────────────────────────────────────────────
export function AgentSection() {
  const [copied, setCopied] = useState(false)
  const referralLink = 'https://ozelim.kz/ref/ALIYA2024'

  function copyLink() {
    navigator.clipboard.writeText(referralLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const registered = MOCK_AGENT_INVITES.filter(i => i.status === 'registered').length

  return (
    <div className="space-y-5">
      <SectionHeader title="Агентский пакет" subtitle="Реферальная программа и приглашённые пользователи" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Приглашено', value: MOCK_AGENT_INVITES.length, color: 'text-(--profile-accent)' },
          { label: 'Зарегистрировалось', value: registered, color: 'text-emerald-400' },
          { label: 'Конверсия', value: `${Math.round((registered / MOCK_AGENT_INVITES.length) * 100)}%`, color: 'text-blue-400' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <div className={cn('text-2xl font-bold mb-1', s.color)} style={{ fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Referral link */}
      <Card>
        <CardHeader>
          <div className="text-white/60 text-xs uppercase tracking-wider">Реферальная ссылка</div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-3.5 py-2.5 rounded-xl bg-app-code-bg border border-[#1a6b1a]/20 text-[#86c986] text-sm font-mono truncate">
              {referralLink}
            </code>
            <Button variant="primary" size="sm" onClick={copyLink} className="shrink-0">
              {copied ? <><Check className="w-3.5 h-3.5" />Скопировано</> : <><Copy className="w-3.5 h-3.5" />Копировать</>}
            </Button>
          </div>
          <p className="text-white/35 text-xs mt-2">Поделитесь ссылкой — получайте 8% с каждой покупки</p>
        </CardBody>
      </Card>

      {/* Invited users */}
      <div>
        <div className="text-white/40 text-xs uppercase tracking-widest mb-3">Приглашённые пользователи</div>
        <Card>
          <div className="divide-y divide-[#1a6b1a]/10">
            {MOCK_AGENT_INVITES.map((inv, i) => (
              <div key={inv.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-full bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center text-xs text-(--profile-accent) font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{inv.name}</div>
                  <div className="text-white/35 text-xs">{inv.email}</div>
                </div>
                <div className="text-white/30 text-xs hidden sm:block">{inv.date}</div>
                <Badge variant={inv.status === 'registered' ? 'active' : 'pending'}>
                  {inv.status === 'registered' ? 'Зарегистрирован' : 'Ожидание'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── CORPORATE PACKAGE ────────────────────────────────────────────────────────
export function CorporateSection() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES)
  const [modal, setModal] = useState(false)
  const [bulkModal, setBulkModal] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [form, setForm] = useState({ name: '', email: '', dept: '' })
  const [editId, setEditId] = useState(null)
  const [errors, setErrors] = useState({})

  const canAdd = employees.length < 20

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Введите имя'
    if (!form.email.includes('@')) e.email = 'Некорректный email'
    if (!form.dept.trim()) e.dept = 'Введите отдел'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (editId) {
      setEmployees(prev => prev.map(emp => emp.id === editId ? { ...emp, ...form } : emp))
    } else {
      setEmployees(prev => [...prev, { id: Date.now(), ...form, status: 'active' }])
    }
    setForm({ name: '', email: '', dept: '' }); setErrors({}); setModal(false); setEditId(null)
  }

  function openEdit(emp) { setEditId(emp.id); setForm({ name: emp.name, email: emp.email, dept: emp.dept }); setModal(true) }
  function remove(id) { setEmployees(prev => prev.filter(e => e.id !== id)) }

  function handleBulk() {
    const lines = bulkText.split('\n').filter(l => l.trim())
    const newEmps = lines.slice(0, 20 - employees.length).map((line, i) => {
      const [name, email, dept] = line.split(',').map(s => s.trim())
      return { id: Date.now() + i, name: name || '—', email: email || '—', dept: dept || '—', status: 'active' }
    })
    setEmployees(prev => [...prev, ...newEmps])
    setBulkText(''); setBulkModal(false)
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Корпоративный пакет"
        subtitle={`${employees.length} из 20 сотрудников`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setBulkModal(true)}>Массовое добавление</Button>
            {canAdd && <Button variant="primary" size="sm" onClick={() => { setEditId(null); setForm({ name: '', email: '', dept: '' }); setModal(true) }}>
              <UserPlus className="w-4 h-4" />Добавить
            </Button>}
          </div>
        }
      />

      {/* Capacity bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs">Заполнено мест</span>
          <span className="text-white text-sm font-medium">{employees.length} / 20</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1a6b1a]/20 overflow-hidden">
          <div className="h-full rounded-full bg-linear-to-r from-(--profile-gradient-from) to-(--profile-gradient-to) transition-all" style={{ width: `${(employees.length / 20) * 100}%` }} />
        </div>
      </Card>

      {/* Employees table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a6b1a]/15 bg-[#0a2a0a]/60">
                <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">Сотрудник</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Отдел</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">Статус</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id} className={cn('border-b border-[#1a6b1a]/10 hover:bg-[#1a6b1a]/5 transition-colors', i % 2 === 0 ? '' : 'bg-[#0a2a0a]/20')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp.name} size="sm" />
                      <span className="text-white font-medium text-sm">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs hidden sm:table-cell">{emp.email}</td>
                  <td className="px-4 py-3 text-white/50 text-xs hidden md:table-cell">{emp.dept}</td>
                  <td className="px-4 py-3">
                    <Badge variant={emp.status === 'active' ? 'active' : 'inactive'}>
                      {emp.status === 'active' ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(emp)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-(--profile-accent) hover:bg-(--profile-accent-soft) transition-all">
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(emp.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit modal */}
      <Modal open={modal} onClose={() => { setModal(false); setEditId(null) }} title={editId ? 'Редактировать сотрудника' : 'Добавить сотрудника'}>
        <div className="space-y-4">
          <Input label="Имя и фамилия" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} placeholder="Асель Нурова" />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} placeholder="asel@company.kz" />
          <Input label="Отдел" value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} error={errors.dept} placeholder="Маркетинг" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => { setModal(false); setEditId(null) }}>Отмена</Button>
            <Button variant="primary" onClick={handleSave}><Check className="w-4 h-4" />{editId ? 'Сохранить' : 'Добавить'}</Button>
          </div>
        </div>
      </Modal>

      {/* Bulk modal */}
      <Modal open={bulkModal} onClose={() => setBulkModal(false)} title="Массовое добавление сотрудников">
        <div className="space-y-4">
          <p className="text-white/50 text-sm">Каждая строка: <code className="text-[#86c986] bg-app-code-bg px-1.5 py-0.5 rounded text-xs">Имя, Email, Отдел</code></p>
          <textarea
            className="w-full h-40 rounded-xl border border-[#1a6b1a]/30 bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            placeholder={'Асель Нурова, asel@company.kz, Маркетинг\nБауыржан Ахметов, baur@company.kz, Продажи'}
          />
          <p className="text-white/30 text-xs">Будет добавлено до {20 - employees.length} сотрудников из {bulkText.split('\n').filter(l => l.trim()).length} строк</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setBulkModal(false)}>Отмена</Button>
            <Button variant="primary" onClick={handleBulk}>Импортировать</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
