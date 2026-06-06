import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sb from "@/lib/supabase";
import { hashToken } from "@/lib/reset";

// Находим валидную (не использованную, не протухшую) запись по сырому токену.
async function findValidReset(token) {
  if (!token) return { error: "invalid" };
  const { data: row } = await sb
    .from("password_resets")
    .select("id, user_id, expires_at, used_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (!row) return { error: "invalid" };
  if (row.used_at) return { error: "used" };
  if (new Date(row.expires_at).getTime() < Date.now()) return { error: "expired" };
  return { row };
}

// GET — проверка ссылки при открытии страницы (показать форму или ошибку).
export async function GET(request) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const { error } = await findValidReset(token);
    return NextResponse.json({ valid: !error, reason: error || null });
  } catch (err) {
    console.error("Reset validate error:", err);
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}

// POST — установка нового пароля.
export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Пароль должен быть не менее 8 символов" }, { status: 400 });
    }

    const { row, error } = await findValidReset(token);
    if (error) {
      const msg =
        error === "expired" ? "Срок действия ссылки истёк. Запросите восстановление заново."
        : error === "used" ? "Ссылка уже использована. Запросите восстановление заново."
        : "Ссылка недействительна. Запросите восстановление заново.";
      return NextResponse.json({ error: msg, invalid: true }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    // sessions_valid_after = now() инвалидирует все ранее выпущенные сессии.
    // Юзер не залогинен (сброс по ссылке) → войдёт заново с новым токеном.
    const { error: upErr } = await sb
      .from("users")
      .update({ password_hash: passwordHash, sessions_valid_after: new Date().toISOString() })
      .eq("id", row.user_id);
    if (upErr) throw upErr;

    // Гасим токен и любые другие токены этого юзера.
    await sb.from("password_resets").delete().eq("user_id", row.user_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
