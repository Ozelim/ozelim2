import { NextResponse } from "next/server";
import sb from "@/lib/supabase";
import { mailerConfigured, sendPasswordReset } from "@/lib/mailer";
import { generateToken, hashToken, TOKEN_TTL_MS, RESET_COOLDOWN_MS } from "@/lib/reset";

// Запрос восстановления пароля. Ответ ВСЕГДА нейтральный — не раскрываем,
// существует ли аккаунт с таким email (защита от перебора).
export async function POST(request) {
  try {
    if (!mailerConfigured()) {
      return NextResponse.json({ error: "Отправка писем не настроена. Попробуйте позже." }, { status: 503 });
    }

    const { email } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
    }

    const { data: user } = await sb
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    // Письмо шлём только если аккаунт реально есть. Ответ при этом одинаковый.
    if (user) {
      // Антиспам: не чаще одного письма в RESET_COOLDOWN_MS на юзера.
      const { data: recent } = await sb
        .from("password_resets")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const tooSoon =
        recent && Date.now() - new Date(recent.created_at).getTime() < RESET_COOLDOWN_MS;

      if (!tooSoon) {
        // Инвалидируем прошлые токены этого юзера и создаём новый.
        await sb.from("password_resets").delete().eq("user_id", user.id);

        const token = generateToken();
        const { error } = await sb.from("password_resets").insert({
          user_id: user.id,
          token_hash: hashToken(token),
          expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
        });
        if (error) throw error;

        const link = `${request.nextUrl.origin}/reset-password?token=${token}`;
        await sendPasswordReset(normalizedEmail, link);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Если аккаунт с таким email существует, мы отправили ссылку для восстановления пароля.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
