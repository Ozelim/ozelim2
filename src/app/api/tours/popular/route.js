import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await sb
      .from("tours")
      .select("id, title, gallery, price_adult, price, price_child, duration_min_days, duration_max_days, hotel_class, is_popular, popular_order, season_from, season_to, hot, created_at, resort_directions(name)")
      .eq("status", "approved")
      .is("deleted_at", null)
      .eq("is_popular", true)
      .order("popular_order", { ascending: true, nullsFirst: false })
      .order("hot", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const tours = (data ?? []).map(({ resort_directions: dir, ...t }) => ({
      ...t,
      direction_name: dir?.name ?? null,
    }));

    return Response.json(tours);
  } catch (err) {
    console.error("[GET /api/tours/popular]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
