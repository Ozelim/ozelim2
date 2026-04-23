"use client";

import { useState } from "react";
import { Wallet, Gift, Plus, ArrowUpRight, CheckCircle, ChevronDown } from "lucide-react";
import { Button, Input, Select, SectionHeader, cn } from "./ui";

const BANKS = [
  "Народный банк Казахстана",
  "Kaspi Bank",
  "Банк ЦентрКредит",
  "Forte Bank",
  "Евразийский банк",
  "First Heartland Jusan Bank",
  "Bank RBK",
  "Bereke Bank",
  "Банк Фридом Финанс Казахстан",
  "Ситибанк Казахстан",
  "Home Credit Bank Kazakhstan",
  "Нурбанк",
];

// ─── Deposit modal ────────────────────────────────────────────────────────────
function DepositPanel({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function validate() {
    const val = parseInt(amount, 10);
    if (!amount || isNaN(val)) return "Введите сумму";
    if (val < 500) return "Минимальная сумма — 500 ₸";
    if (val > 1_000_000) return "Максимальная сумма — 1 000 000 ₸";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    onSuccess(parseInt(amount, 10));
  }

  const quickAmounts = [1000, 5000, 10000, 50000];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-2 block">
          Сумма пополнения
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => { setAmount(String(q)); setError(""); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                amount === String(q)
                  ? "bg-(--profile-accent-soft) border-(--profile-accent-border) text-(--profile-accent)"
                  : "border-app-border text-app-subtle dark:text-white/40 hover:border-(--profile-accent)/40 hover:text-(--profile-accent)"
              )}
            >
              {q.toLocaleString("ru-RU")} ₸
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="number"
            min={500}
            max={1_000_000}
            placeholder="Введите сумму"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(""); }}
            className={cn(
              "w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 pr-10 transition-all duration-200",
              "focus:outline-none focus:ring-2",
              error
                ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60"
                : "border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
            )}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-faint dark:text-white/30 text-sm pointer-events-none">₸</span>
        </div>
        {error && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">⚠ {error}</p>}
        <p className="text-[11px] text-app-faint dark:text-white/30 mt-1.5">От 500 до 1 000 000 ₸</p>
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Отмена</Button>
        <Button variant="primary" className="flex-1" type="submit">Пополнить</Button>
      </div>
    </form>
  );
}

// ─── Withdrawal form ──────────────────────────────────────────────────────────
function WithdrawPanel({ onClose, onSuccess, maxAmount }) {
  const [form, setForm] = useState({
    amount: "",
    bank: "",
    iban: "",
    owner: "",
    iin: "",
  });
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const errs = {};
    const amt = parseInt(form.amount, 10);
    if (!form.amount || isNaN(amt)) errs.amount = "Введите сумму";
    else if (amt < 100) errs.amount = "Минимальная сумма — 100 ₸";
    else if (amt > maxAmount) errs.amount = `Недостаточно средств (макс. ${maxAmount.toLocaleString("ru-RU")} ₸)`;

    if (!form.bank) errs.bank = "Выберите банк";

    const ibanClean = form.iban.replace(/\s/g, "");
    if (!ibanClean) errs.iban = "Введите IBAN";
    else if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(ibanClean)) errs.iban = "Неверный формат IBAN";

    if (!form.owner.trim()) errs.owner = "Введите владельца счёта";
    else if (!/^[А-ЯЁA-Z\s-]+$/.test(form.owner)) errs.owner = "Только заглавные буквы";

    if (!form.iin) errs.iin = "Введите ИИН";
    else if (!/^\d{12}$/.test(form.iin)) errs.iin = "ИИН должен содержать ровно 12 цифр";

    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSuccess(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Amount */}
      <div>
        <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-1.5 block">
          Сумма вывода
        </label>
        <div className="relative">
          <input
            type="number"
            min={100}
            max={maxAmount}
            placeholder="Введите сумму"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 pr-10 transition-all duration-200",
              "focus:outline-none focus:ring-2",
              errors.amount
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
            )}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-faint dark:text-white/30 text-sm pointer-events-none">₸</span>
        </div>
        {errors.amount && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">⚠ {errors.amount}</p>}
        <p className="text-[11px] text-app-faint dark:text-white/30 mt-1">Минимум 100 ₸</p>
      </div>

      {/* Bank */}
      <div>
        <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-1.5 block">
          Банк
        </label>
        <div className="relative">
          <select
            value={form.bank}
            onChange={(e) => set("bank", e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 appearance-none transition-all duration-200",
              "focus:outline-none focus:ring-2",
              errors.bank
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
            )}
          >
            <option value="">Выберите банк</option>
            {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-faint dark:text-white/30 pointer-events-none" />
        </div>
        {errors.bank && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">⚠ {errors.bank}</p>}
      </div>

      {/* IBAN */}
      <div>
        <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-1.5 block">
          Номер счёта (IBAN)
        </label>
        <input
          type="text"
          placeholder="KZ00 0000 0000 0000 0000"
          value={form.iban}
          onChange={(e) => set("iban", e.target.value.toUpperCase())}
          className={cn(
            "w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 transition-all duration-200 font-mono",
            "focus:outline-none focus:ring-2",
            errors.iban
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
          )}
        />
        {errors.iban && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">⚠ {errors.iban}</p>}
      </div>

      {/* Owner */}
      <div>
        <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-1.5 block">
          Владелец счёта
        </label>
        <input
          type="text"
          placeholder="ИМЯ ФАМИЛИЯ"
          value={form.owner}
          onChange={(e) => set("owner", e.target.value.toUpperCase())}
          className={cn(
            "w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 transition-all duration-200 uppercase",
            "focus:outline-none focus:ring-2",
            errors.owner
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
          )}
        />
        {errors.owner && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">⚠ {errors.owner}</p>}
        <p className="text-[11px] text-app-faint dark:text-white/30 mt-1">Имя и фамилия заглавными буквами</p>
      </div>

      {/* IIN */}
      <div>
        <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-1.5 block">
          ИИН
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={12}
          placeholder="000000000000"
          value={form.iin}
          onChange={(e) => set("iin", e.target.value.replace(/\D/g, "").slice(0, 12))}
          className={cn(
            "w-full rounded-xl border bg-app-input-bg text-app-fg dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 transition-all duration-200 font-mono tracking-widest",
            "focus:outline-none focus:ring-2",
            errors.iin
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-[#1a6b1a]/30 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
          )}
        />
        {errors.iin && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">⚠ {errors.iin}</p>}
        <p className="text-[11px] text-app-faint dark:text-white/30 mt-1">12 цифр</p>
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Отмена</Button>
        <Button variant="primary" className="flex-1" type="submit">Отправить заявку</Button>
      </div>
    </form>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState({ type, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-emerald-400" />
      </div>
      <div>
        <div className="text-app-fg dark:text-white font-semibold text-lg mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          {type === "deposit" ? "Пополнение выполнено!" : "Заявка отправлена!"}
        </div>
        <p className="text-app-subtle dark:text-white/45 text-sm max-w-xs">
          {type === "deposit"
            ? "Баланс успешно пополнен."
            : "Ваша заявка на вывод средств принята и будет обработана в течение 1–3 рабочих дней."}
        </p>
      </div>
      <Button variant="primary" onClick={onClose}>Готово</Button>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function BalanceSection({ user, setUser }) {
  // "idle" | "deposit" | "withdraw" | "deposit-success" | "withdraw-success"
  const [mode, setMode] = useState("idle");

  function handleDepositSuccess(amount) {
    setUser((u) => ({ ...u, balance: (u.balance || 0) + amount }));
    setMode("deposit-success");
  }

  function handleWithdrawSuccess(_form) {
    setMode("withdraw-success");
  }

  const balance = user.balance ?? 0;
  const bonus = user.bonus ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Баланс"
        subtitle="Управление средствами на счёте"
      />

      {/* Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Balance card */}
        <div className="rounded-2xl border border-app-border bg-app-card dark:bg-[#0a2a0a]/60 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center shrink-0">
              <Wallet className="w-4.5 h-4.5 text-(--profile-accent)" />
            </div>
            <div className="text-xs font-medium text-app-subtle dark:text-white/45 uppercase tracking-wider">Основной баланс</div>
          </div>
          <div className="text-3xl font-bold text-app-fg dark:text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {balance.toLocaleString("ru-RU")} <span className="text-xl text-app-subtle dark:text-white/50">₸</span>
          </div>
          <div className="text-[11px] text-app-faint dark:text-white/30">Доступно для использования</div>
        </div>

        {/* Bonuses card */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-400/5 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-400/15 border border-amber-200 dark:border-amber-400/25 flex items-center justify-center shrink-0">
              <Gift className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-xs font-medium text-amber-600/70 dark:text-amber-400/60 uppercase tracking-wider">Бонусные баллы</div>
          </div>
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-400" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {bonus.toLocaleString("ru-RU")} <span className="text-xl text-amber-500/60 dark:text-amber-400/50">Б</span>
          </div>
          <div className="text-[11px] text-amber-500/60 dark:text-amber-400/40">Начисляются за каждую поездку</div>
        </div>
      </div>

      {/* Action panel */}
      <div className="rounded-2xl border border-app-border bg-app-card dark:bg-[#0a2a0a]/60 overflow-hidden">
        {/* Buttons row (shown when idle) */}
        {mode === "idle" && (
          <div className="flex">
            <button
              onClick={() => setMode("deposit")}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-(--profile-accent) hover:bg-(--profile-accent-soft) transition-colors border-r border-app-border"
            >
              <Plus className="w-4 h-4" />
              Пополнить
            </button>
            <button
              onClick={() => setMode("withdraw")}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-app-subtle dark:text-white/50 hover:text-app-fg dark:hover:text-white hover:bg-app-fg/4 dark:hover:bg-white/5 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
              Вывести
            </button>
          </div>
        )}

        {/* Deposit form */}
        {mode === "deposit" && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-(--profile-accent)" />
              </div>
              <span className="font-semibold text-app-fg dark:text-white text-sm">Пополнение баланса</span>
            </div>
            <DepositPanel
              onClose={() => setMode("idle")}
              onSuccess={handleDepositSuccess}
            />
          </div>
        )}

        {/* Withdraw form */}
        {mode === "withdraw" && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-app-fg/5 dark:bg-white/5 border border-app-border flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-app-muted dark:text-white/60" />
              </div>
              <span className="font-semibold text-app-fg dark:text-white text-sm">Вывод средств</span>
            </div>
            <WithdrawPanel
              onClose={() => setMode("idle")}
              onSuccess={handleWithdrawSuccess}
              maxAmount={balance}
            />
          </div>
        )}

        {/* Success states */}
        {(mode === "deposit-success" || mode === "withdraw-success") && (
          <div className="p-5">
            <SuccessState
              type={mode === "deposit-success" ? "deposit" : "withdraw"}
              onClose={() => setMode("idle")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
