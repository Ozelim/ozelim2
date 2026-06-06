import { createHash, randomBytes } from "node:crypto";

// Токены восстановления пароля.
export const TOKEN_TTL_MS = 60 * 60 * 1000; // ссылка живёт 1 час
export const RESET_COOLDOWN_MS = 60 * 1000; // не чаще одного письма в 60 сек на юзера

// URL-safe токен (~43 симв.). В письмо уходит сырой токен, в БД — его sha256.
export function generateToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}
