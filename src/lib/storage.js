import sb from "./supabase";

// В ozelim2 storage пока используется только для аватарок пользователей.
const BUCKET = "user-avatars";

// Public URL формат: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
// Возвращаем <path> или null, если URL не из указанного bucket
// (например, ссылка на аватар Google CDN — её удалять из storage не нужно).
export function urlToStoragePath(url, bucket = BUCKET) {
  if (typeof url !== "string" || !url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const path = url.slice(i + marker.length).split("?")[0];
  return path || null;
}

// Best-effort: ошибки логируем, но не пробрасываем — состояние БД первично.
export async function removeImage(url, bucket = BUCKET) {
  const path = urlToStoragePath(url, bucket);
  if (!path) return;
  const { error } = await sb.storage.from(bucket).remove([path]);
  if (error) {
    console.error("[storage.removeImage]", error);
  }
}
