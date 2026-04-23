import { notFound } from "next/navigation";
import sql from "@/lib/db";
import TourClient from "./TourClient";

export default async function TourPage({ params }) {
  const { id } = await params;

  const rows = await sql`SELECT * FROM tours WHERE id = ${id}`;
  if (!rows.length) notFound();

  return <TourClient tour={rows[0]} />;
}
