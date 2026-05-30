import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sb from "@/lib/supabase";

const MAX_ADULTS = 2;
const MAX_CHILDREN = 3;

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

    const { data, error } = await sb
      .from("family_members")
      .select("id, name, type, relation, age")
      .eq("user_id", user.id)
      .order("type")
      .order("id");

    if (error) throw error;
    return NextResponse.json({ members: (data ?? []).map(serialize) });
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

    const { data: existing } = await sb
      .from("family_members")
      .select("id, type")
      .eq("user_id", user.id);

    const adults = (existing ?? []).filter((m) => m.type === "adult").length;
    const children = (existing ?? []).filter((m) => m.type === "child").length;

    if (type === "adult" && adults >= MAX_ADULTS) {
      return NextResponse.json({ error: `Максимум ${MAX_ADULTS} взрослых` }, { status: 409 });
    }
    if (type === "child" && children >= MAX_CHILDREN) {
      return NextResponse.json({ error: `Максимум ${MAX_CHILDREN} детей` }, { status: 409 });
    }

    const { data: row, error } = await sb
      .from("family_members")
      .insert({ user_id: user.id, name, type, relation: relation || null, age })
      .select("id, name, type, relation, age")
      .single();

    if (error) throw error;
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

    const { data, error } = await sb
      .from("family_members")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Участник не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("DELETE /api/family error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
