"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Compass, CheckCircle2, AlertCircle } from "lucide-react";

function PasswordField({ label, id, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-(--app-subtle)">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--app-faint)" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Минимум 8 символов"
          autoComplete="new-password"
          className={`w-full bg-(--app-input-bg) border ${
            error ? "border-red-500/60" : "border-(--app-border)"
          } rounded-2xl pl-11 pr-11 py-3.5 text-sm text-(--app-fg) placeholder:text-(--app-faint) outline-none focus:border-(--site-accent)/60 focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all duration-200`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-(--app-faint) hover:text-(--app-subtle) transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')" }}
      />
      <div className="absolute inset-0 bg-app-bg/80 backdrop-blur-sm" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-(--site-accent)/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-(--app-border) bg-(--app-card)/80 backdrop-blur-xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-(--site-accent) to-(--site-accent-bright) flex items-center justify-center shadow-[0_4px_16px_var(--site-shadow-soft)]">
              <Compass className="w-5 h-5 text-(--site-on-accent)" />
            </div>
            <span className="text-xl font-bold text-(--app-fg)" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Özelim
            </span>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState("");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!token) { setChecking(false); setValid(false); setInvalidMsg("Ссылка недействительна."); return; }
      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!active) return;
        if (data.valid) {
          setValid(true);
        } else {
          setValid(false);
          setInvalidMsg(
            data.reason === "expired" ? "Срок действия ссылки истёк."
            : data.reason === "used" ? "Эта ссылка уже была использована."
            : "Ссылка недействительна."
          );
        }
      } catch {
        if (active) { setValid(false); setInvalidMsg("Не удалось проверить ссылку."); }
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => { active = false; };
  }, [token]);

  function validate() {
    const e = {};
    if (!form.password) e.password = "Введите пароль";
    else if (form.password.length < 8) e.password = "Минимум 8 символов";
    if (!form.confirm) e.confirm = "Повторите пароль";
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error);
        if (data.invalid) { setValid(false); setInvalidMsg(data.error); }
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <Shell>
        <div className="flex flex-col items-center py-6 text-(--app-subtle)">
          <svg className="w-8 h-8 animate-spin mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm">Проверяем ссылку…</p>
        </div>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-14 h-14 text-(--site-accent)" />
          </div>
          <h1 className="text-2xl font-bold text-(--app-fg) mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Пароль изменён
          </h1>
          <p className="text-sm text-(--app-subtle) mb-8">
            Теперь войдите в аккаунт с новым паролем.
          </p>
          <button
            onClick={() => router.push("/login?reset=success")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-semibold text-sm"
          >
            Войти
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Shell>
    );
  }

  if (!valid) {
    return (
      <Shell>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-14 h-14 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-(--app-fg) mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Ссылка недействительна
          </h1>
          <p className="text-sm text-(--app-subtle) mb-8">
            {invalidMsg} Запросите восстановление пароля заново.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-semibold text-sm"
          >
            Восстановить пароль
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-(--app-fg) mb-1.5" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Новый пароль
        </h1>
        <p className="text-sm text-(--app-subtle)">Придумайте новый пароль для входа</p>
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordField
          label="Новый пароль"
          id="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
        />
        <PasswordField
          label="Повторите пароль"
          id="confirm"
          value={form.confirm}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          error={errors.confirm}
        />

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
              Сохранить пароль
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </Shell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
