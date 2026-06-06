"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowRight, Compass, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

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

          {sent ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-14 h-14 text-(--site-accent)" />
              </div>
              <h1 className="text-2xl font-bold text-(--app-fg) mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Проверьте почту
              </h1>
              <p className="text-sm text-(--app-subtle) mb-8">
                Если аккаунт с таким email существует, мы отправили ссылку для восстановления пароля.
                Ссылка действует 1 час.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-(--site-accent) font-semibold text-sm hover:underline underline-offset-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться ко входу
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-(--app-fg) mb-1.5" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Забыли пароль?
                </h1>
                <p className="text-sm text-(--app-subtle)">
                  Введите email — пришлём ссылку для восстановления
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-(--app-subtle)">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--app-faint)" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full bg-(--app-input-bg) border border-(--app-border) rounded-2xl pl-11 pr-4 py-3.5 text-sm text-(--app-fg) placeholder:text-(--app-faint) outline-none focus:border-(--site-accent)/60 focus:shadow-[0_0_0_3px_var(--site-ring)] transition-all duration-200"
                    />
                  </div>
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
                      Отправить ссылку
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-sm text-(--app-subtle)">
                Вспомнили пароль?{" "}
                <Link href="/login" className="text-(--site-accent) font-semibold hover:underline underline-offset-2 transition-colors">
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
