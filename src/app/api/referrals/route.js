import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sql from "@/lib/db";
import { ensureReferralColumns } from "@/lib/referral";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    await ensureReferralColumns();

    const rows = await sql`
      SELECT id, name, email, referred_at, created_at
      FROM users
      WHERE referred_by = ${user.id}
      ORDER BY COALESCE(referred_at, created_at) DESC
    `;

    return NextResponse.json({
      count: rows.length,
      referrals: rows.map((r) => ({
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
