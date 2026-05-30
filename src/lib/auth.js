import { cookies } from "next/headers";
import sb from "./supabase";
import { verifySession, SESSION_COOKIE } from "./jwt";

// Старая кука (до 6.3) — плейн userId без подписи. Удаляется при выходе.
const LEGACY_COOKIE = "session_user_id";

export async function getCurrentUser() {
  try {
    const c = await cookies();
    const token = c.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);

    // Fallback на старую куку — даём текущим сессиям дожить до следующего логина.
    const userId = session?.userId ?? c.get(LEGACY_COOKIE)?.value;
    if (!userId) return null;

    const { data, error } = await sb
      .from("users")
      .select("id, name, surname, email, phone, city, image, bio, balance, bonus, pocket_type, created_at")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
