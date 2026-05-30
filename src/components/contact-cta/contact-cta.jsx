"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2, CheckCircle2, ArrowRight, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/lib/use-current-user";

function fullName(u) {
  if (!u) return "";
  return [u.name, u.surname].filter(Boolean).join(" ").trim();
}

export function ContactCtaDialog({
  kind,
  source = null,
  title = "Связаться с нами",
  description = "Оставьте контакты — наш менеджер свяжется с вами в течение рабочего дня.",
  triggerClassName,
  triggerLabel = "Связаться с нами",
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  const { user } = useCurrentUser();

  React.useEffect(() => {
    if (!open || !user) return;
    setName((cur) => cur || fullName(user));
    setPhone((cur) => cur || user.phone || "");
  }, [open, user]);

  const reset = () => {
    setName("");
    setPhone("");
    setMessage("");
    setSubmitting(false);
    setSubmitted(false);
    setError("");
  };

  const handleOpenChange = (next) => {
    if (submitting) return;
    setOpen(next);
    if (!next) setTimeout(reset, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setError("");

    if (!name.trim()) {
      setError("Укажите имя");
      return;
    }
    if (!phone.trim()) {
      setError("Укажите телефон или WhatsApp");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
          contactMethod: "phone",
          source:
            source ?? (typeof window !== "undefined" ? window.location.pathname : null),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Ошибка ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Не удалось отправить заявку");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={
            triggerClassName ??
            "inline-flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm whitespace-nowrap shadow-[0_0_32px_var(--site-shadow-glow)]"
          }
        >
          <PhoneCall className="w-4 h-4" />
          {triggerLabel}
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] p-0 gap-0 border-(--app-border) bg-(--app-card) overflow-hidden rounded-3xl">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        <div className="px-7 pt-7 pb-3 border-b border-(--app-border)">
          <h2 className="text-2xl font-bold text-(--app-fg)">{title}</h2>
          <p className="text-sm text-(--app-subtle) mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-(--site-on-accent)" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-(--app-fg)">Заявка отправлена!</h3>
              <p className="text-sm text-(--app-subtle) mt-2">
                Наш менеджер скоро свяжется с вами.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-2 px-6 py-2.5 rounded-full bg-(--app-panel) border border-(--app-border) text-(--app-fg) text-sm font-medium hover:border-(--site-accent)/50 transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--app-subtle) uppercase tracking-wider">
                Ваше имя
              </label>
              <Input
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-(--app-panel) border-(--app-border) text-(--app-fg) placeholder:text-(--app-faint) rounded-xl h-12 focus-visible:ring-(--site-accent)/50 focus-visible:border-(--site-accent)"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--app-subtle) uppercase tracking-wider">
                Телефон / WhatsApp
              </label>
              <Input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-(--app-panel) border-(--app-border) text-(--app-fg) placeholder:text-(--app-faint) rounded-xl h-12 focus-visible:ring-(--site-accent)/50 focus-visible:border-(--site-accent)"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--app-subtle) uppercase tracking-wider">
                Комментарий (необязательно)
              </label>
              <textarea
                placeholder="Расскажите подробнее, если нужно"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-(--app-panel) border border-(--app-border) text-(--app-fg) placeholder:text-(--app-faint) text-sm focus:outline-none focus:border-(--site-accent) focus:ring-2 focus:ring-(--site-accent)/40 resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={submitting ? {} : { scale: 1.02 }}
              whileTap={submitting ? {} : { scale: 0.98 }}
              className="w-full py-3.5 rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  Отправить заявку
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
            <p className="text-[11px] text-(--app-faint) text-center">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
