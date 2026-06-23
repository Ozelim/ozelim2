"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Compass, Gift } from "lucide-react";

function InputField({ label, type: initialType, id, value, onChange, icon: Icon, placeholder, error }) {
  const [show, setShow] = useState(false);
  const isPassword = initialType === "password";
  const type = isPassword ? (show ? "text" : "password") : initialType;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-(--app-subtle)">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--app-faint)" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={isPassword ? "new-password" : id}
          className={`w-full bg-(--app-input-bg) border ${
            error ? "border-red-500/60" : "border-(--app-border)"
          } rounded-2xl pl-11 pr-${isPassword ? "11" : "4"} py-3.5 text-sm text-(--app-fg) placeholder:text-(--app-faint) outline-none focus:border-(--site-accent)/60 focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all duration-200`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-(--app-faint) hover:text-(--app-subtle) transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function GoogleButton({ next = "/" }) {
  return (
    <a
      href={`/api/auth/google?next=${encodeURIComponent(next)}`}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-(--app-border) bg-(--app-input-bg) text-(--app-fg) font-semibold text-sm hover:border-(--site-accent)/60 transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      Зарегистрироваться через Google
    </a>
  );
}

const REF_COOKIE_DAYS = 30;

function readRefCookie() {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ref_code=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function writeRefCookie(code) {
  if (typeof document === "undefined") return;
  const maxAge = REF_COOKIE_DAYS * 24 * 60 * 60;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ref_code=${encodeURIComponent(code)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Куда вернуть после регистрации (например, /profile?tab=packages с главной).
  const nextRaw = searchParams.get("next") || "/";
  const safeNext = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";
  const [form, setForm] = useState({ name: "", surname: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState("");
  const [refNotice, setRefNotice] = useState("");
  // Шаг подтверждения email: "form" → ввод данных, "code" → ввод кода с почты.
  const [step, setStep] = useState("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [resending, setResending] = useState(false);
  const [resentNotice, setResentNotice] = useState("");

  // Обратный отсчёт до возможности переотправить код.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    const fromUrl = (searchParams.get("ref") || "").trim();
    if (fromUrl && /^\d{10}$/.test(fromUrl)) {
      writeRefCookie(fromUrl);
      try { localStorage.setItem("ref_code", fromUrl); } catch {}
      setRef(fromUrl);
      setRefNotice("Вы регистрируетесь по реферальной ссылке");
      return;
    }
    if (fromUrl && !/^\d{10}$/.test(fromUrl)) {
      setRefNotice("Реферальный код некорректен и будет проигнорирован");
    }
    const fromCookie = readRefCookie();
    if (fromCookie) { setRef(fromCookie); return; }
    try {
      const stored = localStorage.getItem("ref_code");
      if (stored) setRef(stored);
    } catch {}
  }, [searchParams]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Введите имя";
    if (!form.surname.trim()) e.surname = "Введите фамилию";
    if (!form.email.trim()) e.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Некорректный email";
    if (!form.password) e.password = "Введите пароль";
    else if (form.password.length < 8) e.password = "Минимум 8 символов";
    if (!form.confirm) e.confirm = "Подтвердите пароль";
    else if (form.password !== form.confirm) e.confirm = "Пароли не совпадают";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          email: form.email,
          password: form.password,
          ref: ref || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error); return; }
      if (data.refInvalid) {
        setRefNotice("Реферальный код не найден — регистрация продолжится без него");
      }
      // Аккаунт ещё не создан — переходим к вводу кода с почты.
      setPendingEmail(data.email || form.email.toLowerCase().trim());
      setCode("");
      setCodeError("");
      setStep("code");
      setResendIn(60);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) { setCodeError("Введите 6-значный код"); return; }
    setCodeError("");
    setResentNotice("");
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error);
        if (data.expired) setStep("form"); // pending протух — назад к форме
        return;
      }
      try { localStorage.removeItem("ref_code"); } catch {}
      router.push(safeNext);
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (resendIn > 0 || resending) return;
    setResending(true);
    setCodeError("");
    setResentNotice("");
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error);
        if (data.retryAfter) setResendIn(data.retryAfter);
        if (data.expired) setStep("form");
        return;
      }
      setResentNotice("Новый код отправлен на почту");
      setResendIn(60);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80')" }}
      />
      <div className="absolute inset-0 bg-app-bg/80 backdrop-blur-sm" />

      {/* Декоративные кружки */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-(--site-accent)/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-(--site-accent)/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-(--app-border) bg-(--app-card)/80 backdrop-blur-xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-(--site-accent) to-(--site-accent-bright) flex items-center justify-center shadow-[0_4px_16px_var(--site-shadow-soft)]">
              <Compass className="w-5 h-5 text-(--site-on-accent)" />
            </div>
            <span
              className="text-xl font-bold text-(--app-fg)"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              OzElim
            </span>
          </div>

          {step === "code" ? (
          <div>
            {/* Heading */}
            <div className="text-center mb-8">
              <h1
                className="text-3xl font-bold text-(--app-fg) mb-1.5"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Подтвердите почту
              </h1>
              <p className="text-sm text-(--app-subtle)">
                Мы отправили 6-значный код на{" "}
                <span className="text-(--app-fg) font-semibold">{pendingEmail}</span>
              </p>
            </div>

            {codeError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {codeError}
              </motion.div>
            )}
            {resentNotice && !codeError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-4 py-3 rounded-xl bg-(--site-accent)/10 border border-(--site-accent)/25 text-(--site-accent) text-sm text-center"
              >
                {resentNotice}
              </motion.div>
            )}

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="______"
                autoFocus
                className="w-full bg-(--app-input-bg) border border-(--app-border) rounded-2xl py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-(--app-fg) placeholder:text-(--app-faint) outline-none focus:border-(--site-accent)/60 focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all duration-200"
              />

              <motion.button
                type="submit"
                disabled={verifying || code.length !== 6}
                whileHover={{ scale: verifying ? 1 : 1.02 }}
                whileTap={{ scale: verifying ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-semibold text-sm shadow-[0_4px_20px_var(--site-shadow-soft)] hover:shadow-[0_4px_28px_var(--site-shadow-strong)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <>
                    Подтвердить
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-(--app-subtle)">
              Не пришёл код?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0 || resending}
                className="text-(--site-accent) font-semibold hover:underline underline-offset-2 disabled:text-(--app-faint) disabled:no-underline disabled:cursor-not-allowed transition-colors"
              >
                {resendIn > 0 ? `Отправить заново через ${resendIn} сек.` : "Отправить заново"}
              </button>
            </div>

            <p className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => { setStep("form"); setCodeError(""); }}
                className="text-(--app-subtle) hover:text-(--app-fg) transition-colors"
              >
                ← Изменить данные
              </button>
            </p>
          </div>
          ) : (
          <>
          {/* Heading */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-(--app-fg) mb-1.5"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Создать аккаунт
            </h1>
            <p className="text-sm text-(--app-subtle)">Присоединяйтесь к тысячам путешественников</p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {serverError}
            </motion.div>
          )}

          {refNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-(--site-accent)/10 border border-(--site-accent)/25 text-(--site-accent) text-sm flex items-center gap-2"
            >
              <Gift className="w-4 h-4 shrink-0" />
              <span className="flex-1">{refNotice}</span>
              {ref && /^\d{10}$/.test(ref) && (
                <span className="font-mono text-xs opacity-70">{ref}</span>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Имя"
                type="text"
                id="name"
                value={form.name}
                onChange={set("name")}
                icon={User}
                placeholder="Имя..."
                error={errors.name}
              />
              <InputField
                label="Фамилия"
                type="text"
                id="surname"
                value={form.surname}
                onChange={set("surname")}
                icon={User}
                placeholder="Фамилия..."
                error={errors.surname}
              />
            </div>
            <InputField
              label="Email"
              type="email"
              id="email"
              value={form.email}
              onChange={set("email")}
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email}
            />
            <InputField
              label="Пароль"
              type="password"
              id="password"
              value={form.password}
              onChange={set("password")}
              icon={Lock}
              placeholder="Минимум 8 символов"
              error={errors.password}
            />
            <InputField
              label="Подтверждение пароля"
              type="password"
              id="confirm"
              value={form.confirm}
              onChange={set("confirm")}
              icon={Lock}
              placeholder="Повторите пароль"
              error={errors.confirm}
            />

            <p className="text-xs text-center text-app-muted leading-relaxed">
              При регистрации вы принимаете{" "}
              <a
                href="/reg-agent-agreement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--site-accent) hover:underline"
              >
                агентский договор
              </a>{" "}
              и{" "}
              <a
                href="/reg-pub_offer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--site-accent) hover:underline"
              >
                договор публичной оферты
              </a>
            </p>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="mt-2 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-semibold text-sm shadow-[0_4px_20px_var(--site-shadow-soft)] hover:shadow-[0_4px_28px_var(--site-shadow-strong)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <>
                  Зарегистрироваться
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-(--app-border)" />
            <span className="text-xs text-(--app-faint)">или</span>
            <div className="h-px flex-1 bg-(--app-border)" />
          </div>

          <GoogleButton next={safeNext} />

          <p className="mt-6 text-center text-sm text-(--app-subtle)">
            Уже есть аккаунт?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(safeNext)}`}
              className="text-(--site-accent) font-semibold hover:underline underline-offset-2 transition-colors"
            >
              Войти
            </Link>
          </p>
          </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}
