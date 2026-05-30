import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";
import { notifyAdmins } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["family", "agent", "corporate"]);

// POST /api/package-applications  body: { type }
// Создаёт заявку на пакет в статусе 'pending'. Дубль pending запрещён
// уникальным индексом idx_package_applications_user_pending.
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const type = String(body.type || "").trim();
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: "Неизвестный тип пакета" }, { status: 400 });
  }

  // Уже активен этот же пакет?
  const { rows: userRows } = await pool.query(
    `SELECT pocket_type FROM users WHERE id = $1`,
    [user.id],
  );
  if (userRows[0]?.pocket_type === type) {
    return NextResponse.json(
      { error: "Этот пакет уже активен" },
      { status: 409 },
    );
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO package_applications (user_id, type, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, type, status, created_at`,
      [user.id, type],
    );

    const userLabel =
      [user.name, user.surname].filter(Boolean).join(" ") || user.email || `#${user.id}`;

    await notifyAdmins("admin.package.new", {
      applicationId: rows[0].id,
      userId: user.id,
      userName: userLabel,
      userEmail: user.email,
      type,
    });

    return NextResponse.json({ ok: true, application: rows[0] });
  } catch (err) {
    // unique violation — pending уже есть
    if (err?.code === "23505") {
      return NextResponse.json(
        { error: "У вас уже есть заявка в обработке" },
        { status: 409 },
      );
    }
    console.error("POST /api/package-applications error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
