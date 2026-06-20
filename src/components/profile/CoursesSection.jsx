"use client";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Award,
  ListChecks,
  Video,
  Loader2,
  RefreshCcw,
  ClipboardCheck,
} from "lucide-react";
import {
  Card,
  CardBody,
  Badge,
  Button,
  SectionHeader,
  EmptyState,
  cn,
} from "./ui";

// view: "list" | "course" | "test" | "result"

// Проходной балл теста — должен совпадать с сервером (см. /api/courses/[id]/attempt).
const PASS_PERCENT = 70;

function youtubeEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (/youtube\.com$/.test(u.hostname) || u.hostname === "www.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
      if (m) return `https://www.youtube.com/embed/${m[2]}`;
    }
  } catch {
    return null;
  }
  return null;
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function CourseCard({ course, onOpen }) {
  const best = course.my_best;
  return (
    <Card hover onClick={() => onOpen(course)}>
      <CardBody className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-(--profile-accent)" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3
              className="text-app-fg dark:text-white font-semibold text-base leading-tight"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18 }}
            >
              {course.title}
            </h3>
            {best ? (
              <Badge variant={best.passed ? "active" : best.percent >= 50 ? "pending" : "danger"}>
                {best.percent}%
              </Badge>
            ) : (
              <Badge variant="gold">Новый</Badge>
            )}
          </div>
          {course.description && (
            <p className="text-app-subtle dark:text-white/45 text-sm mt-1 line-clamp-2">
              {course.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-app-faint dark:text-white/35">
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              {course.steps_count} шагов
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5" />
              {course.questions_count} вопрос.
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-app-faint dark:text-white/30 self-center shrink-0" />
      </CardBody>
    </Card>
  );
}

function CourseDetail({ course, onBack, onStartTest }) {
  const hasTest = (course.questions?.length ?? 0) > 0;
  const lastAttempt = course.my_attempts?.[0] ?? null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
          К списку
        </Button>
      </div>

      <SectionHeader
        title={course.title}
        subtitle={course.description || "Учебный курс"}
      />

      {lastAttempt && (
        <Card>
          <CardBody className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                lastAttempt.passed
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30",
              )}
            >
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-app-fg dark:text-white font-semibold text-sm">
                Лучший результат: {lastAttempt.percent}%
              </div>
              <div className="text-app-faint dark:text-white/35 text-xs mt-0.5">
                {lastAttempt.score} из {lastAttempt.total} правильно · {formatDate(lastAttempt.created_at)}
              </div>
            </div>
            <Badge variant={lastAttempt.passed ? "active" : "pending"}>
              {lastAttempt.passed ? "Сдан" : "Не сдан"}
            </Badge>
          </CardBody>
        </Card>
      )}

      <div className="space-y-4">
        {course.steps?.length ? (
          course.steps.map((step, idx) => {
            const embed = youtubeEmbed(step.video_url);
            return (
              <Card key={step.id}>
                <CardBody className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-(--profile-accent-soft) border border-(--profile-accent-border) text-(--profile-accent) text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-app-fg dark:text-white font-semibold text-base">{step.title}</h4>
                  </div>
                  {step.description && (
                    <p className="text-app-subtle dark:text-white/55 text-sm whitespace-pre-wrap">
                      {step.description}
                    </p>
                  )}
                  {embed ? (
                    <div
                      className="rounded-xl overflow-hidden border border-app-border"
                      style={{ aspectRatio: "16/9", maxWidth: 640 }}
                    >
                      <iframe
                        src={embed}
                        title={step.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : step.video_url ? (
                    <a
                      href={step.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-(--profile-accent) underline-offset-2 hover:underline inline-block"
                    >
                      {step.video_url}
                    </a>
                  ) : null}
                </CardBody>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Шагов пока нет"
            subtitle="Скоро здесь появятся учебные материалы"
          />
        )}
      </div>

      {hasTest && (
        <div className="sticky bottom-4 z-10">
          <Card className="border-(--profile-accent)/40">
            <CardBody className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="text-app-fg dark:text-white font-semibold text-sm">
                  Тест по курсу
                </div>
                <div className="text-app-faint dark:text-white/35 text-xs mt-0.5">
                  {course.questions.length} вопрос. Проходной балл — {PASS_PERCENT}%.
                </div>
              </div>
              <Button onClick={onStartTest}>
                <ClipboardCheck className="w-4 h-4" />
                {lastAttempt ? "Пройти заново" : "Пройти тест"}
              </Button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

function TestRunner({ course, onCancel, onFinished }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const questions = course.questions ?? [];
  const answered = Object.keys(answers).length;

  function setAnswer(qid, idx) {
    setAnswers((a) => ({ ...a, [qid]: idx }));
  }

  async function submit() {
    setError(null);
    if (answered < questions.length) {
      setError("Ответьте на все вопросы");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((q) => ({
          question_id: q.id,
          selected: answers[q.id],
        })),
      };
      const res = await fetch(`/api/courses/${course.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Не удалось сохранить результат");
      onFinished(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ChevronLeft className="w-4 h-4" />
          К курсу
        </Button>
      </div>

      <SectionHeader
        title={`Тест: ${course.title}`}
        subtitle={`Отвечено ${answered} из ${questions.length}`}
      />

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <Card key={q.id}>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-(--profile-accent-soft) border border-(--profile-accent-border) text-(--profile-accent) text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-app-fg dark:text-white font-medium text-sm">
                  {q.text}
                </p>
              </div>
              <div className="space-y-2 pl-8">
                {(q.options || []).map((opt, oi) => {
                  const checked = answers[q.id] === oi;
                  return (
                    <label
                      key={oi}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition-all",
                        checked
                          ? "border-(--profile-accent)/50 bg-(--profile-accent-soft) text-(--profile-accent)"
                          : "border-app-border text-app-muted dark:text-white/60 hover:border-(--profile-accent)/30",
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={checked}
                        onChange={() => setAnswer(q.id, oi)}
                        className="accent-(--profile-accent) w-4 h-4 shrink-0"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Отмена
        </Button>
        <Button onClick={submit} disabled={submitting}>
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Отправить тест
        </Button>
      </div>
    </div>
  );
}

function ResultView({ course, result, onBackToCourse, onRetry, onBackToList }) {
  const percent = result.percent ?? 0;
  const passed = result.passed;
  const correct = result.correct_count ?? result.score ?? 0;
  const wrong = result.wrong_count ?? Math.max(0, (result.total ?? 0) - correct);

  return (
    <div className="space-y-5">
      <SectionHeader title="Результат теста" subtitle={course.title} />

      <Card>
        <CardBody className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center border-4",
                passed
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                  : percent >= 50
                  ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                  : "border-red-500/60 bg-red-500/10 text-red-400",
              )}
            >
              <span
                className="text-4xl font-bold"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {percent}%
              </span>
            </div>
            <Badge variant={passed ? "active" : "pending"}>
              {passed ? "✓ Тест сдан" : "Не сдан"}
            </Badge>
            <p className="text-app-subtle dark:text-white/45 text-sm text-center max-w-md">
              {passed
                ? `Поздравляем — тест сдан! Проходной балл — ${PASS_PERCENT}%.`
                : `Нужно набрать не менее ${PASS_PERCENT}%. Повторите материал и попробуйте ещё раз.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs text-app-faint dark:text-white/40 uppercase tracking-wider">
                  Правильно
                </div>
                <div className="text-app-fg dark:text-white text-xl font-bold leading-tight">
                  {correct}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <div className="text-xs text-app-faint dark:text-white/40 uppercase tracking-wider">
                  Неправильно
                </div>
                <div className="text-app-fg dark:text-white text-xl font-bold leading-tight">
                  {wrong}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="secondary" onClick={onBackToList}>
              К списку курсов
            </Button>
            <Button variant="secondary" onClick={onBackToCourse}>
              К материалам
            </Button>
            {!passed && (
              <Button onClick={onRetry}>
                <RefreshCcw className="w-4 h-4" />
                Пройти заново
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export function CoursesSection() {
  const [view, setView] = useState("list");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCourse, setActiveCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function loadList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ошибка");
      setItems(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  async function openCourse(course) {
    setActiveCourse(null);
    setView("course");
    setCourseLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ошибка");
      setActiveCourse(json);
    } catch (e) {
      setError(e.message);
      setView("list");
    } finally {
      setCourseLoading(false);
    }
  }

  function backToList() {
    setView("list");
    setActiveCourse(null);
    setResult(null);
    loadList();
  }

  const stats = useMemo(() => {
    const total = items.length;
    const passed = items.filter((c) => c.my_best?.passed).length;
    const attempted = items.filter((c) => c.my_best).length;
    const avg =
      attempted === 0
        ? null
        : Math.round(
            items.reduce((s, c) => s + (c.my_best?.percent ?? 0), 0) /
              attempted,
          );
    return { total, passed, attempted, avg };
  }, [items]);

  if (view === "course") {
    if (courseLoading || !activeCourse) {
      return (
        <div className="flex items-center justify-center py-16 text-app-subtle dark:text-white/45 text-sm">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Загрузка курса...
        </div>
      );
    }
    return (
      <CourseDetail
        course={activeCourse}
        onBack={backToList}
        onStartTest={() => setView("test")}
      />
    );
  }

  if (view === "test" && activeCourse) {
    return (
      <TestRunner
        course={activeCourse}
        onCancel={() => setView("course")}
        onFinished={(r) => {
          setResult(r);
          setView("result");
        }}
      />
    );
  }

  if (view === "result" && activeCourse && result) {
    return (
      <ResultView
        course={activeCourse}
        result={result}
        onBackToCourse={async () => {
          await openCourse(activeCourse);
        }}
        onRetry={() => {
          setResult(null);
          setView("test");
        }}
        onBackToList={backToList}
      />
    );
  }

  // list view
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Курсы"
        subtitle={
          stats.total === 0
            ? "Скоро здесь появятся обучающие материалы"
            : `${stats.total} курс${
                stats.total % 10 === 1 && stats.total % 100 !== 11 ? "" : "ов"
              } · сдано ${stats.passed} из ${stats.attempted || 0}`
        }
      />

      {stats.attempted > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-app-border bg-app-card/95 dark:bg-[#0a2a0a]/60 px-4 py-3">
            <div className="text-xs text-app-faint dark:text-white/40 uppercase tracking-wider">Всего</div>
            <div className="text-app-fg dark:text-white text-2xl font-bold mt-0.5">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-app-border bg-app-card/95 dark:bg-[#0a2a0a]/60 px-4 py-3">
            <div className="text-xs text-app-faint dark:text-white/40 uppercase tracking-wider">Пройдено</div>
            <div className="text-app-fg dark:text-white text-2xl font-bold mt-0.5">{stats.attempted}</div>
          </div>
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
            <div className="text-xs text-emerald-300/70 uppercase tracking-wider">Сдано</div>
            <div className="text-emerald-300 text-2xl font-bold mt-0.5">{stats.passed}</div>
          </div>
          <div className="rounded-2xl border border-(--profile-accent-border) bg-(--profile-accent-soft) px-4 py-3">
            <div className="text-xs text-(--profile-accent)/80 uppercase tracking-wider">Средний %</div>
            <div className="text-(--profile-accent) text-2xl font-bold mt-0.5">
              {stats.avg == null ? "—" : `${stats.avg}%`}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-app-subtle dark:text-white/45 text-sm">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Загрузка...
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Курсов пока нет"
          subtitle="Загляните позже — мы готовим обучающие материалы"
        />
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={openCourse} />
          ))}
        </div>
      )}
    </div>
  );
}
