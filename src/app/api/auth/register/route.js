import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import {
  ensureReferralColumns,
  generateUniqueReferralCode,
  findReferrerByCode,
} from "@/lib/referral";

async function ensureUsersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id   SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS balance INTEGER DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus INTEGER DEFAULT 0`;
  await ensureReferralColumns();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    let { ref } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Пароль должен быть не менее 8 символов" }, { status: 400 });
    }

    await ensureUsersTable();

    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Этот email уже зарегистрирован" }, { status: 409 });
    }

    const cookieStore = await cookies();

    // Fallback: ref from cookie if not provided in body
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

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, balance, bonus, referral_code, referred_by, referred_at)
      VALUES (
        ${name.trim()},
        ${email.toLowerCase()},
        ${passwordHash},
        0,
        0,
        ${referralCode},
        ${referrerId},
        ${referredAt}
      )
      RETURNING id, name, email, balance, bonus, referral_code
    `;

    cookieStore.set("session_user_id", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Clean up the ref cookie once applied
    cookieStore.delete("ref_code");

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
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
