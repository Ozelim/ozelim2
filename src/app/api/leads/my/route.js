import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

// GET /api/leads/my[?limit=N]
// Возвращает заявки текущего пользователя с подтянутыми названиями тура/направления.
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ leads: [] });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(Number.parseInt(searchParams.get("limit") || "100", 10) || 100, 1),
    200,
  );

  try {
    const { rows } = await pool.query(
      `SELECT
         l.id,
         l.kind,
         l.status,
         l.created_at,
         l.tour_id,
         l.resort_direction_id,
         l.resort_base_id,
         l.name,
         l.phone,
         l.email,
         l.contact_method,
         l.message,
         l.data,
         t.title AS tour_title,
         d.name  AS direction_title,
         b.name  AS base_title
       FROM leads l
       LEFT JOIN tours t ON t.id = l.tour_id
       LEFT JOIN resort_directions d ON d.id = l.resort_direction_id
       LEFT JOIN resort_bases b ON b.id = l.resort_base_id
       WHERE l.user_id = $1
       ORDER BY l.created_at DESC
       LIMIT $2`,
      [user.id, limit],
    );

    return NextResponse.json({ leads: rows });
  } catch (err) {
    console.error("GET /api/leads/my error:", err);
    return NextResponse.json({ leads: [] }, { status: 500 });
  }
}
