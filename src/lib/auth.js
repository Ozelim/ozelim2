import { cookies } from "next/headers";
import sql from "./db";

async function ensureUserColumns() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS balance INTEGER DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus INTEGER DEFAULT 0`;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("session_user_id")?.value;
    if (!userId) return null;

    await ensureUserColumns();

    const rows = await sql`
      SELECT id, name, email, bio, balance, bonus, created_at
      FROM users
      WHERE id = ${userId}
    `;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
