import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

function clean(value, max = 200) {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  if (!s) return null; // явное обнуление (для bio и т.д.)
  return s.slice(0, max);
}

// PATCH /api/users/me
// body: { name?, surname?, phone?, city?, bio? }
//
// Email и password здесь не меняем — отдельные эндпоинты с дополнительной
// верификацией (см. /api/users/me/password). pocket_type меняет только админ.
export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const surname = clean(body.surname, 100);
  const phone = clean(body.phone, 40);
  const city = clean(body.city, 100);
  const bio = clean(body.bio, 1000);

  if (name === "" || name === null) {
    return NextResponse.json({ error: "Имя обязательно" }, { status: 400 });
  }
  if (phone && !/^\+?[\d\s()-]{7,40}$/.test(phone)) {
    return NextResponse.json(
      { error: "Некорректный телефон" },
      { status: 400 },
    );
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET
         name    = COALESCE($2, name),
         surname = COALESCE($3, surname),
         phone   = COALESCE($4, phone),
         city    = COALESCE($5, city),
         bio     = COALESCE($6, bio),
         updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, surname, email, phone, city, image, bio, balance, bonus, pocket_type`,
      [user.id, name, surname, phone, city, bio],
    );

    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    console.error("PATCH /api/users/me error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
