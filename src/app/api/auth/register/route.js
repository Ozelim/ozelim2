import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import sb from "@/lib/supabase";
import { generateUniqueReferralCode, findReferrerByCode } from "@/lib/referral";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/jwt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, surname, email, password } = body;
    let { ref } = body;

    if (!name?.trim() || !surname?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Пароль должен быть не менее 8 символов" }, { status: 400 });
    }

    const { data: existing } = await sb
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Этот email уже зарегистрирован" }, { status: 409 });
    }

    const cookieStore = await cookies();
    if (!ref) ref = cookieStore.get("ref_code")?.value || null;

    let referrerId = null;
    let refInvalid = false;
    if (ref) {
      if (/^\d{10}$/.test(String(ref).trim())) {
        referrerId = await findReferrerByCode(String(ref).trim());
        if (!referrerId) refInvalid = true;
      } else {
        refInvalid = true;
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const referralCode = await generateUniqueReferralCode();
    const referredAt = referrerId ? new Date().toISOString() : null;

    const { data: user, error } = await sb
      .from("users")
      .insert({
        name: name.trim().slice(0, 100),
        surname: surname.trim().slice(0, 100),
        email: email.toLowerCase(),
        password_hash: passwordHash,
        balance: 0,
        bonus: 0,
        referral_code: referralCode,
        referred_by: referrerId,
        referred_at: referredAt,
      })
      .select("id, name, surname, email, balance, bonus, referral_code")
      .single();

    if (error) throw error;

    const token = await signSession({
      sub: String(user.id),
      userId: user.id,
      email: user.email,
    });
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
      refInvalid,
      referred: Boolean(referrerId),
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
