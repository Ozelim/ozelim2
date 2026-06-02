import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import sb from "@/lib/supabase";
import { generateUniqueReferralCode } from "@/lib/referral";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/jwt";
import { codeMatches, MAX_ATTEMPTS } from "@/lib/verification";

// Подтверждение кода → создаём user из pending-строки и выдаём сессию.
export async function POST(request) {
  try {
    const { email, code } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !code) {
      return NextResponse.json({ error: "Введите код" }, { status: 400 });
    }

    const { data: pending } = await sb
      .from("email_verifications")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!pending) {
      return NextResponse.json(
        { error: "Запросите код заново", expired: true },
        { status: 400 }
      );
    }

    if (new Date(pending.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Код истёк. Запросите новый.", expired: true },
        { status: 400 }
      );
    }

    if (pending.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Слишком много попыток. Запросите новый код.", expired: true },
        { status: 400 }
      );
    }

    if (!codeMatches(code, pending.code_hash)) {
      await sb
        .from("email_verifications")
        .update({ attempts: pending.attempts + 1 })
        .eq("id", pending.id);
      const left = MAX_ATTEMPTS - pending.attempts - 1;
      return NextResponse.json(
        { error: left > 0 ? `Неверный код. Осталось попыток: ${left}` : "Неверный код" },
        { status: 400 }
      );
    }

    // Гонка: email мог зарегистрироваться параллельно.
    const { data: already } = await sb
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (already) {
      await sb.from("email_verifications").delete().eq("id", pending.id);
      return NextResponse.json({ error: "Этот email уже зарегистрирован" }, { status: 409 });
    }

    const referralCode = await generateUniqueReferralCode();
    const referredAt = pending.referred_by ? new Date().toISOString() : null;

    const { data: user, error: insErr } = await sb
      .from("users")
      .insert({
        name: pending.name,
        surname: pending.surname,
        email: normalizedEmail,
        password_hash: pending.password_hash,
        verified: true,
        balance: 0,
        bonus: 0,
        referral_code: referralCode,
        referred_by: pending.referred_by,
        referred_at: referredAt,
      })
      .select("id, name, surname, email, referral_code")
      .single();
    if (insErr) throw insErr;

    await sb.from("email_verifications").delete().eq("id", pending.id);

    const token = await signSession({
      sub: String(user.id),
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    cookieStore.delete("session_user_id"); // legacy
    cookieStore.delete("ref_code");

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        referralCode: user.referral_code,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
