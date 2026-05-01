import sql from "@/lib/db";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=75";

export async function getPopularResorts(limit = 6) {
  const rows = await sql`
    SELECT r.id,
           r.name,
           COALESCE(r.images->>0, NULL)                    AS hero_image,
           COALESCE(r.region, r.resort_area, 'Казахстан')  AS city,
           COALESCE(r.base_price, 0)                       AS price_from,
           COALESCE((
             SELECT ROUND(AVG(rating)::numeric, 1)
             FROM reviews WHERE resort_id = r.id
           ), 0)                                           AS rating,
           COALESCE((
             SELECT COUNT(*)::int
             FROM reviews WHERE resort_id = r.id
           ), 0)                                           AS review_count
      FROM resorts r
     ORDER BY rating DESC, review_count DESC, r.created_at DESC
     LIMIT ${limit}
  `;

  return rows.map((r) => {
    const rating = Number(r.rating) || 0;
    return {
      id: r.id,
      img: r.hero_image || PLACEHOLDER_IMG,
      country: "Казахстан",
      city: r.city || "",
      title: r.name,
      days: 7,
      group: "2–4",
      rating,
      reviews: r.review_count || 0,
      price: r.price_from || 0,
      hot: rating >= 4.9,
    };
  });
}
