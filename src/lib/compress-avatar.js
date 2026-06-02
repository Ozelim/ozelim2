"use client";

// Сжимаем аватарку до квадрата AVATAR_SIZE×AVATAR_SIZE (webp) прямо в браузере.
// Аватарки маленькие и квадратные, поэтому здесь canvas с center-crop — этого
// достаточно и не тянет лишних зависимостей (в отличие от галерей, где админка
// использует browser-image-compression). Возвращаем File с расширением .webp.
//
// GIF не трогаем: канвас убил бы анимацию. Для аватарок это приемлемо — фон
// статичный, но если кто-то загрузит GIF, мы просто отдадим оригинал.

export const AVATAR_SIZE = 100;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob() вернул null"))),
      type,
      quality,
    );
  });
}

// file: File. Возвращает новый File (webp, size×size) либо оригинал при сбое/GIF.
export async function compressAvatar(file, size = AVATAR_SIZE) {
  if (!file) return file;
  if (file.type === "image/gif") return file;

  try {
    const img = await loadImage(file);

    // Center-crop до квадрата, затем масштаб в size×size.
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

    const blob = await canvasToBlob(canvas, "image/webp", 0.85);
    const base = (file.name || "avatar").replace(/\.[a-z0-9]+$/i, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch (err) {
    console.warn("[compressAvatar] fallback to original:", err);
    return file;
  }
}
