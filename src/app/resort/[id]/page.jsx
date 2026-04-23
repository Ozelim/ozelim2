import { notFound } from "next/navigation";
import sql from "@/lib/db";
import ResortClient from "./ResortClient";

async function ensureResortsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS resorts (
      id               SERIAL PRIMARY KEY,
      name             TEXT NOT NULL,
      location         TEXT,
      category         TEXT DEFAULT 'Курорт · Казахстан',
      hero_image       TEXT,
      rating           NUMERIC(3,1) DEFAULT 0,
      review_count     INTEGER DEFAULT 0,
      price_from       INTEGER DEFAULT 0,
      room_count       INTEGER DEFAULT 0,
      procedures_count INTEGER DEFAULT 0,
      description      TEXT,
      gallery          JSONB DEFAULT '[]',
      address          TEXT,
      phone            TEXT,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const rows = await sql`SELECT name FROM resorts WHERE id = ${id}`;
    const name = rows[0]?.name ?? "Курорт";
    return { title: `${name} — OzElim` };
  } catch {
    return { title: "Курорт — OzElim" };
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  await ensureResortsTable();

  const rows = await sql`SELECT * FROM resorts WHERE id = ${id}`;
  if (!rows[0]) notFound();

  return <ResortClient resort={rows[0]} />;
}
