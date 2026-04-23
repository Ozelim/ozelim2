"use client";
import { useState, useEffect } from "react";
import {
  Plane,
  MapPin,
  Calendar,
  Clock,
  Heart,
  ExternalLink,
  Trash2,
  Star,
  Filter,
  Grid,
  List,
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
import { MOCK_TRIPS, MOCK_VISITED } from "../../lib/mockData";
import Image from "next/image";
import Link from "next/link";

// ─── TRIP HISTORY ────────────────────────────────────────────────────────────
function TripCard({ trip }) {
  return (
    <Card hover className="overflow-hidden group">
      <div className="relative h-36 overflow-hidden media-contrast">
        <Image
          src={trip.img}
          alt={trip.name}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        <Badge
          variant={trip.status === "active" ? "active" : "completed"}
          className="absolute top-3 right-3"
        >
          {trip.status === "active" ? "● Активен" : "✓ Завершён"}
        </Badge>
      </div>
      <CardBody className="space-y-3">
        <h3
          className="text-white font-semibold leading-tight"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18 }}
        >
          {trip.name}
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-white/45">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {trip.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {trip.duration}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-(--profile-accent) font-bold">{trip.price}</span>
          <Button variant="secondary" size="sm">
            Подробнее <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export function TripHistory() {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all"
      ? MOCK_TRIPS
      : MOCK_TRIPS.filter((t) => t.status === filter);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="История поездок"
        subtitle={`${MOCK_TRIPS.length} туров в вашей истории`}
      />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { k: "all", l: "Все" },
          { k: "active", l: "Активные" },
          { k: "completed", l: "Завершённые" },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === f.k
                ? "bg-(--profile-accent) text-(--profile-on-accent)"
                : "border border-[#1a6b1a]/30 text-white/50 hover:text-white hover:border-[#1a6b1a]/60",
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="Поездок не найдено"
          subtitle="Попробуйте изменить фильтр"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VISITED PLACES ───────────────────────────────────────────────────────────
const PLACE_TYPES = [
  "Все",
  "Горы",
  "Озёра",
  "Море",
  "Лес",
  "Каньон",
  "Нацпарк",
];

function VisitedCard({ place }) {
  return (
    <Card hover className="overflow-hidden group">
      <div className="relative h-40 overflow-hidden media-contrast">
        <Image
          src={place.img}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        <Badge variant="gold" className="absolute top-3 left-3">
          {place.type}
        </Badge>
        {place.visits > 1 && (
          <div className="absolute top-3 right-3 bg-(--profile-accent) text-(--profile-on-accent) text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            ×{place.visits}
          </div>
        )}
      </div>
      <CardBody>
        <h3
          className="text-white font-semibold mb-1"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17 }}
        >
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <MapPin className="w-3 h-3" />
          {place.region}
        </div>
      </CardBody>
    </Card>
  );
}

export function VisitedPlaces() {
  const [activeType, setActiveType] = useState("Все");
  const [viewMode, setViewMode] = useState("grid");
  const filtered =
    activeType === "Все"
      ? MOCK_VISITED
      : MOCK_VISITED.filter((p) => p.type === activeType);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Посещённые места"
        subtitle={`${MOCK_VISITED.length} мест в коллекции`}
      />

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {PLACE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                activeType === t
                  ? "bg-(--profile-accent) text-(--profile-on-accent)"
                  : "border border-[#1a6b1a]/30 text-white/45 hover:text-white",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[
            { k: "grid", Icon: Grid },
            { k: "list", Icon: List },
          ].map(({ k, Icon }) => (
            <button
              key={k}
              onClick={() => setViewMode(k)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                viewMode === k
                  ? "bg-(--profile-accent-soft) text-(--profile-accent)"
                  : "text-white/30 hover:text-white/60",
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Мест не найдено"
          subtitle="Попробуйте изменить фильтр"
        />
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-3",
          )}
        >
          {filtered.map((p) => (
            <VisitedCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FAVORITES ────────────────────────────────────────────────────────────────

const FALLBACK_IMG = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=75";

function FavoriteCard({ fav, onRemove }) {
  return (
    <Card hover className="overflow-hidden group relative">
      <div className="relative h-36 overflow-hidden media-contrast">
        <Image
          src={fav.hero_image || FALLBACK_IMG}
          alt={fav.name}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/80 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(fav.id);
            }}
            className="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/resort/${fav.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <Star className="w-3 h-3 fill-(--profile-accent) text-(--profile-accent)" />
          <span className="text-(--profile-accent) text-xs font-bold">{Number(fav.rating).toFixed(1)}</span>
        </div>
      </div>
      <CardBody>
        <h3
          className="text-white font-semibold mb-1 leading-tight"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17 }}
        >
          {fav.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {fav.location || "Казахстан"}
          </span>
          <Badge variant="ghost">{fav.category || "Курорт"}</Badge>
        </div>
      </CardBody>
    </Card>
  );
}

export function Favorites() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then(({ favorites }) => setItems(favorites ?? []))
      .catch(() => setItems([]));
  }, []);

  async function remove(id) {
    setItems((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/favorites?resort_id=${id}`, { method: "DELETE" }).catch(() => {});
  }

  if (items === null) {
    return (
      <div className="space-y-5">
        <SectionHeader title="Избранное" subtitle="Загрузка..." />
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Избранное"
        subtitle={`${items.length} сохранённых курортов`}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Ничего не сохранено"
          subtitle="Нажмите на сердечко на странице курорта, чтобы добавить его сюда"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((f) => (
            <FavoriteCard key={f.id} fav={f} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
