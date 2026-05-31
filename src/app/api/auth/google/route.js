import { NextResponse } from "next/server";
import { authUrl, googleConfigured } from "@/lib/google";

// Старт входа через Google: ставим state-куку от CSRF и редиректим на согласие.
const STATE_MAX_AGE = 60 * 10; // 10 минут на прохождение флоу

export async function GET(request) {
  if (!googleConfigured()) {
    return NextResponse.json(
      { error: "Вход через Google не настроен" },
      { status: 503 }
    );
  }

  const { origin, searchParams } = request.nextUrl;

  // Куда вернуть после входа — только относительный путь, чтобы не было open redirect.
  const rawNext = searchParams.get("next") || "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const state = crypto.randomUUID();

  const res = NextResponse.redirect(authUrl(origin, state));
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE,
    path: "/",
  };
  res.cookies.set("g_oauth_state", state, cookieOpts);
  res.cookies.set("g_oauth_next", next, cookieOpts);
  return res;
}
