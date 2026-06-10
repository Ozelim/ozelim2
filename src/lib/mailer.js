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
    from: `OzElim <${FROM}>`,
    to,
    subject: `Код подтверждения: ${code}`,
    text: `Ваш код подтверждения регистрации на OzElim: ${code}\n\nКод действует 10 минут. Если вы не регистрировались — просто проигнорируйте это письмо.`,
    html: verificationHtml(code),
  });
}

function verificationHtml(code) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
    <h1 style="font-size:22px;margin:0 0 8px">Подтверждение регистрации</h1>
    <p style="color:#555;margin:0 0 24px">Введите этот код на сайте OzElim, чтобы завершить регистрацию:</p>
    <div style="font-size:34px;font-weight:700;letter-spacing:8px;text-align:center;padding:18px;background:#f4f4f5;border-radius:12px">${code}</div>
    <p style="color:#888;font-size:13px;margin:24px 0 0">Код действует 10 минут. Если вы не регистрировались на OzElim — просто проигнорируйте это письмо.</p>
  </div>`;
}

export async function sendPasswordReset(to, link) {
  const t = transport();
  await t.sendMail({
    from: `OzElim <${FROM}>`,
    to,
    subject: "Восстановление пароля — OzElim",
    text: `Вы запросили восстановление пароля на OzElim.\n\nПерейдите по ссылке, чтобы задать новый пароль (действует 1 час):\n${link}\n\nЕсли вы не запрашивали восстановление — просто проигнорируйте это письмо, пароль останется прежним.`,
    html: resetHtml(link),
  });
}

function resetHtml(link) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
    <h1 style="font-size:22px;margin:0 0 8px">Восстановление пароля</h1>
    <p style="color:#555;margin:0 0 24px">Вы запросили смену пароля на OzElim. Нажмите кнопку, чтобы задать новый пароль:</p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${link}" style="display:inline-block;background:#0ea5a4;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:12px">Задать новый пароль</a>
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 8px">Ссылка действует 1 час. Если кнопка не работает, скопируйте адрес в браузер:</p>
    <p style="color:#0ea5a4;font-size:12px;word-break:break-all;margin:0 0 24px">${link}</p>
    <p style="color:#888;font-size:13px;margin:0">Если вы не запрашивали восстановление — просто проигнорируйте это письмо.</p>
  </div>`;
}
