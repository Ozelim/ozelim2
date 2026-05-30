"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/lib/use-current-user";

// Кэш по ключу `${kind}:${id}` — чтобы повторное появление той же карточки
// не дёргало список избранного и сразу отображало правильное состояние.
let favsCache = null; // Map<string, true>
let favsInflight = null;
const favsSubs = new Set();

function favKey(kind, id) {
  return `${kind}:${id}`;
}

async function loadFavorites() {
  if (favsCache) return favsCache;
  if (favsInflight) return favsInflight;
  favsInflight = fetch("/api/favorites", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : { favorites: [] }))
    .then((d) => {
      const map = new Map();
      for (const f of d?.favorites ?? []) {
        const kind = f.kind === "direction" ? "direction" : "tour";
        map.set(favKey(kind, f.id), true);
      }
      favsCache = map;
      for (const cb of favsSubs) cb(favsCache);
      return favsCache;
    })
    .catch(() => {
      favsCache = new Map();
      return favsCache;
    })
    .finally(() => {
      favsInflight = null;
    });
  return favsInflight;
}

function setLocal(kind, id, value) {
  if (!favsCache) favsCache = new Map();
  if (value) favsCache.set(favKey(kind, id), true);
  else favsCache.delete(favKey(kind, id));
  for (const cb of favsSubs) cb(favsCache);
}

export function clearFavoritesCache() {
  favsCache = null;
}

/**
 * @param {object} props
 * @param {"tour" | "direction"} props.kind
 * @param {number|string} props.id
 * @param {"icon" | "absolute" | "inline"} [props.variant]  стиль кнопки
 * @param {string} [props.className]                        доп. классы
 * @param {string} [props.ariaLabel]
 */
export default function FavoriteButton({
  kind,
  id,
  variant = "absolute",
  className = "",
  ariaLabel,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: userLoading } = useCurrentUser();
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  // Подписка на кэш + первичная загрузка только для авторизованных
  useEffect(() => {
    const cb = (map) => setActive(!!map?.get(favKey(kind, id)));
    favsSubs.add(cb);
    if (user) {
      if (favsCache) setActive(!!favsCache.get(favKey(kind, id)));
      else loadFavorites();
    } else {
      setActive(false);
    }
    return () => {
      favsSubs.delete(cb);
    };
  }, [user, kind, id]);

  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (busy) return;
      if (userLoading) return;

      if (!user) {
        const next = encodeURIComponent(pathname || "/");
        router.push(`/login?next=${next}`);
        return;
      }

      const nextActive = !active;
      setActive(nextActive);
      setLocal(kind, id, nextActive);
      setBusy(true);
      try {
        if (nextActive) {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              kind === "direction" ? { direction_id: id } : { tour_id: id },
            ),
          });
        } else {
          const qs =
            kind === "direction" ? `direction_id=${id}` : `tour_id=${id}`;
          await fetch(`/api/favorites?${qs}`, { method: "DELETE" });
        }
      } catch {
        // откатываем при ошибке
        setActive(!nextActive);
        setLocal(kind, id, !nextActive);
      } finally {
        setBusy(false);
      }
    },
    [busy, userLoading, user, active, kind, id, router, pathname],
  );

  const label = ariaLabel || (active ? "Убрать из избранного" : "В избранное");

  if (variant === "inline") {
    return (
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.92 }}
        aria-label={label}
        title={label}
        className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full border transition-all ${
          active
            ? "border-rose-500/60 text-rose-400 bg-rose-500/10"
            : "border-app-border text-app-subtle hover:border-(--site-accent)/40 hover:text-(--site-accent)"
        } ${className}`}
      >
        <Heart
          className="w-4 h-4"
          fill={active ? "currentColor" : "none"}
        />
      </motion.button>
    );
  }

  // absolute / icon — кнопка-кружок, типично поверх изображения карточки.
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      className={`${
        variant === "absolute" ? "absolute top-3 right-3 z-20" : ""
      } w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 flex items-center justify-center transition-all hover:bg-black/60 ${
        active ? "text-rose-400" : "text-white/80 hover:text-white"
      } ${className}`}
    >
      <Heart
        className="w-4 h-4"
        fill={active ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </motion.button>
  );
}
