import nodemailer from "nodemailer";

// SMTP-отправка писем (VK Workspace / mail.ru). Конфиг из env.
// smtp.mail.ru:465 (SSL). Пароль — «для внешних приложений» в настройках ящика.

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT) || 465;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.MAIL_FROM || USER;

export function mailerConfigured() {
  return Boolean(HOST && USER && PASS);
}

const g = globalThis;
function transport() {
  if (!mailerConfigured()) {
    throw new Error("SMTP не настроен (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }
  if (!g._mailer) {
    g._mailer = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465, // 465 — SSL, 587 — STARTTLS
      auth: { user: USER, pass: PASS },
    });
  }
  return g._mailer;
}

export async function sendVerificationCode(to, code) {
  const t = transport();
  await t.sendMail({
    from: `Özelim <${FROM}>`,
    to,
    subject: `Код подтверждения: ${code}`,
    text: `Ваш код подтверждения регистрации на Özelim: ${code}\n\nКод действует 10 минут. Если вы не регистрировались — просто проигнорируйте это письмо.`,
    html: verificationHtml(code),
  });
}

function verificationHtml(code) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
    <h1 style="font-size:22px;margin:0 0 8px">Подтверждение регистрации</h1>
    <p style="color:#555;margin:0 0 24px">Введите этот код на сайте Özelim, чтобы завершить регистрацию:</p>
    <div style="font-size:34px;font-weight:700;letter-spacing:8px;text-align:center;padding:18px;background:#f4f4f5;border-radius:12px">${code}</div>
    <p style="color:#888;font-size:13px;margin:24px 0 0">Код действует 10 минут. Если вы не регистрировались на Özelim — просто проигнорируйте это письмо.</p>
  </div>`;
}
