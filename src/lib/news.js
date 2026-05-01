import sql from "@/lib/db";

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
  const rows = await sql`
    SELECT id, title, description, image, tag, read_time, date
      FROM news
     WHERE published = TRUE
     ORDER BY date DESC, id DESC
     LIMIT ${limit}
  `;

  return rows.map((r) => ({
    id: r.id,
    tag: r.tag,
    date: formatDateRu(r.date),
    readTime: `${r.read_time} мин`,
    title: r.title,
    excerpt: r.description,
    img: r.image,
  }));
}
