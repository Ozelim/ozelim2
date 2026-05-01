import sql from "@/lib/db";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70";

function diffFromDays(days) {
  const d = Number(days) || 0;
  if (d <= 7) return "Лёгкий";
  if (d <= 12) return "Средний";
  return "Сложный";
}

function formatPrice(price, currency) {
  const n = Number(price) || 0;
  const cur = currency || "₸";
  return `${cur} ${n.toLocaleString("ru-RU")}`;
}

function firstGalleryImage(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return null;
  const first = gallery[0];
  if (typeof first === "string") return first;
  return first?.src || first?.url || null;
}

function formatGroup(min, max) {
  const lo = Number(min) || 0;
  const hi = Number(max) || 0;
  if (lo && hi) return `${lo}–${hi}`;
  if (hi) return `${hi}`;
  if (lo) return `${lo}+`;
  return "—";
}

export async function getLatestTours(limit = 6) {
  const rows = await sql`
    SELECT id, title, country, city, days, group_min, group_max,
           price, currency, gallery, hot, created_at
      FROM tours
     ORDER BY hot DESC, created_at DESC
     LIMIT ${limit}
  `;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    country: r.country || "",
    city: r.city || "",
    days: Number(r.days) || 0,
    duration: `${Number(r.days) || 0} дней`,
    group: formatGroup(r.group_min, r.group_max),
    price: formatPrice(r.price, r.currency),
    diff: diffFromDays(r.days),
    hot: r.hot ?? false,
    img: firstGalleryImage(r.gallery) || PLACEHOLDER_IMG,
  }));
}
