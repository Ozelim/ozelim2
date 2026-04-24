import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sql from "@/lib/db";

const MAX_ADULTS = 2;
const MAX_CHILDREN = 3;

async function ensureFamilyTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS family_members (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name       TEXT NOT NULL,
      type       TEXT NOT NULL CHECK (type IN ('adult', 'child')),
      relation   TEXT,
      age        INTEGER NOT NULL CHECK (age >= 0 AND age < 150),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS family_members_user_id_idx ON family_members(user_id)`;
}

function serialize(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    relation: row.relation || "",
    age: row.age,
  };
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    await ensureFamilyTable();

    const rows = await sql`
      SELECT id, name, type, relation, age
      FROM family_members
      WHERE user_id = ${user.id}
      ORDER BY
        CASE WHEN type = 'adult' THEN 0 ELSE 1 END,
        created_at ASC,
        id ASC
    `;

    return NextResponse.json({ members: rows.map(serialize) });
  } catch (err) {
    console.error("GET /api/family error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const type = body.type === "child" ? "child" : "adult";
    const relation = String(body.relation || "").trim().slice(0, 80);
    const age = Number.parseInt(body.age, 10);

    if (!name) {
      return NextResponse.json({ error: "Введите имя" }, { status: 400 });
    }
    if (name.length > 120) {
      return NextResponse.json({ error: "Слишком длинное имя" }, { status: 400 });
    }
    if (!Number.isFinite(age) || age < 0 || age >= 150) {
      return NextResponse.json({ error: "Некорректный возраст" }, { status: 400 });
    }

    await ensureFamilyTable();

    const [{ adults, children }] = await sql`
      SELECT
        COUNT(*) FILTER (WHERE type = 'adult')::int AS adults,
        COUNT(*) FILTER (WHERE type = 'child')::int AS children
      FROM family_members
      WHERE user_id = ${user.id}
    `;

    if (type === "adult" && adults >= MAX_ADULTS) {
      return NextResponse.json(
        { error: `Максимум ${MAX_ADULTS} взрослых` },
        { status: 409 },
      );
    }
    if (type === "child" && children >= MAX_CHILDREN) {
      return NextResponse.json(
        { error: `Максимум ${MAX_CHILDREN} детей` },
        { status: 409 },
      );
    }

    const [row] = await sql`
      INSERT INTO family_members (user_id, name, type, relation, age)
      VALUES (${user.id}, ${name}, ${type}, ${relation || null}, ${age})
      RETURNING id, name, type, relation, age
    `;

    return NextResponse.json({ member: serialize(row) });
  } catch (err) {
    console.error("POST /api/family error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = Number.parseInt(searchParams.get("id") || "", 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id обязателен" }, { status: 400 });
    }

    await ensureFamilyTable();

    const rows = await sql`
      DELETE FROM family_members
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Участник не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("DELETE /api/family error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
