import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/jwt";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

// POST /api/users/me/password
// body: { current, newPassword }
//
// Проверяем текущий пароль bcrypt'ом, хэшируем новый, обновляем.
// Чужие сессии инвалидируем (sessions_valid_after = NOW()), а текущую —
// перевыпускаем, чтобы не разлогинить самого юзера.
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const current = String(body.current || "");
  const next = String(body.newPassword || "");

  if (!current || !next) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }
  if (next.length < 8) {
    return NextResponse.json(
      { error: "Новый пароль — минимум 8 символов" },
      { status: 400 },
    );
  }
  if (next === current) {
    return NextResponse.json(
      { error: "Новый пароль совпадает со старым" },
      { status: 400 },
    );
  }

  try {
    const { rows } = await pool.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [user.id],
    );
    const hash = rows[0]?.password_hash;
    if (!hash) {
      return NextResponse.json(
        { error: "У аккаунта не задан пароль" },
        { status: 400 },
      );
    }

    const ok = await bcrypt.compare(current, hash);
    if (!ok) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(next, 10);
    await pool.query(
      `UPDATE users SET password_hash = $2, sessions_valid_after = NOW(), updated_at = NOW() WHERE id = $1`,
      [user.id, newHash],
    );

    // Перевыпускаем куку текущего устройства (свежий iat > sessions_valid_after),
    // иначе только что инвалидировали и свою сессию.
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/users/me/password error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
