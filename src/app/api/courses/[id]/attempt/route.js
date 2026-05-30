import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST /api/courses/:id/attempt
// Body: { answers: [{ question_id: number, selected: 0..3 }] }
// Юзер берётся из сессии (cookie). Сервер сам считает score / passed.
export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { id } = await params;
    const courseId = Number(id);
    if (!Number.isInteger(courseId)) {
      return NextResponse.json({ error: "Некорректный id курса" }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
    }
    const answers = Array.isArray(body?.answers) ? body.answers : null;
    if (!answers) {
      return NextResponse.json({ error: "answers обязателен" }, { status: 400 });
    }

    const { data: courseRow, error: cErr } = await sb
      .from("courses")
      .select("id, published")
      .eq("id", courseId)
      .maybeSingle();
    if (cErr) throw cErr;
    if (!courseRow || !courseRow.published) {
      return NextResponse.json({ error: "Курс недоступен" }, { status: 404 });
    }

    const { data: qRows, error: qErr } = await sb
      .from("course_questions")
      .select("id, correct")
      .eq("course_id", courseId);
    if (qErr) throw qErr;
    if (!qRows || qRows.length === 0) {
      return NextResponse.json({ error: "У курса нет вопросов" }, { status: 400 });
    }

    const correctByQ = new Map(qRows.map((q) => [Number(q.id), Number(q.correct)]));
    const total = qRows.length;
    const seen = new Set();
    const stored = [];
    let score = 0;

    for (const a of answers) {
      const qid = Number(a?.question_id);
      const sel = Number(a?.selected);
      if (!correctByQ.has(qid) || seen.has(qid)) continue;
      if (!Number.isInteger(sel) || sel < 0 || sel > 3) continue;
      seen.add(qid);
      const correct = correctByQ.get(qid);
      const isCorrect = sel === correct;
      if (isCorrect) score += 1;
      stored.push({ question_id: qid, selected: sel, correct, is_correct: isCorrect });
    }

    const passed = score === total;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    const { data: ins, error: insErr } = await sb
      .from("course_attempts")
      .insert({
        course_id: courseId,
        user_id: user.id,
        score,
        total,
        passed,
        answers: stored,
      })
      .select("id, score, total, passed, answers, created_at")
      .single();
    if (insErr) throw insErr;

    return NextResponse.json(
      {
        ...ins,
        percent,
        correct_count: score,
        wrong_count: total - score,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST /api/courses/[id]/attempt error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
