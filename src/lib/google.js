import { OAuth2Client } from "google-auth-library";

// OAuth-клиент Google для входа на клиентском сайте (ozelim2).
// Используется только для login-флоу: получить профиль и завести/найти юзера.
// redirect_uri вычисляется из origin запроса, чтобы один и тот же код работал
// и на localhost, и на проде — оба URI должны быть добавлены в Google Console.

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export function googleConfigured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

export function callbackUrl(origin) {
  return `${origin}/api/auth/google/callback`;
}

export function createClient(origin) {
  if (!googleConfigured()) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET не заданы");
  }
  return new OAuth2Client(CLIENT_ID, CLIENT_SECRET, callbackUrl(origin));
}

// URL согласия Google. state — случайная строка для защиты от CSRF.
export function authUrl(origin, state) {
  const client = createClient(origin);
  return client.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });
}

// Меняем code на токены и проверяем подпись id_token. Возвращаем профиль.
export async function exchangeCode(origin, code) {
  const client = createClient(origin);
  const { tokens } = await client.getToken(code);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: CLIENT_ID,
  });
  const p = ticket.getPayload();
  return {
    googleId: p.sub,
    email: p.email,
    emailVerified: p.email_verified,
    name: p.given_name || p.name || null,
    surname: p.family_name || null,
    picture: p.picture || null,
  };
}
