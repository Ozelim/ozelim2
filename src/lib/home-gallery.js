import sb from "@/lib/supabase";

// Возвращает { carousel1: Slide[], carousel2: Slide[] }, где Slide уже
// нормализован под форму, ожидаемую компонентами Carousel1/Carousel2.
// Слоты без image_url выкидываем, чтобы не показывать дыры.
export async function getHomeGallery() {
  const { data, error } = await sb
    .from("home_gallery_slides")
    .select("gallery_key, position, image_url, title, subtitle, description")
    .order("gallery_key", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    console.error("[getHomeGallery]", error);
    return { carousel1: [], carousel2: [] };
  }

  const carousel1 = [];
  const carousel2 = [];
  for (const row of data ?? []) {
    if (!row.image_url) continue;
    if (row.gallery_key === "carousel1") {
      carousel1.push({
        img: row.image_url,
        title: row.title || "",
        desc: row.description || "",
      });
    } else if (row.gallery_key === "carousel2") {
      carousel2.push({
        img: row.image_url,
        thumb: row.image_url,
        label: row.subtitle || "",
        title: row.title || "",
        tag: row.description || "",
      });
    }
  }

  return { carousel1, carousel2 };
}
