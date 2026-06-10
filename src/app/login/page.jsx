"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Compass } from "lucide-react";

function oauthErrorMessage(code) {
  if (!code) return "";
  if (code === "google_email") return "Google не подтвердил ваш email. Попробуйте другой способ входа.";
  if (code === "google_cancelled") return "Вход через Google отменён.";
  if (code === "google_disabled") return "Вход через Google временно недоступен.";
  return "Не удалось войти через Google. Попробуйте ещё раз.";
}

function GoogleButton({ next }) {
  const href = `/api/auth/google?next=${encodeURIComponent(next || "/")}`;
  return (
    <a
      href={href}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-(--app-border) bg-(--app-input-bg) text-(--app-fg) font-semibold text-sm hover:border-(--site-accent)/60 transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      Войти через Google
    </a>
  );
}

function InputField({ label, type: initialType, id, value, onChange, icon: Icon, placeholder, error, autoComplete }) {
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
          autoComplete={autoComplete ?? (isPassword ? "current-password" : id)}
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

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(() => oauthErrorMessage(searchParams.get("error")));
  const [loading, setLoading] = useState(false);
  const resetSuccess = searchParams.get("reset") === "success";

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Некорректный email";
    if (!form.password) e.password = "Введите пароль";
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error); return; }
      router.push(next.startsWith("/") ? next : "/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')" }}
      />
      <div className="absolute inset-0 bg-app-bg/80 backdrop-blur-sm" />

      {/* Декоративные кружки */}
      <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-(--site-accent)/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-(--site-accent)/5 blur-3xl pointer-events-none" />

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

          {/* Heading */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-(--app-fg) mb-1.5"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Добро пожаловать
            </h1>
            <p className="text-sm text-(--app-subtle)">Войдите, чтобы продолжить путешествие</p>
          </div>

          {resetSuccess && !serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-(--site-accent)/10 border border-(--site-accent)/25 text-(--site-accent) text-sm text-center"
            >
              Пароль изменён. Войдите с новым паролем.
            </motion.div>
          )}

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="Email"
              type="email"
              id="email"
              value={form.email}
              onChange={set("email")}
              icon={Mail}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
            />
            <InputField
              label="Пароль"
              type="password"
              id="password"
              value={form.password}
              onChange={set("password")}
              icon={Lock}
              placeholder="Ваш пароль"
              error={errors.password}
            />

            <div className="-mt-1 text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-(--site-accent) hover:underline underline-offset-2 transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>

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
                  Войти
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

          <GoogleButton next={next} />

          <p className="mt-6 text-center text-sm text-(--app-subtle)">
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="text-(--site-accent) font-semibold hover:underline underline-offset-2 transition-colors"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
