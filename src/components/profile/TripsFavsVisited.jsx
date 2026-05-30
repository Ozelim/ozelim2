"use client";
import { useState, useEffect } from "react";
import {
  ClipboardList,
  MapPin,
  Calendar,
  Heart,
  ExternalLink,
  Trash2,
  Star,
} from "lucide-react";
import {
  Card,
  CardBody,
  Badge,
  Button,
  SectionHeader,
  EmptyState,
  cn,
} from "./ui";
import Image from "next/image";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=75";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── REQUESTS HISTORY ─────────────────────────────────────────────────────────
const KIND_LABELS = {
  tour_request: "Заявка на тур",
  tour_calculator: "Расчёт тура",
  tour_booking: "Бронирование тура",
  endowment: "Эндаумент",
  legal_consult: "Юр. консультация",
  insurance_request: "Страхование",
  tickets_request: "Билеты",
  kids_go_free: "Kids Go Free",
};

const STATUS_META = {
  new: { label: "Новая", variant: "pending" },
  in_progress: { label: "В работе", variant: "active" },
  done: { label: "Обработана", variant: "completed" },
  rejected: { label: "Отклонена", variant: "danger" },
};

function RequestRow({ lead }) {
  const kindLabel = KIND_LABELS[lead.kind] || lead.kind;
  const status = STATUS_META[lead.status] || { label: lead.status, variant: "default" };
  const targetName = lead.tour_title || lead.direction_title || null;
  const targetHref = lead.tour_id
    ? `/tours/${lead.tour_id}`
    : lead.resort_direction_id
    ? `/directions/${lead.resort_direction_id}`
    : null;

  return (
    <Card>
      <CardBody className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4 text-(--profile-accent)" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="text-app-fg dark:text-white font-semibold text-sm">
              {kindLabel}
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          {targetName && (
            <div className="text-app-subtle dark:text-white/55 text-sm flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{targetName}</span>
              {targetHref && (
                <Link
                  href={targetHref}
                  className="ml-1 text-app-faint hover:text-(--profile-accent)"
                >
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
          <div className="text-app-faint dark:text-white/35 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(lead.created_at)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

const KIND_FILTERS = [
  { k: "all", l: "Все" },
  { k: "tour", l: "Туры" },
  { k: "direction", l: "Направления" },
  { k: "other", l: "Прочее" },
];

function leadGroup(kind) {
  if (["tour_request", "tour_calculator", "tour_booking"].includes(kind)) return "tour";
  if (kind === "endowment") return "direction";
  return "other";
}

export function RequestsHistory() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/leads/my", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ leads }) => setItems(leads ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return (
      <div className="space-y-5">
        <SectionHeader title="История заявок" subtitle="Загрузка..." />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const filtered =
    filter === "all" ? items : items.filter((l) => leadGroup(l.kind) === filter);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="История заявок"
        subtitle={`${items.length} заявок отправлено`}
      />

      <div className="flex gap-2 flex-wrap">
        {KIND_FILTERS.map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all",
              filter === f.k
                ? "bg-(--profile-accent) text-(--profile-on-accent)"
                : "border border-[#1a6b1a]/30 text-app-subtle hover:text-app-fg dark:text-white/50 dark:hover:text-white",
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Заявок пока нет"
          subtitle="Когда вы отправите заявку на тур или направление, она появится здесь"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <RequestRow key={l.id} lead={l} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FAVORITES (Туры + Направления) ───────────────────────────────────────────

function FavoriteCard({ fav, onRemove }) {
  const href = fav.kind === "direction"
    ? `/directions/${fav.id}`
    : `/tours/${fav.id}`;

  return (
    <Card hover className="overflow-hidden group relative">
      <div className="relative aspect-video overflow-hidden media-contrast">
        <Image
          src={fav.hero_image || FALLBACK_IMG}
          alt={fav.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium uppercase tracking-wider">
          {fav.kind === "direction" ? "Направление" : "Тур"}
        </span>
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(fav);
            }}
            className="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-(--profile-accent) flex items-center justify-center text-(--profile-on-accent) hover:brightness-110 transition-all shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        {fav.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            <Star className="w-3 h-3 fill-(--profile-accent) text-(--profile-accent)" />
            <span className="text-(--profile-accent) text-xs font-bold">
              {Number(fav.rating).toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <CardBody className="p-3">
        <h3
          className="text-app-fg dark:text-white font-semibold mb-1 leading-tight truncate"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15 }}
        >
          {fav.name}
        </h3>
        <span className="text-app-subtle dark:text-white/40 text-[11px] flex items-center gap-1 min-w-0">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{fav.location || "Казахстан"}</span>
        </span>
      </CardBody>
    </Card>
  );
}

const FAV_FILTERS = [
  { k: "all", l: "Все" },
  { k: "tour", l: "Туры" },
  { k: "direction", l: "Направления" },
];

export function Favorites() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/favorites", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ favorites }) => setItems(favorites ?? []))
      .catch(() => setItems([]));
  }, []);

  async function remove(fav) {
    setItems((prev) => prev.filter((f) => !(f.id === fav.id && f.kind === fav.kind)));
    const qs = fav.kind === "direction"
      ? `direction_id=${fav.id}`
      : `tour_id=${fav.id}`;
    await fetch(`/api/favorites?${qs}`, { method: "DELETE" }).catch(() => {});
  }

  if (items === null) {
    return (
      <div className="space-y-5">
        <SectionHeader title="Избранное" subtitle="Загрузка..." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const filtered = filter === "all" ? items : items.filter((f) => f.kind === filter);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Избранное"
        subtitle={`${items.length} сохранённых записей`}
      />

      <div className="flex gap-2 flex-wrap">
        {FAV_FILTERS.map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all",
              filter === f.k
                ? "bg-(--profile-accent) text-(--profile-on-accent)"
                : "border border-[#1a6b1a]/30 text-app-subtle hover:text-app-fg dark:text-white/50 dark:hover:text-white",
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Ничего не сохранено"
          subtitle="Нажмите на сердечко на странице тура или направления, чтобы добавить его сюда"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((f) => (
            <FavoriteCard key={`${f.kind}-${f.id}`} fav={f} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
