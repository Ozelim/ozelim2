import { getMainPageStats } from "@/lib/stats";

export async function GET() {
  const data = await getMainPageStats();
  return Response.json(data ?? {});
}
