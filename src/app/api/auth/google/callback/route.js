import { NextResponse } from "next/server";
import sb from "@/lib/supabase";
import { exchangeCode, googleConfigured } from "@/lib/google";
import { generateUniqueReferralCode, findReferrerByCode } from "@/lib/referral";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/jwt";

// Колбэк Google: проверяем state, меняем код на профиль, find-or-create по email,
// выписываем ту же куку user_session, что и обычный логин.

function loginError(origin, code) {
  return NextResponse.redirect(`${origin}/login?error=${code}`);
}

export async function GET(request) {
  const { origin, searchParams } = request.nextUrl;

  if (!googleConfigured()) return loginError(origin, "google_disabled");

  // Google вернул ошибку (юзер отменил согласие и т.п.).
  if (searchParams.get("error")) return loginError(origin, "google_cancelled");

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = request.cookies.get("g_oauth_state")?.value;
  const rawNext = request.cookies.get("g_oauth_next")?.value || "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  // CSRF: state из колбэка должен совпасть с тем, что мы положили в куку.
  if (!code || !state || !cookieState || state !== cookieState) {
    return loginError(origin, "google_state");
  }

  try {
    const profile = await exchangeCode(origin, code);

    if (!profile.email || !profile.emailVerified) {
      return loginError(origin, "google_email");
    }
    const email = profile.email.toLowerCase();

    // 1) Уже привязан этот Google-аккаунт?
    let { data: user } = await sb
      .from("users")
      .select("id, name, email, image")
      .eq("google_id", profile.googleId)
      .maybeSingle();

    // 2) Иначе ищем по email — связываем с существующим аккаунтом.
    if (!user) {
      const { data: byEmail } = await sb
        .from("users")
        .select("id, name, email, image")
        .eq("email", email)
        .maybeSingle();

      if (byEmail) {
        const patch = { google_id: profile.googleId, verified: true };
        if (!byEmail.image && profile.picture) patch.image = profile.picture;
        const { data: updated, error: upErr } = await sb
          .from("users")
          .update(patch)
          .eq("id", byEmail.id)
          .select("id, name, email")
          .single();
        if (upErr) throw upErr;
        user = updated;
      }
    }

    // 3) Нового юзера заводим. Реферал — best-effort из ref_code куки (как в register).
    if (!user) {
      let referrerId = null;
      const ref = request.cookies.get("ref_code")?.value;
      if (ref && /^\d{10}$/.test(ref)) {
        referrerId = await findReferrerByCode(ref);
      }
      const referralCode = await generateUniqueReferralCode();

      const { data: created, error: insErr } = await sb
        .from("users")
        .insert({
          name: profile.name?.slice(0, 100) || null,
          surname: profile.surname?.slice(0, 100) || null,
          email,
          google_id: profile.googleId,
          verified: true,
          image: profile.picture || null,
          balance: 0,
          bonus: 0,
          referral_code: referralCode,
          referred_by: referrerId,
          referred_at: referrerId ? new Date().toISOString() : null,
        })
        .select("id, name, email")
        .single();
      if (insErr) throw insErr;
      user = created;
    }

    const token = await signSession({
      sub: String(user.id),
      userId: user.id,
      email: user.email,
    });

    const res = NextResponse.redirect(`${origin}${next}`);
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    // Чистим временные oauth-куки и легаси.
    res.cookies.delete("g_oauth_state");
    res.cookies.delete("g_oauth_next");
    res.cookies.delete("ref_code");
    res.cookies.delete("session_user_id");
    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return loginError(origin, "google_failed");
  }
}
