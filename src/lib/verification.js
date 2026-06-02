import { createHash, randomInt, timingSafeEqual } from "node:crypto";

// Параметры подтверждения email при регистрации. Меняются здесь в одном месте.
export const CODE_TTL_MS = 10 * 60 * 1000; // код живёт 10 минут
export const RESEND_COOLDOWN_MS = 60 * 1000; // повтор отправки не чаще раза в 60 сек
export const MAX_ATTEMPTS = 5; // попыток ввода кода до блокировки строки

// 6-значный код, без смещения (randomInt — криптостойкий, равномерный).
export function generateCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

// В БД храним только sha256(code), а не сам код.
export function hashCode(code) {
  return createHash("sha256").update(String(code)).digest("hex");
}

// Сравнение в константное время, чтобы не утекал хэш по таймингу.
export function codeMatches(code, storedHash) {
  if (!storedHash) return false;
  const a = Buffer.from(hashCode(code), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
