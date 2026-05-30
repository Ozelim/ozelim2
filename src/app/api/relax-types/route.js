import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await sb
      .from("tours_relax_type")
      .select("id, slug, name, sort_order")
      .order("sort_order")
      .order("name");

    if (error) throw error;
    return Response.json(data ?? []);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
