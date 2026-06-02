import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";
import pool from "@/lib/pool";
import { removeImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Отдельный public-бакет под аватарки (создаётся в Supabase Storage),
// чтобы не мешать их с обложками туров/новостей в resort-images.
const BUCKET = "user-avatars";
// Картинка уже ужата до 100×100 webp на клиенте (compress-avatar). Лимит — страховка
// на случай, если компрессия не сработала (GIF / старый браузер) и приехал оригинал.
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

// POST /api/users/me/avatar — multipart/form-data, поле "file".
// Заливает аватар в bucket user-avatars под user-<id>/, перезаписывает users.image
// и удаляет предыдущий файл (если он лежал в нашем storage; Google-ссылку не трогаем).
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ожидается multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Поле file обязательно" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 5 МБ" }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Допустимы только изображения" }, { status: 415 });
  }

  const ext = (file.name?.match(/\.([a-z0-9]+)$/i)?.[1] || "webp").toLowerCase();
  const path = `user-${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (upErr) {
    console.error("[POST /api/users/me/avatar] upload", upErr);
    return NextResponse.json({ error: upErr.message || "Ошибка загрузки" }, { status: 500 });
  }

  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
  const newUrl = pub.publicUrl;

  try {
    const { rows } = await pool.query(
      `UPDATE users SET image = $2, updated_at = NOW() WHERE id = $1
       RETURNING id, name, surname, email, phone, city, image, bio, balance, bonus, pocket_type`,
      [user.id, newUrl],
    );
    // Старый аватар чистим только после успешного апдейта БД (best-effort).
    await removeImage(user.image);
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    // Откатываем только что залитый файл, БД осталась со старым image.
    await removeImage(newUrl);
    console.error("[POST /api/users/me/avatar] db", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// DELETE /api/users/me/avatar — сбрасывает аватар в NULL (→ монограмма) и удаляет
// файл из storage, если он наш. Google-ссылку не восстанавливаем.
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET image = NULL, updated_at = NOW() WHERE id = $1
       RETURNING id, name, surname, email, phone, city, image, bio, balance, bonus, pocket_type`,
      [user.id],
    );
    await removeImage(user.image);
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    console.error("[DELETE /api/users/me/avatar]", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
