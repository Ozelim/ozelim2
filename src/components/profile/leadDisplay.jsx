"use client";
import Link from "next/link";
import { MapPin, ExternalLink, Phone, Mail, MessageCircle, User } from "lucide-react";

export const KIND_LABELS = {
  tour_request: "Заявка на тур",
  tour_calculator: "Расчёт тура",
  tour_booking: "Бронирование тура",
  endowment: "Эндаумент",
  legal_consult: "Юр. консультация",
  insurance_request: "Страхование",
  tickets_request: "Билеты",
  kids_go_free: "Kids Go Free",
};

export const STATUS_META = {
  new: { label: "Новая", variant: "pending" },
  in_progress: { label: "В работе", variant: "active" },
  done: { label: "Обработана", variant: "completed" },
  closed: { label: "Закрыта", variant: "completed" },
  rejected: { label: "Отклонена", variant: "danger" },
};

export const CONTACT_LABELS = {
  whatsapp: "WhatsApp",
  phone: "Телефон",
  telegram: "Telegram",
  email: "Email",
};

export function formatLeadDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export function leadTargetHref(lead) {
  if (lead.tour_id) return `/tours/${lead.tour_id}`;
  if (lead.resort_direction_id) return `/directions/${lead.resort_direction_id}`;
  return null;
}

// Кликабельное название тура/направления + иконка-ссылка (обе ведут по ссылке).
export function LeadTarget({ lead }) {
  const name = lead.tour_title || lead.direction_title || null;
  const href = leadTargetHref(lead);
  if (!name) return null;
  const inner = (
    <span className="text-app-subtle dark:text-white/55 text-sm flex items-center gap-1 min-w-0">
      <MapPin className="w-3 h-3 shrink-0" />
      <span className="truncate">{name}</span>
    </span>
  );
  if (!href) return inner;
  return (
    <span className="flex items-center gap-1 min-w-0">
      <Link href={href} className="min-w-0 hover:text-(--profile-accent) transition-colors">
        {inner}
      </Link>
      <Link href={href} className="text-app-faint hover:text-(--profile-accent) shrink-0" aria-label="Открыть">
        <ExternalLink className="w-3 h-3" />
      </Link>
    </span>
  );
}

// ── Перевод ключей data + форматирование значений ────────────────────────────
const DATA_LABELS = {
  adults: "Взрослые",
  children: "Дети",
  durationDays: "Длительность (дней)",
  timeframe: "Когда",
  date: "Дата",
  baseName: "Пансионат",
  services: "Услуги",
  totalPrice: "Сумма",
  topic: "Тема",
  investType: "Тип инвестирования",
  country: "Страна",
  serviceType: "Услуга",
  comment: "Комментарий",
};

// Ключи, которые не показываем (служебные / уже отрисованы отдельно).
const HIDDEN_DATA = new Set([
  "partner", "tourTitle", "directionName", "tourPrice",
]);

const TIMEFRAME_LABELS = {
  asap: "Как можно скорее",
  month: "В течение месяца",
  flexible: "Гибко / не решил",
};

function fmtValue(key, value) {
  if (value == null || value === "") return null;
  if (key === "timeframe") return TIMEFRAME_LABELS[value] || String(value);
  if (key === "date") {
    try { return new Date(value).toLocaleDateString("ru-RU"); } catch { return String(value); }
  }
  if (key === "totalPrice") return `${Number(value).toLocaleString("ru-RU")} ₸`;
  if (Array.isArray(value)) {
    return value
      .map((v) => (v && typeof v === "object" ? (v.name ?? "") : String(v)))
      .filter(Boolean)
      .join(", ");
  }
  if (typeof value === "object") return null; // вложенные объекты не показываем
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  return String(value);
}

// Полный набор данных заявки: контакты + всё, что заполнил пользователь.
export function LeadDetails({ lead }) {
  const d = lead.data && typeof lead.data === "object" ? lead.data : {};
  const dataRows = Object.entries(d)
    .filter(([k]) => !HIDDEN_DATA.has(k))
    .map(([k, v]) => [DATA_LABELS[k] || k, fmtValue(k, v)])
    .filter(([, v]) => v != null && v !== "");

  const contacts = [
    lead.name && { icon: User, label: "Имя", value: lead.name },
    lead.phone && { icon: Phone, label: "Телефон", value: lead.phone },
    lead.email && { icon: Mail, label: "Email", value: lead.email },
    lead.contact_method && { icon: MessageCircle, label: "Связь", value: CONTACT_LABELS[lead.contact_method] || lead.contact_method },
  ].filter(Boolean);

  if (contacts.length === 0 && dataRows.length === 0 && !lead.message && !lead.base_title) {
    return null;
  }

  return (
    <div className="mt-2 rounded-xl border border-app-border bg-app-card/60 dark:bg-[#0a2a0a]/30 p-3 space-y-2">
      {contacts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {contacts.map((c) => (
            <div key={c.label} className="flex items-center gap-1.5 text-xs">
              <c.icon className="w-3 h-3 text-(--profile-accent) shrink-0" />
              <span className="text-app-faint dark:text-white/40">{c.label}:</span>
              <span className="text-app-subtle dark:text-white/70 font-medium truncate">{c.value}</span>
            </div>
          ))}
        </div>
      )}

      {(lead.base_title || dataRows.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 border-t border-app-border/60">
          {lead.base_title && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-app-faint dark:text-white/40">Пансионат:</span>
              <span className="text-app-subtle dark:text-white/70 font-medium truncate">{lead.base_title}</span>
            </div>
          )}
          {dataRows.map(([label, value]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs">
              <span className="text-app-faint dark:text-white/40">{label}:</span>
              <span className="text-app-subtle dark:text-white/70 font-medium truncate">{value}</span>
            </div>
          ))}
        </div>
      )}

      {lead.message && (
        <div className="text-xs pt-1 border-t border-app-border/60">
          <span className="text-app-faint dark:text-white/40">Сообщение: </span>
          <span className="text-app-subtle dark:text-white/70 whitespace-pre-wrap break-words">{lead.message}</span>
        </div>
      )}
    </div>
  );
}
