import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

// GET /api/deposits/my
// История пополнений баланса текущего пользователя (эквайринг).
// До подключения провайдера таблица пустая — отдадим пустой массив.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ deposits: [] }, { status: 401 });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, amount, method, status, tx_id, created_at, completed_at
       FROM deposits
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [user.id],
    );

    return NextResponse.json({ deposits: rows });
  } catch (err) {
    console.error("GET /api/deposits/my error:", err);
    return NextResponse.json({ deposits: [] }, { status: 500 });
  }
}
