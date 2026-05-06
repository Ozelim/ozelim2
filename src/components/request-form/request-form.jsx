"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Minus,
  Plus,
  User,
  Baby,
  UserRound,
  Users,
  UsersRound,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Input } from "../ui/input";

const RESORTS = [
  { id: "bayanaul", label: "Баянаул" },
  { id: "katon-karagay", label: "Катон-Карагай" },
  { id: "kolsai", label: "Кольсай" },
  { id: "kaindy", label: "Каинды" },
  { id: "turkestan", label: "Туркестан" },
  { id: "balkhash", label: "Балхаш" },
  { id: "aktau", label: "Актау" },
  { id: "bukhtarma", label: "Бухтарма" },
  { id: "kapchagai", label: "Капчагай" },
  { id: "astana", label: "Астана" },
  { id: "zaisan", label: "Зайсан" },
  { id: "almaty", label: "Алматы" },
  { id: "saryagash", label: "Сарыагаш" },
  { id: "borovoe", label: "Боровое" },
  { id: "bozzhyra", label: "Бозжыра" },
  { id: "charyn", label: "Чарынский каньон" },
  { id: "alakol-akshi", label: "Алаколь / Акши" },
  { id: "alakol-kabanbay", label: "Алаколь / Кабанбай" },
  { id: "belukha", label: "Белуха" },
  { id: "markakol", label: "Маркаколь" },
];

const GROUP_PRESETS = [
  { id: "solo", label: "Один", hint: "1 человек", icon: UserRound, adults: 1, children: 0 },
  { id: "couple", label: "Пара", hint: "2 взрослых", icon: Users, adults: 2, children: 0 },
  { id: "family", label: "Семья с детьми", hint: "2 взрослых + дети", icon: Baby, adults: 2, children: 1 },
  { id: "friends", label: "Группа друзей", hint: "3–6 человек", icon: UsersRound, adults: 4, children: 0 },
  { id: "company", label: "Большая компания", hint: "7+ человек", icon: Building2, adults: 8, children: 0 },
  { id: "corporate", label: "Корпоративная поездка", hint: "от 10 человек", icon: Briefcase, adults: 10, children: 0 },
];

const CONTACT_METHODS = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "phone", label: "Звонок", icon: Phone },
];

const TOTAL_STEPS = 4;
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday = 0
  const start = new Date(year, month, 1 - offset);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

function CounterRow({ icon: Icon, label, hint, value, onChange, min, max }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-(--app-border) bg-(--app-panel)">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-(--site-accent-bright) shrink-0" />
        <div>
          <div className="text-sm font-semibold text-(--app-fg)">{label}</div>
          {hint && <div className="text-[11px] text-(--app-faint)">{hint}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-(--app-border) text-(--app-fg) flex items-center justify-center disabled:opacity-30 hover:border-(--site-accent)/60 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center text-(--app-fg) font-semibold">{value}</span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-(--app-border) text-(--app-fg) flex items-center justify-center disabled:opacity-30 hover:border-(--site-accent)/60 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function OptionCard({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left px-4 py-3 rounded-2xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-(--site-accent) ${
        selected
          ? "border-(--site-accent) bg-linear-to-br from-(--site-gradient-from)/15 to-(--site-gradient-to)/10 shadow-[0_0_16px_var(--site-shadow-soft)]"
          : "border-(--app-border) bg-(--app-panel) hover:border-(--site-accent)/50 hover:bg-(--app-panel-strong)"
      }`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex items-center justify-center">
          <Check className="w-3 h-3 text-(--site-on-accent)" />
        </span>
      )}
      {children}
    </button>
  );
}

function Calendar({ selectedDate, onSelect }) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const initial = selectedDate ?? today;
  const [view, setView] = React.useState({ year: initial.getFullYear(), month: initial.getMonth() });

  const cells = React.useMemo(() => buildMonthGrid(view.year, view.month), [view]);

  const prev = () => {
    setView((v) => {
      const m = v.month - 1;
      return m < 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: m };
    });
  };
  const next = () => {
    setView((v) => {
      const m = v.month + 1;
      return m > 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: m };
    });
  };

  return (
    <div className="rounded-2xl border border-(--app-border) bg-(--app-panel) p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prev}
          className="w-8 h-8 rounded-full border border-(--app-border) text-(--app-fg) flex items-center justify-center hover:border-(--site-accent)/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-semibold text-(--app-fg)">
          {MONTHS[view.month]} {view.year}
        </div>
        <button
          type="button"
          onClick={next}
          className="w-8 h-8 rounded-full border border-(--app-border) text-(--app-fg) flex items-center justify-center hover:border-(--site-accent)/60 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[11px] text-center text-(--app-faint) py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const isOtherMonth = d.getMonth() !== view.month;
          const isPast = d.getTime() < today.getTime();
          const isSelected =
            selectedDate && startOfDay(d).getTime() === startOfDay(selectedDate).getTime();
          const isToday = d.getTime() === today.getTime();
          const disabled = isPast;
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(startOfDay(d))}
              className={`h-9 rounded-xl text-sm transition-all ${
                isSelected
                  ? "bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-bold"
                  : disabled
                  ? "text-(--app-faint)/40 cursor-not-allowed"
                  : isOtherMonth
                  ? "text-(--app-faint) hover:bg-(--app-panel-strong)"
                  : "text-(--app-fg) hover:bg-(--app-panel-strong) hover:border-(--site-accent)/40"
              } ${isToday && !isSelected ? "ring-1 ring-(--site-accent)/60" : ""}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RequestFormDialog({ trigger, triggerClassName }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(1);

  const [resort, setResort] = React.useState("");
  const [groupPreset, setGroupPreset] = React.useState("");
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [date, setDate] = React.useState(null);
  const [contactMethod, setContactMethod] = React.useState("whatsapp");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const goTo = React.useCallback(
    (next) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
    },
    [step],
  );

  const autoNext = React.useCallback(
    (next) => {
      setTimeout(() => goTo(next), 240);
    },
    [goTo],
  );

  const progress = (step / TOTAL_STEPS) * 100;

  const canProceed =
    (step === 1 && resort) ||
    (step === 2 && (adults > 0 || children > 0)) ||
    (step === 3 && date) ||
    (step === 4 && name.trim() && phone.trim() && contactMethod);

  const reset = () => {
    setStep(1);
    setDirection(1);
    setResort("");
    setGroupPreset("");
    setAdults(2);
    setChildren(0);
    setDate(null);
    setContactMethod("whatsapp");
    setName("");
    setPhone("");
  };

  const handleSubmit = () => {
    console.log({
      resort,
      adults,
      children,
      date: date ? date.toISOString() : null,
      contactMethod,
      name,
      phone,
    });
    setOpen(false);
    setTimeout(reset, 300);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const stepTitles = [
    "Куда хотите поехать?",
    "Состав группы",
    "Когда планируете поездку?",
    "Ваши контакты",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={
              triggerClassName ??
              "px-8 py-4 rounded-full border border-white/30 text-white hover:border-[#FFD700]/50 hover:bg-white/5 font-medium text-sm tracking-wider uppercase transition-colors"
            }
          >
            Оставить заявку
          </motion.button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] p-0 gap-0 border-(--app-border) bg-(--app-card) overflow-hidden rounded-3xl">
        <VisuallyHidden>
          <DialogTitle>Оставить заявку</DialogTitle>
        </VisuallyHidden>

        <div className="px-7 pt-7 pb-5 border-b border-(--app-border)">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-medium text-(--app-subtle) uppercase tracking-widest">
              Шаг {step} из {TOTAL_STEPS}
            </span>
          </div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={`title-${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-2xl font-bold text-(--app-fg)"
            >
              {stepTitles[step - 1]}
            </motion.h2>
          </AnimatePresence>

          <div className="mt-4 h-1 w-full rounded-full bg-(--app-border) overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to)"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`step-${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-7 py-6"
            >
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {RESORTS.map((r) => (
                    <OptionCard
                      key={r.id}
                      selected={resort === r.id}
                      onClick={() => {
                        setResort(r.id);
                        autoNext(2);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-(--site-accent-bright) shrink-0" />
                        <span className="text-sm font-medium text-(--app-fg)">{r.label}</span>
                      </span>
                    </OptionCard>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {GROUP_PRESETS.map((g) => (
                      <OptionCard
                        key={g.id}
                        selected={groupPreset === g.id}
                        onClick={() => {
                          setGroupPreset(g.id);
                          setAdults(g.adults);
                          setChildren(g.children);
                        }}
                      >
                        <span className="flex items-start gap-2.5">
                          <g.icon className="w-5 h-5 text-(--site-accent-bright) shrink-0 mt-0.5" />
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold text-(--app-fg)">{g.label}</span>
                            <span className="text-[11px] text-(--app-faint)">{g.hint}</span>
                          </span>
                        </span>
                      </OptionCard>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] text-(--app-faint) uppercase tracking-wider px-1">
                      Уточните
                    </div>
                    <CounterRow
                      icon={User}
                      label="Взрослые"
                      value={adults}
                      onChange={(v) => {
                        setAdults(v);
                        setGroupPreset("");
                      }}
                      min={1}
                      max={30}
                    />
                    <CounterRow
                      icon={Baby}
                      label="Дети"
                      value={children}
                      onChange={(v) => {
                        setChildren(v);
                        setGroupPreset("");
                      }}
                      min={0}
                      max={15}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <Calendar selectedDate={date} onSelect={setDate} />
                  {date && (
                    <div className="text-center text-sm text-(--app-subtle)">
                      Выбрано:{" "}
                      <span className="text-(--app-fg) font-semibold">
                        {date.toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
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
                      Удобный способ связи
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {CONTACT_METHODS.map((c) => (
                        <OptionCard
                          key={c.id}
                          selected={contactMethod === c.id}
                          onClick={() => setContactMethod(c.id)}
                        >
                          <span className="flex items-center gap-2">
                            <c.icon className="w-4 h-4 text-(--site-accent-bright)" />
                            <span className="text-sm font-semibold text-(--app-fg)">{c.label}</span>
                          </span>
                        </OptionCard>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-(--app-faint)">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-7 pb-7 pt-2 border-t border-(--app-border) flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="flex items-center gap-1.5 text-sm text-(--app-subtle) hover:text-(--app-fg) transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <motion.button
              type="button"
              whileHover={canProceed ? { scale: 1.03 } : {}}
              whileTap={canProceed ? { scale: 0.97 } : {}}
              onClick={() => canProceed && goTo(step + 1)}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                canProceed
                  ? "bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) hover:shadow-[0_0_24px_var(--site-shadow-glow)]"
                  : "bg-(--app-panel) text-(--app-faint) cursor-not-allowed"
              }`}
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={canProceed ? { scale: 1.03 } : {}}
              whileTap={canProceed ? { scale: 0.97 } : {}}
              onClick={canProceed ? handleSubmit : undefined}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                canProceed
                  ? "bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) hover:shadow-[0_0_24px_var(--site-shadow-glow)]"
                  : "bg-(--app-panel) text-(--app-faint) cursor-not-allowed"
              }`}
            >
              Отправить заявку
              <Check className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
