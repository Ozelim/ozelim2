import sql from "./db";

export async function ensureReferralColumns() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by INTEGER REFERENCES users(id) ON DELETE SET NULL`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_at TIMESTAMPTZ`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_key ON users(referral_code)`;
}

function randomDigits(n) {
  let out = "";
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
  return out;
}

export async function generateUniqueReferralCode(maxAttempts = 8) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = randomDigits(10);
    const existing = await sql`SELECT 1 FROM users WHERE referral_code = ${code} LIMIT 1`;
    if (existing.length === 0) return code;
  }
  throw new Error("Не удалось сгенерировать уникальный реферальный код");
}

export async function ensureReferralCode(userId) {
  const rows = await sql`SELECT referral_code FROM users WHERE id = ${userId}`;
  const current = rows[0]?.referral_code;
  if (current) return current;
  const code = await generateUniqueReferralCode();
  await sql`UPDATE users SET referral_code = ${code} WHERE id = ${userId}`;
  return code;
}

export async function findReferrerByCode(code) {
  if (!code || typeof code !== "string") return null;
  if (!/^\d{10}$/.test(code)) return null;
  const rows = await sql`SELECT id FROM users WHERE referral_code = ${code} LIMIT 1`;
  return rows[0]?.id ?? null;
}
