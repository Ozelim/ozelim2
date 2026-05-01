import sql from "@/lib/db";

export async function getMainPageStats() {
  const [row] = await sql`
    SELECT happy_clients, countries, years_exp, avg_rating
      FROM main_page_stats
     WHERE id = 1
     LIMIT 1
  `;
  if (!row) return null;
  return {
    happyClients: Number(row.happy_clients) || 0,
    countries:    Number(row.countries)     || 0,
    yearsExp:     Number(row.years_exp)     || 0,
    avgRating:    parseFloat(row.avg_rating) || 4.9,
  };
}
