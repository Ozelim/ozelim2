import { NextResponse } from "next/server";
import sb from "@/lib/supabase";
import { mailerConfigured, sendVerificationCode } from "@/lib/mailer";
import {
  generateCode,
  hashCode,
  CODE_TTL_MS,
  RESEND_COOLDOWN_MS,
} from "@/lib/verification";

// Повторная отправка кода. Не чаще раза в RESEND_COOLDOWN_MS (60 сек).
export async function POST(request) {
  try {
    if (!mailerConfigured()) {
      return NextResponse.json({ error: "Отправка писем не настроена" }, { status: 503 });
    }

    const { email } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Нет email" }, { status: 400 });
    }

    const { data: pending } = await sb
      .from("email_verifications")
      .select("id, last_sent_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!pending) {
      return NextResponse.json(
        { error: "Сессия регистрации истекла. Зарегистрируйтесь заново.", expired: true },
        { status: 400 }
      );
    }

    const elapsed = Date.now() - new Date(pending.last_sent_at).getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const retryAfter = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
      return NextResponse.json(
        { error: `Подождите ${retryAfter} сек.`, retryAfter },
        { status: 429 }
      );
    }

    const code = generateCode();
    const now = Date.now();
    const { error } = await sb
      .from("email_verifications")
      .update({
        code_hash: hashCode(code),
        attempts: 0,
        expires_at: new Date(now + CODE_TTL_MS).toISOString(),
        last_sent_at: new Date(now).toISOString(),
      })
      .eq("id", pending.id);
    if (error) throw error;

    await sendVerificationCode(normalizedEmail, code);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend code error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
