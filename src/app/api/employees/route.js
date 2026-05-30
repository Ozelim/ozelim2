import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";

export const dynamic = "force-dynamic";

const MAX_EMPLOYEES = 20;

function serialize(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email || "",
    dept: row.dept || "",
    status: row.status,
  };
}

function clean(value, max = 200) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.slice(0, max);
}

async function requireCorporate() {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован", status: 401 };
  if (user.pocket_type !== "corporate") {
    return { error: "Требуется корпоративный пакет", status: 403 };
  }
  return { user };
}

export async function GET() {
  const guard = await requireCorporate();
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, dept, status
       FROM corporate_employees
       WHERE user_id = $1
       ORDER BY id`,
      [guard.user.id],
    );
    return NextResponse.json({ employees: rows.map(serialize) });
  } catch (err) {
    console.error("GET /api/employees error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request) {
  const guard = await requireCorporate();
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  try {
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*)::int AS c FROM corporate_employees WHERE user_id = $1`,
      [guard.user.id],
    );
    const used = countRows[0]?.c ?? 0;
    const slots = MAX_EMPLOYEES - used;
    if (slots <= 0) {
      return NextResponse.json(
        { error: `Лимит ${MAX_EMPLOYEES} сотрудников исчерпан` },
        { status: 409 },
      );
    }

    // Массовый импорт.
    if (Array.isArray(body.bulk)) {
      const items = body.bulk
        .slice(0, slots)
        .map((it) => ({
          name: clean(it.name, 200),
          email: clean(it.email, 200),
          dept: clean(it.dept, 200),
        }))
        .filter((it) => it.name);

      if (items.length === 0) {
        return NextResponse.json({ employees: [] });
      }

      const values = [];
      const params = [];
      items.forEach((it, i) => {
        const o = i * 4;
        values.push(`($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4})`);
        params.push(guard.user.id, it.name, it.email, it.dept);
      });

      const { rows } = await pool.query(
        `INSERT INTO corporate_employees (user_id, name, email, dept)
         VALUES ${values.join(", ")}
         RETURNING id, name, email, dept, status`,
        params,
      );
      return NextResponse.json({ employees: rows.map(serialize) });
    }

    // Один.
    const name = clean(body.name, 200);
    const email = clean(body.email, 200);
    const dept = clean(body.dept, 200);
    if (!name) return NextResponse.json({ error: "Введите имя" }, { status: 400 });

    const { rows } = await pool.query(
      `INSERT INTO corporate_employees (user_id, name, email, dept)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, dept, status`,
      [guard.user.id, name, email, dept],
    );
    return NextResponse.json({ employee: serialize(rows[0]) });
  } catch (err) {
    console.error("POST /api/employees error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const guard = await requireCorporate();
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const id = Number.parseInt(body.id, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id обязателен" }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const dept = clean(body.dept, 200);
  const status = ["active", "inactive"].includes(body.status) ? body.status : null;

  try {
    const { rows } = await pool.query(
      `UPDATE corporate_employees
         SET name   = COALESCE($3, name),
             email  = COALESCE($4, email),
             dept   = COALESCE($5, dept),
             status = COALESCE($6, status)
       WHERE id = $1 AND user_id = $2
       RETURNING id, name, email, dept, status`,
      [id, guard.user.id, name, email, dept, status],
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    return NextResponse.json({ employee: serialize(rows[0]) });
  } catch (err) {
    console.error("PATCH /api/employees error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const guard = await requireCorporate();
  if (guard.error) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { searchParams } = new URL(request.url);
  const id = Number.parseInt(searchParams.get("id") || "", 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id обязателен" }, { status: 400 });
  }

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM corporate_employees WHERE id = $1 AND user_id = $2`,
      [id, guard.user.id],
    );
    if (rowCount === 0) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/employees error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
