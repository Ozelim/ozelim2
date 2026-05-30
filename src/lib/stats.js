import sb from "@/lib/supabase";

export async function getMainPageStats() {
  const { data } = await sb
    .from("main_page_stats")
    .select("happy_clients, countries, years_exp, avg_rating")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return null;
  return {
    happyClients: Number(data.happy_clients) || 0,
    countries: Number(data.countries) || 0,
    yearsExp: Number(data.years_exp) || 0,
    avgRating: parseFloat(data.avg_rating) || 4.9,
  };
}
