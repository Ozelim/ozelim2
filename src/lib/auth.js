import { cookies } from "next/headers";
import sb from "./supabase";
import { verifySession, SESSION_COOKIE } from "./jwt";

// Запас на под-секундную точность iat (jose округляет iat до секунд).
// Защищает только что перевыпущенную сессию от ложной инвалидации.
const SESSION_GRACE_MS = 2000;

export async function getCurrentUser() {
  try {
    const c = await cookies();
    const token = c.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);
    if (!session?.userId) return null;

    const { data, error } = await sb
      .from("users")
      .select("id, name, surname, email, phone, city, image, bio, balance, bonus, pocket_type, created_at, sessions_valid_after")
      .eq("id", session.userId)
      .single();

    if (error || !data) return null;

    // Инвалидация сессий после смены пароля: токены, выпущенные до
    // sessions_valid_after, недействительны. Так «разлогиниваются» чужие сессии.
    if (data.sessions_valid_after && session.iat) {
      const validAfterMs = new Date(data.sessions_valid_after).getTime();
      if (session.iat * 1000 < validAfterMs - SESSION_GRACE_MS) return null;
    }

    const { sessions_valid_after, ...user } = data;
    return user;
  } catch {
    return null;
  }
}
