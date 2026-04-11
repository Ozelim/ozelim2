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
  AlarmClock,
  CalendarClock,
  CalendarRange,
  Phone,
  MessageCircle,
  Hourglass,
  CalendarDays,
  Utensils,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

const datesToGo = [
  { id: "soon", label: "В самое ближайшее время", icon: AlarmClock },
  { id: "weeks", label: "Через 2–3 недели", icon: CalendarClock },
  { id: "months", label: "Через 1–2 месяца", icon: CalendarRange },
  { id: "later", label: "Более чем через 2 месяца", icon: CalendarDays },
  { id: "idk", label: "Пока не планирую", icon: Hourglass },
];

const ration = [
  { id: "all", label: "Всё включено" },
  { id: "breakfast-dinner", label: "Завтрак + ужин" },
  { id: "breakfast", label: "Только завтрак" },
  { id: "triple", label: "Трёхразовое" },
  { id: "none", label: "Без питания" },
  { id: "idk", label: "Пока не знаю" },
];

const people = [
  { id: "adult", label: "1 взрослый" },
  { id: "two-adults", label: "2 взрослых" },
  { id: "adult-kid", label: "1 взрослый + ребёнок" },
  { id: "two-adults-kid", label: "2 взрослых + ребёнок" },
  { id: "two-adults-two-kids", label: "2 взрослых + 2 ребёнка" },
  { id: "three-adults", label: "3 взрослых" },
];

const contacts = [
  { id: "wa", label: "WhatsApp", icon: MessageCircle },
  { id: "phone", label: "Звонок", icon: Phone },
];

const TOTAL_STEPS = 6;

// Shared option card
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

export function TourSelectionDialog() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(1);

  const [selectedTimeframe, setSelectedTimeframe] = React.useState("");
  const [tourDuration, setTourDuration] = React.useState(7);
  const [selectedRation, setSelectedRation] = React.useState("");
  const [selectedPeople, setSelectedPeople] = React.useState("");
  const [customPeople, setCustomPeople] = React.useState("");
  const [selectedContact, setSelectedContact] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const goTo = React.useCallback((next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const autoNext = React.useCallback((next) => {
    setTimeout(() => goTo(next), 280);
  }, [goTo]);

  const progress = (step / TOTAL_STEPS) * 100;

  const canProceed =
    (step === 1 && selectedTimeframe) ||
    (step === 2 && tourDuration) ||
    (step === 3 && selectedRation) ||
    (step === 4 && (selectedPeople || customPeople)) ||
    (step === 5 && selectedContact) ||
    (step === 6 && name && phone);

  const handleSubmit = () => {
    console.log({ selectedTimeframe, tourDuration, selectedRation, selectedPeople: selectedPeople || customPeople, selectedContact, name, phone });
    setOpen(false);
    setTimeout(() => {
      setStep(1);
      setDirection(1);
      setSelectedTimeframe("");
      setTourDuration(7);
      setSelectedRation("");
      setSelectedPeople("");
      setCustomPeople("");
      setSelectedContact("");
      setName("");
      setPhone("");
    }, 300);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const stepTitles = [
    "Когда планируете отдых?",
    "Продолжительность тура",
    "Тип питания",
    "Состав группы",
    "Способ связи",
    "Ваши контакты",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) hover:shadow-[0_0_40px_var(--site-shadow-glow)]"
        >
          Калькулятор туров
        </motion.button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] p-0 gap-0 border-(--app-border) bg-(--app-card) overflow-hidden rounded-3xl">
        <VisuallyHidden>
          <DialogTitle>Калькулятор туров</DialogTitle>
        </VisuallyHidden>
        {/* Header */}
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

          {/* Progress bar */}
          <div className="mt-4 h-1 w-full rounded-full bg-(--app-border) overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to)"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden min-h-[300px]">
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
              {/* Step 1: When */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-2.5">
                  {datesToGo.map((d) => (
                    <OptionCard
                      key={d.id}
                      selected={selectedTimeframe === d.id}
                      onClick={() => {
                        setSelectedTimeframe(d.id);
                        autoNext(2);
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <d.icon className="w-4 h-4 text-(--site-accent-bright) shrink-0" />
                        <span className="text-sm font-medium text-(--app-fg)">{d.label}</span>
                      </span>
                    </OptionCard>
                  ))}
                </div>
              )}

              {/* Step 2: Duration */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <span className="text-6xl font-bold bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) bg-clip-text text-transparent">
                      {tourDuration}
                    </span>
                    <span className="text-(--app-subtle) text-lg ml-2">
                      {tourDuration === 1 ? "день" : tourDuration < 5 ? "дня" : "дней"}
                    </span>
                  </div>
                  <div className="px-2">
                    <Slider
                      min={3}
                      max={30}
                      defaultValue={[tourDuration]}
                      onValueChange={([v]) => setTourDuration(v)}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-(--app-faint)">
                      <span>3 дня</span>
                      <span>30 дней</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[7, 10, 14, 21].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setTourDuration(d)}
                        className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                          tourDuration === d
                            ? "border-(--site-accent) bg-linear-to-br from-(--site-gradient-from)/15 to-(--site-gradient-to)/10 text-(--app-fg)"
                            : "border-(--app-border) bg-(--app-panel) text-(--app-subtle) hover:border-(--site-accent)/50"
                        }`}
                      >
                        {d} дн.
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Ration */}
              {step === 3 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {ration.map((r) => (
                    <OptionCard
                      key={r.id}
                      selected={selectedRation === r.id}
                      onClick={() => {
                        setSelectedRation(r.id);
                        autoNext(4);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5 text-(--site-accent-bright) shrink-0" />
                        <span className="text-sm font-medium text-(--app-fg)">{r.label}</span>
                      </span>
                    </OptionCard>
                  ))}
                </div>
              )}

              {/* Step 4: People */}
              {step === 4 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {people.map((p) => (
                      <OptionCard
                        key={p.id}
                        selected={selectedPeople === p.id}
                        onClick={() => {
                          setSelectedPeople(p.id);
                          setCustomPeople("");
                          autoNext(5);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-(--site-accent-bright) shrink-0" />
                          <span className="text-sm font-medium text-(--app-fg)">{p.label}</span>
                        </span>
                      </OptionCard>
                    ))}
                  </div>
                  <Input
                    placeholder="Другой состав..."
                    value={customPeople}
                    onChange={(e) => {
                      setCustomPeople(e.target.value);
                      setSelectedPeople("");
                    }}
                    className="bg-(--app-panel) border-(--app-border) text-(--app-fg) placeholder:text-(--app-faint) rounded-xl focus-visible:ring-(--site-accent)/50 focus-visible:border-(--site-accent)"
                  />
                </div>
              )}

              {/* Step 5: Contact method */}
              {step === 5 && (
                <div className="grid grid-cols-2 gap-3">
                  {contacts.map((c) => (
                    <OptionCard
                      key={c.id}
                      selected={selectedContact === c.id}
                      onClick={() => {
                        setSelectedContact(c.id);
                        autoNext(6);
                      }}
                    >
                      <span className="flex flex-col items-center gap-3 py-4">
                        <c.icon className="w-8 h-8 text-(--site-accent-bright)" />
                        <span className="text-sm font-semibold text-(--app-fg)">{c.label}</span>
                      </span>
                    </OptionCard>
                  ))}
                </div>
              )}

              {/* Step 6: Contacts */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-(--app-subtle) uppercase tracking-wider">
                      Номер телефона
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
                      Ваше имя
                    </label>
                    <Input
                      placeholder="Введите имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-(--app-panel) border-(--app-border) text-(--app-fg) placeholder:text-(--app-faint) rounded-xl h-12 focus-visible:ring-(--site-accent)/50 focus-visible:border-(--site-accent)"
                    />
                  </div>
                  <p className="text-xs text-(--app-faint)">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer navigation */}
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
              Подобрать тур
              <Check className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
