'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_NUMBER = '77001234567' // замените на реальный номер

const QUESTIONS = [
  {
    id: 1,
    text: 'Здравствуйте! Куда вы хотите отправиться?',
    options: ['Горный курорт', 'Санаторий / лечение', 'Морской отдых', 'Экскурсионный тур'],
  },
  {
    id: 2,
    text: 'На сколько дней планируете поездку?',
    options: ['3–5 дней', '1 неделя', '2 недели', 'Более 2 недель'],
  },
  {
    id: 3,
    text: 'Сколько человек поедет?',
    options: ['1 человек', '2 человека', 'Семья с детьми', 'Группа от 5 человек'],
  },
  {
    id: 4,
    text: 'Какой бюджет на одного человека?',
    options: ['До 50 000 тг', '50 000–150 000 тг', '150 000–300 000 тг', 'Без ограничений'],
  },
  {
    id: 5,
    text: 'Когда планируете поехать?',
    options: ['В ближайшие 2 недели', 'В этом месяце', 'Через 1–2 месяца', 'Планирую заранее'],
  },
]

function buildWhatsAppMessage(answers) {
  const lines = answers.map(
    (a, i) => `${i + 1}. ${QUESTIONS[i].text}\n   → ${a}`
  )
  return encodeURIComponent(
    'Здравствуйте! Меня интересует тур.\n\n' + lines.join('\n\n')
  )
}

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0) // 0 = не начато, 1..5 = вопрос
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  const chatEndRef = useRef(null)

  // прокрутка вниз при новом шаге
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step, done])

  function handleClose() {
    setOpen(false)
  }

  function handleAnswer(option) {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)
    if (step < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  function handleReset() {
    setStep(1)
    setAnswers([])
    setDone(false)
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(answers)}`

  return (
    <>
      {/* Кнопка-триггер */}
      <button
        onClick={() => setOpen(o => { if (!o && step === 0) setStep(1); return !o })}
        aria-label="Открыть чат поддержки"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl focus:outline-none"
        style={{
          background: 'linear-gradient(135deg, var(--site-gradient-from), var(--site-gradient-to))',
          animation: open ? 'none' : 'supportPulse 2s ease-in-out infinite',
        }}
      >
        {/* иконка чата */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--site-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Окно чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: 'var(--app-card)',
              border: '1px solid var(--app-border)',
              maxHeight: '480px',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, var(--site-gradient-from), var(--site-gradient-to))',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center support-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="support-icon-svg">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none support-title">Поддержка</p>
                  <p className="text-xs mt-0.5 support-online">Онлайн</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="transition-colors support-close"
                aria-label="Закрыть"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="support-close-svg">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
              style={{ background: 'var(--app-panel)' }}
            >
              {/* Предыдущие вопросы и ответы */}
              {answers.map((answer, i) => (
                <div key={i} className="space-y-1.5">
                  {/* Вопрос (слева) */}
                  <div className="flex justify-start">
                    <div
                      className="max-w-[80%] rounded-2xl rounded-tl-sm px-3 py-2 text-sm"
                      style={{ background: 'var(--app-card)', color: 'var(--app-fg)', border: '1px solid var(--app-border)' }}
                    >
                      {QUESTIONS[i].text}
                    </div>
                  </div>
                  {/* Ответ (справа) */}
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm font-medium"
                      style={{
                        background: 'linear-gradient(135deg, var(--site-gradient-from), var(--site-gradient-to))',
                        color: 'var(--site-on-accent)',
                      }}
                    >
                      {answer}
                    </div>
                  </div>
                </div>
              ))}

              {/* Текущий вопрос */}
              {!done && step >= 1 && step <= QUESTIONS.length && (
                <div className="space-y-2">
                  <div className="flex justify-start">
                    <div
                      className="max-w-[80%] rounded-2xl rounded-tl-sm px-3 py-2 text-sm"
                      style={{ background: 'var(--app-card)', color: 'var(--app-fg)', border: '1px solid var(--app-border)' }}
                    >
                      {QUESTIONS[step - 1].text}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-1">
                    {QUESTIONS[step - 1].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="text-left text-sm px-3 py-2 rounded-xl border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: 'var(--app-card)',
                          border: '1px solid var(--app-border)',
                          color: 'var(--app-fg)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--site-accent)'
                          e.currentTarget.style.color = 'var(--site-accent)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--app-border)'
                          e.currentTarget.style.color = 'var(--app-fg)'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Завершение */}
              {done && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl rounded-tl-sm px-3 py-2 text-sm"
                    style={{ background: 'var(--app-card)', color: 'var(--app-fg)', border: '1px solid var(--app-border)' }}
                  >
                    Отлично! Мы подберём лучший вариант для вас. Перейдите в WhatsApp, чтобы получить персональное предложение.
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderTop: '1px solid var(--app-border)', background: 'var(--app-card)' }}>
              {/* <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 flex-1 justify-center py-2 px-3 rounded-xl text-sm font-medium transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Перейти в WhatsApp
              </a> */}
              {done && (
                <button
                  onClick={handleReset}
                  className="py-2 px-2.5 rounded-xl text-xs transition-colors ml-auto"
                  style={{ color: 'var(--app-subtle)', background: 'var(--app-panel)' }}
                  title="Начать заново"
                >
                  ↺
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes supportPulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--site-shadow-soft), 0 4px 20px var(--site-shadow-strong); }
          50% { box-shadow: 0 0 0 10px transparent, 0 4px 20px var(--site-shadow-strong); }
        }
        .support-title { color: #ffffff; }
        .dark .support-title { color: #22c55e; }
        .support-online { color: rgba(255,255,255,0.7); }
        .dark .support-online { color: #22c55e; }
        .support-icon-svg { stroke: white; }
        .dark .support-icon-svg { stroke: #22c55e; }
        .support-close { color: rgba(255,255,255,0.7); }
        .support-close:hover { color: white; }
        .dark .support-close { color: #22c55e; }
        .dark .support-close:hover { color: #4ade80; }
        .support-close-svg { stroke: currentColor; }
      `}</style>
    </>
  )
}
