import sb from "@/lib/supabase";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1280&h=720&fit=crop&q=80";

const DIRECTION_COLUMNS = `
  id, name, sort_order, image_url, region, lat, lng,
  description_short, description_full,
  best_month_from, best_month_to,
  price_adults, price_kids, price_youth,
  published, created_at, updated_at
`;

export async function listDirections() {
  const { data } = await sb
    .from("resort_directions")
    .select("id, name, sort_order")
    .order("sort_order")
    .order("name");
  return data ?? [];
}

// Используется главной страницей и /directions. Возвращает только опубликованные.
export async function listPublishedDirections(limit = 20) {
  const { data } = await sb
    .from("resort_directions")
    .select(DIRECTION_COLUMNS)
    .eq("published", true)
    .order("sort_order")
    .order("name")
    .limit(limit);

  return (data ?? []).map(mapToCard);
}

function mapToCard(d) {
  return {
    id: d.id,
    title: d.name,
    img: d.image_url || PLACEHOLDER_IMG,
    region: d.region || null,
    country: "Казахстан",
    city: d.region || "",
    short: d.description_short || "",
    price: Number(d.price_adults) || 0,
    group: "",
  };
}

// Полные данные направления + связи. Для страницы /directions/[id].
export async function getDirectionById(id) {
  const { data, error } = await sb
    .from("resort_directions")
    .select(`
      ${DIRECTION_COLUMNS},
      resort_direction_eating_tags(eating_tags(id, slug, name)),
      resort_direction_nature_tags(nature_tags(id, slug, name)),
      resort_direction_for_groups(for_groups(id, slug, name)),
      resort_direction_accommodations(accommodations(id, slug, name)),
      resort_direction_activities(activities(id, slug, name))
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const unwrap = (rows, key) =>
    (rows ?? []).map((r) => r[key]).filter(Boolean);

  return {
    ...data,
    image_url: data.image_url || PLACEHOLDER_IMG,
    eating:         unwrap(data.resort_direction_eating_tags,    "eating_tags"),
    nature:         unwrap(data.resort_direction_nature_tags,    "nature_tags"),
    for_groups:     unwrap(data.resort_direction_for_groups,     "for_groups"),
    accommodations: unwrap(data.resort_direction_accommodations, "accommodations"),
    activities:     unwrap(data.resort_direction_activities,     "activities"),
  };
}

// Туры, привязанные к направлению (для секции «Туры в этом направлении»).
export async function listToursForDirection(directionId, limit = 6) {
  const { data } = await sb
    .from("tours")
    .select("id, title, country, city, group_min, group_max, price, gallery, hot")
    .eq("direction_id", directionId)
    .eq("status", "approved")
    .is("deleted_at", null)
    .order("hot", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function listBases(directionId) {
  if (directionId) {
    const { data } = await sb
      .from("resort_bases")
      .select("id, direction_id, name")
      .eq("direction_id", directionId)
      .order("name");
    return data ?? [];
  }
  const { data } = await sb
    .from("resort_bases")
    .select("id, direction_id, name, resort_directions(name)")
    .order("name");
  return (data ?? []).map(({ resort_directions: dir, ...b }) => ({
    ...b,
    direction_name: dir?.name,
  }));
}

export async function listServices(baseId) {
  if (baseId) {
    const { data } = await sb
      .from("resort_services")
      .select("id, base_id, name, price_adult, price_child, is_default")
      .eq("base_id", baseId)
      .order("is_default", { ascending: false })
      .order("id");
    return data ?? [];
  }
  const { data } = await sb
    .from("resort_services")
    .select("id, base_id, name, price_adult, price_child, is_default, resort_bases(name, resort_directions(name))")
    .order("id");
  return (data ?? []).map(({ resort_bases: base, ...s }) => ({
    ...s,
    base_name: base?.name,
    direction_name: base?.resort_directions?.name,
  }));
}
