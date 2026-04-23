import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

async function ensureColumns() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS balance INTEGER DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus INTEGER DEFAULT 0`;
}

export async function POST(request) {
  try {
    await ensureColumns();
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    const rows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    if (!rows.length) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("session_user_id", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
