import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import sb from "@/lib/supabase";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/jwt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: user, error } = await sb
      .from("users")
      .select("id, name, email, password_hash")
      .eq("email", normalizedEmail)
      .maybeSingle();

    // Дамми-сравнение, чтобы время ответа не выдавало существование email.
    const hashToCheck =
      user?.password_hash ||
      "$2b$10$0000000000000000000000000000000000000000000000000000.";
    const ok = await bcrypt.compare(password, hashToCheck);

    if (error || !user || !user.password_hash || !ok) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const token = await signSession({
      sub: String(user.id),
      userId: user.id,
      email: user.email,
    });

    const c = await cookies();
    c.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    // Подчищаем legacy-куку, если она ещё стоит у пользователя.
    c.delete("session_user_id");

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
