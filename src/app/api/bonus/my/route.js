import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

// GET /api/bonus/my
// История начислений/списаний бонусов текущего пользователя + актуальная
// сумма бонусов (на случай если у клиента в state ещё старое значение).
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ entries: [], bonus: 0 }, { status: 401 });
  }

  try {
    const [history, current] = await Promise.all([
      pool.query(
        `SELECT id, amount, type, reason, created_at
         FROM bonus_history
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 100`,
        [user.id],
      ),
      pool.query(`SELECT bonus FROM users WHERE id = $1`, [user.id]),
    ]);

    return NextResponse.json({
      entries: history.rows,
      bonus: Number(current.rows[0]?.bonus ?? 0),
    });
  } catch (err) {
    console.error("GET /api/bonus/my error:", err);
    return NextResponse.json({ entries: [], bonus: 0 }, { status: 500 });
  }
}
