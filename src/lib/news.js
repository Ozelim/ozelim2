import sb from "@/lib/supabase";

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDateRu(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
}

export async function getLatestNews(limit = 5) {
  const { data } = await sb
    .from("news")
    .select("id, title, description, content, body, image, tag, read_time, date")
    .eq("published", true)
    .order("date", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    tag: r.tag,
    date: formatDateRu(r.date),
    readTime: `${r.read_time} мин`,
    title: r.title,
    excerpt: r.description,
    content: r.content || r.body || "",
    img: r.image,
  }));
}
