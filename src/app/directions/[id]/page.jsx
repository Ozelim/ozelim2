import { notFound } from "next/navigation";
import { getDirectionById, listToursForDirection } from "@/lib/resort-directions";
import DirectionClient from "./DirectionClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dir = await getDirectionById(id);
  if (!dir) return { title: "Направление — OzElim" };
  return {
    title: `${dir.name} — OzElim`,
    description: dir.description_short || undefined,
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const direction = await getDirectionById(id);
  if (!direction) notFound();

  const tours = await listToursForDirection(direction.id, 6);

  return <DirectionClient direction={direction} tours={tours} />;
}
