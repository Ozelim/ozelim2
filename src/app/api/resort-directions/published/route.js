import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Возвращает опубликованные направления с гео и базовыми полями для карты /trips.
// Список не фильтруется пользовательским фильтром туров — направления показываются всегда.
export async function GET() {
  try {
    const { data, error } = await sb
      .from("resort_directions")
      .select(
        "id, name, region, lat, lng, image_url, description_short, price_adults, best_month_from, best_month_to, sort_order"
      )
      .eq("published", true)
      .order("sort_order")
      .order("name");

    if (error) throw error;

    return Response.json({ directions: data ?? [] });
  } catch (err) {
    console.error("[GET /api/resort-directions/published]", err);
    return Response.json({ directions: [], error: err.message }, { status: 500 });
  }
}
