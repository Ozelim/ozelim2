import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

// GET /api/package-applications/my
// Возвращает текущий статус заявки пользователя:
// { pending: { type, created_at } | null, lastApproved: {...} | null }
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ pending: null });

  try {
    const { rows } = await pool.query(
      `SELECT id, type, status, comment, created_at, updated_at
       FROM package_applications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [user.id],
    );

    const pending = rows.find((r) => r.status === "pending") || null;
    return NextResponse.json({ pending, history: rows });
  } catch (err) {
    console.error("GET /api/package-applications/my error:", err);
    return NextResponse.json({ pending: null, history: [] }, { status: 500 });
  }
}
