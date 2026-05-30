import { NextResponse } from "next/server";
import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data } = await sb
      .from("faq_items")
      .select("id, question, answer, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .order("id");
    return NextResponse.json({ items: data ?? [] });
  } catch (err) {
    console.error("GET /api/faq-items error:", err);
    return NextResponse.json({ items: [] });
  }
}
