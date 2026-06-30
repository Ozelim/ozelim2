import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TOUR_COLUMNS = `
  id, title, subtitle, country, region, city, location,
  lat, lng, days, nights, hotel_class, rating, hot, is_popular,
  price, price_adult, price_child, partner_discount_pct,
  duration_min_days, duration_max_days,
  season_from, season_to,
  description, gallery, direction_id,
  resort_directions(name, region),
  tour_relax_types(relax_type_id)
`;

function numParam(searchParams, key) {
  if (!searchParams.has(key)) return null;
  const raw = searchParams.get(key);
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const directionId = searchParams.get("directionId") || "";
    const tourTypeSlugs = searchParams.getAll("tourType").filter(Boolean);
    const hotelClass = searchParams.get("hotelClass") || "";
    const onlyHot = searchParams.get("onlyHot") === "1";
    const onlyPopular = searchParams.get("onlyPopular") === "1";
    // null = параметр не задан, фильтр пропускаем (показываем всё).
    const durationMin = numParam(searchParams, "durationMin");
    const durationMax = numParam(searchParams, "durationMax");
    const priceMin = numParam(searchParams, "priceMin");
    const priceMax = numParam(searchParams, "priceMax");
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    let q = sb
      .from("tours")
      .select(TOUR_COLUMNS)
      .eq("status", "approved")
      .is("deleted_at", null);

    if (directionId) q = q.eq("direction_id", directionId);
    if (hotelClass) q = q.eq("hotel_class", hotelClass);
    if (onlyHot) q = q.eq("hot", true);
    if (onlyPopular) q = q.eq("is_popular", true);

    const { data, error } = await q
      .order("is_popular", { ascending: false })
      .order("hot", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    let tours = data ?? [];

    // Цена (price_adult с фолбэком на price). Применяем только если границы заданы.
    if (priceMin != null || priceMax != null) {
      tours = tours.filter((t) => {
        const p = t.price_adult != null ? Number(t.price_adult)
                : t.price       != null ? Number(t.price)
                : null;
        if (p == null) return true;
        if (priceMin != null && p < priceMin) return false;
        if (priceMax != null && p > priceMax) return false;
        return true;
      });
    }

    // Длительность: пересечение интервалов. Применяем только если границы заданы.
    if (durationMin != null || durationMax != null) {
      tours = tours.filter((t) => {
        const tMin = t.duration_min_days != null ? Number(t.duration_min_days) : null;
        const tMax = t.duration_max_days != null ? Number(t.duration_max_days) : null;
        if (durationMax != null && tMin != null && tMin > durationMax) return false;
        if (durationMin != null && tMax != null && tMax < durationMin) return false;
        return true;
      });
    }

    // Фильтр по видам отдыха (slug → id → m2m). Делаем in-app, т.к. supabase-js
    // не умеет нативно фильтровать через junction в одном запросе.
    if (tourTypeSlugs.length) {
      const { data: rtRows } = await sb
        .from("tours_relax_type")
        .select("id, slug")
        .in("slug", tourTypeSlugs);
      const allowedIds = new Set((rtRows ?? []).map((r) => r.id));
      tours = tours.filter((t) =>
        (t.tour_relax_types ?? []).some((rt) => allowedIds.has(rt.relax_type_id))
      );
    }

    // Фильтр по датам сезона (пересечение).
    if (dateFrom || dateTo) {
      const userFrom = dateFrom ? new Date(dateFrom) : null;
      const userTo = dateTo ? new Date(dateTo) : null;
      tours = tours.filter((t) => {
        if (!t.season_from && !t.season_to) return true;
        const sFrom = t.season_from ? new Date(t.season_from) : null;
        const sTo = t.season_to ? new Date(t.season_to) : null;
        if (userFrom && sTo && sTo < userFrom) return false;
        if (userTo && sFrom && sFrom > userTo) return false;
        return true;
      });
    }

    const result = tours.map(({ resort_directions: dir, tour_relax_types, ...t }) => ({
      ...t,
      direction_name: dir?.name ?? null,
      direction_region: dir?.region ?? null,
    }));

    return Response.json({ tours: result });
  } catch (err) {
    console.error("[GET /api/tours/search]", err);
    return Response.json({ tours: [], error: err.message }, { status: 500 });
  }
}
