import sb from "@/lib/supabase";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&h=720&fit=crop&q=80";

function formatPrice(price) {
  return (Number(price) || 0).toLocaleString("ru-RU");
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

function formatDuration(r) {
  const lo = Number(r.duration_min_days) || 0;
  const hi = Number(r.duration_max_days) || 0;
  if (lo && hi && lo !== hi) return `${lo}–${hi} дн.`;
  if (lo || hi) return `${lo || hi} дн.`;
  const d = Number(r.days) || 0;
  return d ? `${d} дн.` : "—";
}

export async function getLatestTours(limit = 6, { random = false } = {}) {
  const fetchLimit = random ? Math.max(limit * 5, 50) : limit;
  const { data } = await sb
    .from("tours")
    .select(
      "id, title, country, city, days, duration_min_days, duration_max_days, group_min, group_max, price, price_adult, partner_discount_pct, gallery, hot, is_popular, popular_order, hotel_class, season_from, season_to, created_at, resort_directions(name, region)",
    )
    .eq("status", "approved")
    .is("deleted_at", null)
    .order("hot", { ascending: false })
    .order("is_popular", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(fetchLimit);

  let rows = data ?? [];
  if (random && rows.length > limit) {
    rows = [...rows];
    for (let i = rows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rows[i], rows[j]] = [rows[j], rows[i]];
    }
    rows = rows.slice(0, limit);
  }

  return rows.map(({ resort_directions: dir, ...r }) => {
    const priceValue = r.price_adult ?? r.price;
    return {
      id: r.id,
      title: r.title,
      country: r.country || "",
      city: r.city || "",
      direction: dir?.name || "",
      directionRegion: dir?.region || "",
      days: Number(r.days) || 0,
      duration: formatDuration(r),
      group: formatGroup(r.group_min, r.group_max),
      price: priceValue != null ? formatPrice(priceValue) : null,
      priceRaw: priceValue != null ? Number(priceValue) : null,
      partnerDiscountPct: r.partner_discount_pct ?? null,
      hot: r.hot ?? false,
      seasonFrom: r.season_from ?? null,
      seasonTo: r.season_to ?? null,
      popular: r.is_popular ?? false,
      popularOrder: r.popular_order ?? null,
      hotelClass: r.hotel_class ?? null,
      rating: 0,
      img: firstGalleryImage(r.gallery) || PLACEHOLDER_IMG,
    };
  });
}
