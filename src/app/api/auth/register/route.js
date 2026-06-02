import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import sb from "@/lib/supabase";
import { findReferrerByCode } from "@/lib/referral";
import { mailerConfigured, sendVerificationCode } from "@/lib/mailer";
import {
  generateCode,
  hashCode,
  CODE_TTL_MS,
} from "@/lib/verification";

// Регистрация по паролю: НЕ создаём user, а кладём «недорега» в email_verifications
// и шлём код на почту. Аккаунт создаётся только в /api/auth/verify-email.
export async function POST(request) {
  try {
    if (!mailerConfigured()) {
      return NextResponse.json(
        { error: "Отправка писем не настроена. Попробуйте позже." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, surname, email, password } = body;
    let { ref } = body;

    if (!name?.trim() || !surname?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Пароль должен быть не менее 8 символов" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Email уже занят подтверждённым аккаунтом?
    const { data: existing } = await sb
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
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
    const code = generateCode();
    const now = Date.now();

    // Один pending на email — upsert перезаписывает прошлую попытку.
    const { error } = await sb
      .from("email_verifications")
      .upsert(
        {
          email: normalizedEmail,
          name: name.trim().slice(0, 100),
          surname: surname.trim().slice(0, 100),
          password_hash: passwordHash,
          referred_by: referrerId,
          code_hash: hashCode(code),
          attempts: 0,
          expires_at: new Date(now + CODE_TTL_MS).toISOString(),
          last_sent_at: new Date(now).toISOString(),
        },
        { onConflict: "email" }
      );
    if (error) throw error;

    await sendVerificationCode(normalizedEmail, code);

    return NextResponse.json({
      ok: true,
      pending: true,
      email: normalizedEmail,
      refInvalid,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
