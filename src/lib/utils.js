import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// «Горящий» = тур стартует завтра ИЛИ сезон уже идёт.
// Окно: today ∈ [season_from − 1 день, season_to].
export function isTourBurning(seasonFrom, seasonTo) {
  if (!seasonFrom) return false;
  const start = new Date(seasonFrom);
  if (Number.isNaN(start.getTime())) return false;
  const now = new Date();
  const startDay = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysUntilStart = Math.round((startDay - today) / 86400000);
  if (daysUntilStart > 1) return false;
  if (seasonTo) {
    const end = new Date(seasonTo);
    if (Number.isNaN(end.getTime())) return true;
    const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
    if (endDay < today) return false;
  }
  return true;
}
