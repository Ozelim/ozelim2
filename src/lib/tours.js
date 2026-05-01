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

export async function getLatestTours(limit = 6) {
  const rows = await sql`
    SELECT id, title, days, price, currency, gallery, hot, created_at
      FROM tours
     ORDER BY hot DESC, created_at DESC
     LIMIT ${limit}
  `;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    duration: `${Number(r.days) || 0} дней`,
    price: formatPrice(r.price, r.currency),
    diff: diffFromDays(r.days),
    img: firstGalleryImage(r.gallery) || PLACEHOLDER_IMG,
  }));
}
