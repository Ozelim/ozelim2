import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ensureReferralColumns, ensureReferralCode } from "@/lib/referral";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    await ensureReferralColumns();
    const code = await ensureReferralCode(user.id);

    const origin = new URL(request.url).origin;
    const url = `${origin}/register?ref=${code}`;

    return NextResponse.json({ referralCode: code, url });
  } catch (err) {
    console.error("GET /api/referral error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
