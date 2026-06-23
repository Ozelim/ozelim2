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
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  User,
  Baby,
  UserRound,
  Users,
  UsersRound,
  Briefcase,
  Building2,
  Hotel,
  Clock,
  Wallet,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/lib/use-current-user";
import { partnerView, normalizePct } from "@/lib/partner-pricing";

function fullName(u) {
  if (!u) return "";
  return [u.name, u.surname].filter(Boolean).join(" ").trim();
}

const datesToGo = [
  { id: "soon", label: "В самое ближайшее время", icon: AlarmClock },
  { id: "weeks", label: "Через 2–3 недели", icon: CalendarClock },
  { id: "months", label: "Через 1–2 месяца", icon: CalendarRange },
  { id: "later", label: "Более чем через 2 месяца", icon: CalendarDays },
  { id: "idk", label: "Пока не планирую", icon: Hourglass },
];

const GROUP_PRESETS = [
  { id: "solo", label: "Один", hint: "1 человек", icon: UserRound, adults: 1, children: 0 },
  { id: "couple", label: "Пара", hint: "2 взрослых", icon: Users, adults: 2, children: 0 },
  { id: "family", label: "Семья с детьми", hint: "2 взрослых + дети", icon: Baby, adults: 2, children: 1 },
  { id: "friends", label: "Группа друзей", hint: "3–6 человек", icon: UsersRound, adults: 4, children: 0 },
  { id: "company", label: "Большая компания", hint: "7+ человек", icon: Building2, adults: 8, children: 0 },
  { id: "corporate", label: "Корпоративная поездка", hint: "от 10 человек", icon: Briefcase, adults: 10, children: 0 },
];

const contacts = [
  { id: "wa", label: "WhatsApp", icon: MessageCircle },
  { id: "phone", label: "Звонок", icon: Phone },
];

function dayWord(n) {
  if (n === 1) return "день";
  if (n >= 2 && n <= 4) return "дня";
  return "дней";
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
          {hint && (
            <div className="text-[11px] text-(--app-faint)">{hint}</div>
          )}
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
        <span className="w-12 text-center text-(--app-fg) font-semibold tabular-nums">{value}</span>
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

function formatPrice(value) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export function TourSelectionDialog() {
  const [open, setOpen] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const [groupPreset, setGroupPreset] = React.useState("");
  const [adultsCount, setAdultsCount] = React.useState(2);
  const [childrenCount, setChildrenCount] = React.useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("");
  const [tourDuration, setTourDuration] = React.useState(3);
  const [selectedContact, setSelectedContact] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [directions, setDirections] = React.useState([]);
  const [directionsLoading, setDirectionsLoading] = React.useState(false);
  const [selectedDirection, setSelectedDirection] = React.useState(null);

  const [bases, setBases] = React.useState([]);
  const [basesLoading, setBasesLoading] = React.useState(false);
  const [selectedBase, setSelectedBase] = React.useState(null);

  const [services, setServices] = React.useState([]);
  const [servicesLoading, setServicesLoading] = React.useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = React.useState([]);

  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const { user } = useCurrentUser();

  React.useEffect(() => {
    if (!open || !user) return;
    setName((cur) => cur || fullName(user));
    setPhone((cur) => cur || user.phone || "");
  }, [open, user]);

  // Load directions when dialog opens
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setDirectionsLoading(true);
    fetch("/api/resort-directions")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDirections(data.directions ?? []);
      })
      .catch(() => {
        if (!cancelled) setDirections([]);
      })
      .finally(() => {
        if (!cancelled) setDirectionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Load bases when direction selected
  React.useEffect(() => {
    if (!selectedDirection) {
      setBases([]);
      return;
    }
    let cancelled = false;
    setBasesLoading(true);
    fetch(`/api/resort-bases?directionId=${selectedDirection.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setBases(data.bases ?? []);
      })
      .catch(() => {
        if (!cancelled) setBases([]);
      })
      .finally(() => {
        if (!cancelled) setBasesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDirection]);

  // Load services when base selected
  React.useEffect(() => {
    if (!selectedBase) {
      setServices([]);
      return;
    }
    let cancelled = false;
    setServicesLoading(true);
    fetch(`/api/resort-services?baseId=${selectedBase.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = data.services ?? [];
        setServices(list);
        // Pre-select default services — клиент не может их снять.
        setSelectedServiceIds(
          list.filter((s) => s.is_default).map((s) => s.id),
        );
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedBase]);

  // Build dynamic step list (insert "base" / "services" only when relevant)
  const stepKeys = React.useMemo(() => {
    const keys = ["people", "when", "duration", "direction"];
    if (selectedDirection && bases.length > 0) {
      keys.push("base");
      if (selectedBase && services.length > 0) {
        keys.push("services");
      }
    }
    keys.push("contactMethod", "contacts");
    return keys;
  }, [selectedDirection, selectedBase, bases.length, services.length]);

  const totalSteps = stepKeys.length;
  const currentKey = stepKeys[stepIndex] ?? "people";
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const goToIndex = React.useCallback((nextIndex) => {
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setStepIndex(nextIndex);
  }, [stepIndex]);

  const autoNext = React.useCallback(() => {
    setTimeout(() => {
      setDirection(1);
      setStepIndex((i) => Math.min(i + 1, stepKeys.length - 1));
    }, 280);
  }, [stepKeys.length]);

  const totalPrice = React.useMemo(() => {
    let sum = 0;
    for (const id of selectedServiceIds) {
      const s = services.find((x) => x.id === id);
      if (!s) continue;
      sum += (s.price_adult ?? 0) * adultsCount + (s.price_child ?? 0) * childrenCount;
    }
    return sum;
  }, [selectedServiceIds, services, adultsCount, childrenCount]);

  // Партнёрская скидка берётся с выбранного направления и применяется к итогу.
  const partnerPct = normalizePct(selectedDirection?.partner_discount_pct);
  const totalView = partnerView({ price: totalPrice, pct: partnerPct, loggedIn: !!user });

  const canProceed = (() => {
    switch (currentKey) {
      case "people": return adultsCount > 0 || childrenCount > 0;
      case "when": return Boolean(selectedTimeframe);
      case "duration": return tourDuration >= 2 && tourDuration <= 7;
      case "direction": return Boolean(selectedDirection);
      case "base": return Boolean(selectedBase);
      case "services": return true;
      case "contactMethod": return Boolean(selectedContact);
      case "contacts": return Boolean(name && phone);
      default: return false;
    }
  })();

  const reset = () => {
    setStepIndex(0);
    setDirection(1);
    setGroupPreset("");
    setAdultsCount(2);
    setChildrenCount(0);
    setSelectedTimeframe("");
    setTourDuration(3);
    setSelectedDirection(null);
    setSelectedBase(null);
    setSelectedServiceIds([]);
    setSelectedContact("");
    setName("");
    setPhone("");
    setSubmitting(false);
    setSubmitError("");
    setSubmitted(false);
  };

  const handleOpenChange = (next) => {
    if (submitting) return;
    setOpen(next);
    if (!next) setTimeout(reset, 300);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    const selectedServices = services.filter((s) =>
      selectedServiceIds.includes(s.id),
    );

    const payload = {
      kind: "tour_calculator",
      name: name.trim(),
      phone: phone.trim(),
      contactMethod: selectedContact === "wa" ? "whatsapp" : selectedContact,
      resortDirectionId: selectedDirection?.id ?? null,
      resortBaseId: selectedBase?.id ?? null,
      source: typeof window !== "undefined" ? window.location.pathname : null,
      data: {
        adults: adultsCount,
        children: childrenCount,
        timeframe: selectedTimeframe,
        durationDays: tourDuration,
        directionName: selectedDirection?.name ?? null,
        baseName: selectedBase?.name ?? null,
        services: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          priceAdult: s.price_adult,
          priceChild: s.price_child,
        })),
        totalPrice,
      },
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || `Ошибка ${res.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Не удалось отправить заявку");
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const stepTitles = {
    people: "Состав группы",
    when: "Когда планируете отдых?",
    duration: "Продолжительность тура",
    direction: "Курортное направление",
    base: "Курортная база",
    services: "Выбор услуг",
    contactMethod: "Способ связи",
    contacts: "Ваши контакты",
  };

  const toggleService = (id) => {
    const svc = services.find((s) => s.id === id);
    if (svc?.is_default) return; // дефолтные услуги нельзя снимать
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        <div className="px-7 pt-7 pb-5 border-b border-(--app-border)">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-medium text-(--app-subtle) uppercase tracking-widest">
              Шаг {stepIndex + 1} из {totalSteps}
            </span>
          </div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={`title-${currentKey}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-2xl font-bold text-(--app-fg)"
            >
              {stepTitles[currentKey]}
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

        <div className="relative overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`step-${currentKey}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-7 py-6"
            >
              {currentKey === "people" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {GROUP_PRESETS.map((g) => (
                      <OptionCard
                        key={g.id}
                        selected={groupPreset === g.id}
                        onClick={() => {
                          setGroupPreset(g.id);
                          setAdultsCount(g.adults);
                          setChildrenCount(g.children);
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
                      hint="максимум 99"
                      value={adultsCount}
                      onChange={(v) => {
                        setAdultsCount(v);
                        setGroupPreset("");
                      }}
                      min={1}
                      max={99}
                    />
                    <CounterRow
                      icon={Baby}
                      label="Дети"
                      hint="максимум 99"
                      value={childrenCount}
                      onChange={(v) => {
                        setChildrenCount(v);
                        setGroupPreset("");
                      }}
                      min={0}
                      max={99}
                    />
                  </div>
                </div>
              )}

              {currentKey === "when" && (
                <div className="grid grid-cols-1 gap-2.5">
                  {datesToGo.map((d) => (
                    <OptionCard
                      key={d.id}
                      selected={selectedTimeframe === d.id}
                      onClick={() => {
                        setSelectedTimeframe(d.id);
                        autoNext();
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

              {currentKey === "duration" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-6xl font-bold bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) bg-clip-text text-transparent">
                      {tourDuration}
                    </span>
                    <span className="text-(--app-subtle) text-lg ml-2">
                      {dayWord(tourDuration)}
                    </span>
                  </div>
                  <CounterRow
                    icon={Clock}
                    label="Количество дней"
                    hint="от 2 до 7 дней"
                    value={tourDuration}
                    onChange={setTourDuration}
                    min={2}
                    max={7}
                  />
                  <div className="grid grid-cols-6 gap-2">
                    {[2, 3, 4, 5, 6, 7].map((d) => (
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
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentKey === "direction" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                  {directionsLoading && directions.length === 0 ? (
                    <div className="col-span-full text-center text-sm text-(--app-faint) py-6">
                      Загрузка направлений...
                    </div>
                  ) : directions.length === 0 ? (
                    <div className="col-span-full text-center text-sm text-(--app-faint) py-6">
                      Направления пока не добавлены
                    </div>
                  ) : (
                    directions.map((d) => (
                      <OptionCard
                        key={d.id}
                        selected={selectedDirection?.id === d.id}
                        onClick={() => {
                          setSelectedDirection(d);
                          setSelectedBase(null);
                          setSelectedServiceIds([]);
                          autoNext();
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-(--site-accent-bright) shrink-0" />
                          <span className="text-sm font-medium text-(--app-fg)">{d.name}</span>
                        </span>
                      </OptionCard>
                    ))
                  )}
                </div>
              )}

              {currentKey === "base" && (
                <div className="grid grid-cols-1 gap-2 max-h-[340px] overflow-y-auto pr-1">
                  {basesLoading && bases.length === 0 ? (
                    <div className="text-center text-sm text-(--app-faint) py-6">
                      Загрузка...
                    </div>
                  ) : bases.length === 0 ? (
                    <div className="text-center text-sm text-(--app-faint) py-6">
                      Курортные базы не найдены
                    </div>
                  ) : (
                    bases.map((b) => (
                      <OptionCard
                        key={b.id}
                        selected={selectedBase?.id === b.id}
                        onClick={() => {
                          setSelectedBase(b);
                          setSelectedServiceIds([]);
                          autoNext();
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Hotel className="w-3.5 h-3.5 text-(--site-accent-bright) shrink-0" />
                          <span className="text-sm font-medium text-(--app-fg)">{b.name}</span>
                        </span>
                      </OptionCard>
                    ))
                  )}
                </div>
              )}

              {currentKey === "services" && (
                <div className="space-y-3">
                  <p className="text-base font-semibold text-(--site-accent-bright) px-1 leading-snug">
                    Данные услуги будут посчитаны в соответствий с вашим составом группы
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <CounterRow
                      icon={User}
                      label="Взрослые"
                      value={adultsCount}
                      onChange={setAdultsCount}
                      min={1}
                      max={99}
                    />
                    <CounterRow
                      icon={Baby}
                      label="Дети"
                      value={childrenCount}
                      onChange={setChildrenCount}
                      min={0}
                      max={99}
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {servicesLoading && services.length === 0 ? (
                      <div className="text-center text-sm text-(--app-faint) py-6">
                        Загрузка...
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center text-sm text-(--app-faint) py-6">
                        Нет доступных услуг
                      </div>
                    ) : (
                      services.map((s) => {
                        const isSelected = selectedServiceIds.includes(s.id);
                        const isLocked = Boolean(s.is_default);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleService(s.id)}
                            disabled={isLocked}
                            aria-disabled={isLocked}
                            title={isLocked ? "Включено по умолчанию" : undefined}
                            className={`relative w-full text-left px-4 py-3 rounded-2xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-(--site-accent) ${
                              isLocked
                                ? "border-(--site-accent) bg-linear-to-br from-(--site-gradient-from)/20 to-(--site-gradient-to)/15 cursor-not-allowed"
                                : isSelected
                                  ? "border-(--site-accent) bg-linear-to-br from-(--site-gradient-from)/15 to-(--site-gradient-to)/10 shadow-[0_0_16px_var(--site-shadow-soft)]"
                                  : "border-(--app-border) bg-(--app-panel) hover:border-(--site-accent)/50 hover:bg-(--app-panel-strong)"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <div className="text-sm font-semibold text-(--app-fg)">
                                    {s.name}
                                  </div>
                                  {isLocked && (
                                    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-(--site-on-accent) bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) rounded-full px-2 py-0.5">
                                      Входит в тур
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-(--app-faint)">
                                  <span>
                                    Взрослый:{" "}
                                    <span className="text-(--app-subtle) font-medium">
                                      {formatPrice(s.price_adult)} ₸
                                    </span>
                                  </span>
                                  <span>
                                    Ребёнок:{" "}
                                    <span className="text-(--app-subtle) font-medium">
                                      {formatPrice(s.price_child)} ₸
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                  isSelected
                                    ? "bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to)"
                                    : "border border-(--app-border)"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 text-(--site-on-accent)" />
                                )}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                  <div className="rounded-2xl border border-(--site-accent)/40 bg-linear-to-br from-(--site-gradient-from)/10 to-(--site-gradient-to)/5 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-(--site-accent-bright)" />
                        <span className="text-sm font-semibold text-(--app-fg)">Итого</span>
                      </div>
                      <span className="flex items-baseline gap-2">
                        {totalView.mode === "discounted" && (
                          <span className="text-sm text-(--app-faint) line-through">
                            {formatPrice(totalView.was)} ₸
                          </span>
                        )}
                        <span className="text-lg font-bold text-(--app-fg)">
                          {formatPrice(totalView.mode === "discounted" ? totalView.now : totalPrice)} ₸
                        </span>
                      </span>
                    </div>
                    {(totalView.mode === "discounted" || totalView.mode === "teaser") && (
                      <div className="mt-1.5 text-right text-[11px] font-medium text-amber-500">
                        −{totalView.pct}% для партнёров OzElim
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-(--site-accent-bright) text-center leading-snug">
                    Расчёт: {adultsCount} взр. × цена + {childrenCount} реб. × цена
                  </p>
                </div>
              )}

              {currentKey === "contactMethod" && (
                <div className="grid grid-cols-2 gap-3">
                  {contacts.map((c) => (
                    <OptionCard
                      key={c.id}
                      selected={selectedContact === c.id}
                      onClick={() => {
                        setSelectedContact(c.id);
                        autoNext();
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

              {currentKey === "contacts" && (
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

        <div className="px-7 pb-7 pt-2 border-t border-(--app-border) flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={() => goToIndex(stepIndex - 1)}
              className="flex items-center gap-1.5 text-sm text-(--app-subtle) hover:text-(--app-fg) transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
          ) : (
            <span />
          )}

          {!isLastStep ? (
            <motion.button
              type="button"
              whileHover={canProceed ? { scale: 1.03 } : {}}
              whileTap={canProceed ? { scale: 0.97 } : {}}
              onClick={() => canProceed && goToIndex(stepIndex + 1)}
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
            <div className="flex flex-col items-end gap-1.5">
              {submitError && (
                <p className="text-xs text-red-400 max-w-[260px] text-right">
                  {submitError}
                </p>
              )}
              <motion.button
                type="button"
                whileHover={canProceed && !submitting ? { scale: 1.03 } : {}}
                whileTap={canProceed && !submitting ? { scale: 0.97 } : {}}
                onClick={canProceed && !submitting ? handleSubmit : undefined}
                disabled={!canProceed || submitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                  canProceed && !submitting
                    ? "bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) hover:shadow-[0_0_24px_var(--site-shadow-glow)]"
                    : "bg-(--app-panel) text-(--app-faint) cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    Подобрать тур
                    <Check className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {submitted && (
          <div className="absolute inset-0 bg-(--app-card) flex flex-col items-center justify-center gap-4 px-8 text-center z-10 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-(--site-on-accent)" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-(--app-fg)">Заявка отправлена!</h3>
              <p className="text-sm text-(--app-subtle) mt-2 max-w-sm">
                Наш менеджер подберёт тур и свяжется с вами
                {selectedContact === "wa" ? " в WhatsApp" : " по телефону"}.
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
        )}
      </DialogContent>
    </Dialog>
  );
}
