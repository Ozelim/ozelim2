import sb from "./supabase";

function randomDigits(n) {
  let out = "";
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
  return out;
}

export async function generateUniqueReferralCode(maxAttempts = 8) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = randomDigits(10);
    const { data } = await sb
      .from("users")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  throw new Error("Не удалось сгенерировать уникальный реферальный код");
}

export async function ensureReferralCode(userId) {
  const { data: user } = await sb
    .from("users")
    .select("referral_code")
    .eq("id", userId)
    .single();

  if (user?.referral_code) return user.referral_code;

  const code = await generateUniqueReferralCode();
  await sb.from("users").update({ referral_code: code }).eq("id", userId);
  return code;
}

export async function findReferrerByCode(code) {
  if (!code || typeof code !== "string") return null;
  if (!/^\d{10}$/.test(code)) return null;
  const { data } = await sb
    .from("users")
    .select("id")
    .eq("referral_code", code)
    .maybeSingle();
  return data?.id ?? null;
}
