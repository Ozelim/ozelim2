import { notFound } from "next/navigation";
import sb from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import TourClient from "./TourClient";

export const dynamic = "force-dynamic";

const TOUR_QUERY = `
  *,
  org:orgs(id, name, avatar_url, phone, description),
  direction:resort_directions(
    id, name, region, image_url,
    description_short, description_full,
    best_month_from, best_month_to,
    price_adults, price_youth, price_kids
  ),
  relax_types:tour_relax_types(
    tours_relax_type(id, name, slug)
  )
`;

export default async function TourPage({ params }) {
  const { id } = await params;

  const { data: tour, error } = await sb
    .from("tours")
    .select(TOUR_QUERY)
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (error || !tour) notFound();

  // Партнёрскую видимость считаем на сервере → на детальной странице нет мерцания.
  const viewer = await getCurrentUser().catch(() => null);

  // Resolve accommodation_slugs + meal_plan from lookup tables in parallel.
  const [accommodationsRes, mealPlanRes, reviewsRes] = await Promise.all([
    Array.isArray(tour.accommodation_slugs) && tour.accommodation_slugs.length
      ? sb.from("accommodations").select("slug, name").in("slug", tour.accommodation_slugs)
      : Promise.resolve({ data: [] }),
    tour.meal_plan
      ? sb.from("meal_plans").select("slug, name").eq("slug", tour.meal_plan).maybeSingle()
      : Promise.resolve({ data: null }),
    sb
      .from("reviews")
      .select(
        "id, rating, content, reply, reply_at, created_at, user_id, users!reviews_user_id_fkey(name, surname)",
      )
      .eq("tour_id", id)
      .eq("status", "visible")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const enriched = {
    ...tour,
    relax_types: (tour.relax_types ?? [])
      .map((r) => r.tours_relax_type)
      .filter(Boolean),
    accommodations: accommodationsRes.data ?? [],
    meal_plan_full: mealPlanRes?.data ?? null,
    reviews: (reviewsRes.data ?? []).map(({ users: u, ...rv }) => {
      const userName = [u?.name, u?.surname].filter(Boolean).join(" ").trim();
      return {
        ...rv,
        user_name: userName || "Гость",
        author_name: userName || "Гость",
      };
    }),
  };

  return <TourClient tour={enriched} loggedIn={!!viewer} />;
}
