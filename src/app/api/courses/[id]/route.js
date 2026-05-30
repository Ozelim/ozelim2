import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const courseId = Number(id);
    if (!Number.isInteger(courseId)) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }

    const { data: course, error: cErr } = await sb
      .from("courses")
      .select("id, title, description, published, created_at, updated_at")
      .eq("id", courseId)
      .eq("published", true)
      .maybeSingle();
    if (cErr) throw cErr;
    if (!course) return NextResponse.json({ error: "Курс не найден" }, { status: 404 });

    const [stepsRes, questionsRes] = await Promise.all([
      sb
        .from("course_steps")
        .select("id, position, title, description, video_url")
        .eq("course_id", courseId)
        .order("position", { ascending: true })
        .order("id", { ascending: true }),
      sb
        .from("course_questions")
        .select("id, position, text, options")
        .eq("course_id", courseId)
        .order("position", { ascending: true })
        .order("id", { ascending: true }),
    ]);
    if (stepsRes.error) throw stepsRes.error;
    if (questionsRes.error) throw questionsRes.error;

    const user = await getCurrentUser();
    let attempts = [];
    if (user) {
      const { data, error } = await sb
        .from("course_attempts")
        .select("id, score, total, passed, created_at")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      attempts = (data ?? []).map((a) => ({
        ...a,
        percent: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
      }));
    }

    return NextResponse.json({
      ...course,
      steps: stepsRes.data ?? [],
      questions: questionsRes.data ?? [],
      my_attempts: attempts,
    });
  } catch (err) {
    console.error("GET /api/courses/[id] error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
