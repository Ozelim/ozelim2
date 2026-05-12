import sql from "@/lib/db";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=75";

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

function mapTourToCard(r) {
  return {
    id: r.id,
    img: firstGalleryImage(r.gallery) || PLACEHOLDER_IMG,
    country: r.country || "Казахстан",
    city: r.city || "",
    title: r.title,
    group: formatGroup(r.group_min, r.group_max),
    rating: 0,
    reviews: 0,
    price: Number(r.price) || 0,
    hot: r.hot ?? false,
  };
}

export async function getAllResorts(limit = 20) {
  const rows = await sql`
    SELECT t.id, t.title, t.country, t.city,
           t.group_min, t.group_max,
           t.price, t.gallery, t.hot
      FROM tours t
     ORDER BY t.hot DESC, t.created_at DESC
     LIMIT ${limit}
  `;
  return rows.map(mapTourToCard);
}

export async function getPopularResorts(limit = 6) {
  const rows = await sql`
    SELECT t.id, t.title, t.country, t.city,
           t.group_min, t.group_max,
           t.price, t.gallery, t.hot
      FROM tours t
     ORDER BY t.hot DESC, t.created_at DESC
     LIMIT ${limit}
  `;
  return rows.map(mapTourToCard);
}
