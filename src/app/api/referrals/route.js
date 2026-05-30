import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { data, error } = await sb
      .from("users")
      .select("id, name, email, referred_at, created_at")
      .eq("referred_by", user.id)
      .order("referred_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      count: data?.length ?? 0,
      referrals: (data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        referredAt: r.referred_at || r.created_at,
      })),
    });
  } catch (err) {
    console.error("GET /api/referrals error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
