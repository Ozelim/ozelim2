import { SignJWT, jwtVerify } from "jose";

// Имя куки клиентского сайта. Отличается от admin_session (admin2) и
// org_session (resort), чтобы сессии трёх surface не пересекались.
export const SESSION_COOKIE = "user_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const ALG = "HS256";

const SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
  }
  return new TextEncoder().encode(secret);
})();

export async function signSession(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: [ALG] });
    return payload;
  } catch {
    return null;
  }
}
