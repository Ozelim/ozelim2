import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const { data: courses, error } = await sb
      .from("courses")
      .select("id, title, description, published, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const ids = (courses ?? []).map((c) => c.id);
    if (ids.length === 0) return NextResponse.json({ data: [] });

    const [stepsRes, questionsRes, myAttemptsRes] = await Promise.all([
      sb.from("course_steps").select("course_id").in("course_id", ids),
      sb.from("course_questions").select("course_id").in("course_id", ids),
      user
        ? sb
            .from("course_attempts")
            .select("course_id, score, total, passed, created_at")
            .eq("user_id", user.id)
            .in("course_id", ids)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
    ]);

    const stepsCount = new Map();
    for (const r of stepsRes.data ?? []) {
      stepsCount.set(r.course_id, (stepsCount.get(r.course_id) || 0) + 1);
    }
    const qCount = new Map();
    for (const r of questionsRes.data ?? []) {
      qCount.set(r.course_id, (qCount.get(r.course_id) || 0) + 1);
    }
    const bestByCourse = new Map();
    for (const a of myAttemptsRes.data ?? []) {
      const prev = bestByCourse.get(a.course_id);
      if (!prev || a.score / Math.max(1, a.total) > prev.score / Math.max(1, prev.total)) {
        bestByCourse.set(a.course_id, a);
      }
    }

    const data = courses.map((c) => {
      const best = bestByCourse.get(c.id) || null;
      const total = best?.total ?? 0;
      const percent = total > 0 ? Math.round((best.score / total) * 100) : null;
      return {
        ...c,
        steps_count: stepsCount.get(c.id) || 0,
        questions_count: qCount.get(c.id) || 0,
        my_best: best
          ? { score: best.score, total: best.total, passed: best.passed, percent, created_at: best.created_at }
          : null,
      };
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET /api/courses error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
