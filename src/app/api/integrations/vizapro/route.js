import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import pool from "@/lib/pool";
import { notifyAdmins } from "@/lib/notifications";

// Приём заявок со стороннего сайта vizapro.kz (он тоже на Next.js).
//
// Схема server-to-server: форма vizapro шлёт данные на СВОЙ Next.js-роут,
// а тот уже пересылает их сюда с секретом в заголовке Authorization. Секрет
// живёт только в серверном env vizapro и нашем env — в браузер не попадает.
//
// Заявки падают в общую таблицу leads (kind='vizapro') и видны в админке
// (ozelim-admin2 → Заявки → таб «Vizapro») наравне с остальными.
export const dynamic = "force-dynamic";

const ALLOWED_CONTACT_METHODS = new Set([
  "whatsapp",
  "phone",
  "telegram",
  "email",
]);

function clean(value, max = 1000) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.slice(0, max);
}

// Константно-временное сравнение секрета (без утечки по таймингу/длине).
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// Секрет принимаем как "Authorization: Bearer <token>" либо "X-Api-Key: <token>".
function extractToken(request) {
  const auth = request.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) return m[1].trim();
  const apiKey = request.headers.get("x-api-key");
  return apiKey ? apiKey.trim() : null;
}

export async function POST(request) {
  // Fail-closed: пока секрет не задан в env — приём выключен.
  const expected = process.env.VIZAPRO_INGEST_TOKEN;
  if (!expected) {
    console.error("[vizapro] VIZAPRO_INGEST_TOKEN is not configured");
    return NextResponse.json(
      { error: "Integration is not configured" },
      { status: 503 },
    );
  }

  const token = extractToken(request);
  if (!token || !safeEqual(token, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);

  let contactMethod = clean(body.contactMethod, 20);
  if (contactMethod && !ALLOWED_CONTACT_METHODS.has(contactMethod)) {
    contactMethod = null;
  }

  // Минимальная валидация — как у обычных форм: имя + хоть один контакт.
  if (!name) {
    return NextResponse.json({ error: "Field 'name' is required" }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: "Either 'phone' or 'email' is required" },
      { status: 400 },
    );
  }

  // Контактные/служебные поля разбираем отдельно (см. RESERVED_KEYS), а ВСЁ
  // остальное из тела складываем в data как есть — так vizapro может слать свой
  // плоский JSON (serviceType, country, services…) без переделок. В админке
  // эти поля отрисуются в блоке «Детали заявки» автоматически.
  const RESERVED_KEYS = new Set([
    "kind",
    "name",
    "phone",
    "email",
    "message",
    "contactMethod",
    "contact_method",
    "externalId",
    "external_id",
    "source",
    "data",
  ]);

  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? { ...body.data }
      : {};

  if (body && typeof body === "object") {
    for (const [k, v] of Object.entries(body)) {
      if (RESERVED_KEYS.has(k) || v === undefined) continue;
      data[k] = v;
    }
  }

  // externalId — id заявки на стороне vizapro; защита от дублей при ретраях.
  const externalId = clean(body.externalId ?? body.external_id, 200);
  if (externalId) data.externalId = externalId;

  const source = clean(body.source, 500) || "vizapro.kz";

  try {
    if (externalId) {
      const { rows: dup } = await pool.query(
        `SELECT id, created_at
           FROM leads
          WHERE kind = 'vizapro' AND data->>'externalId' = $1
          LIMIT 1`,
        [externalId],
      );
      if (dup[0]) {
        return NextResponse.json({
          ok: true,
          duplicate: true,
          lead: { id: dup[0].id, createdAt: dup[0].created_at },
        });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO leads (
         kind, name, phone, email, contact_method, message, data, source
       ) VALUES ('vizapro', $1, $2, $3, $4, $5, $6::jsonb, $7)
       RETURNING id, created_at`,
      [name, phone, email, contactMethod, message, JSON.stringify(data), source],
    );

    const leadId = rows[0].id;

    // Уведомляем админов (best-effort — не валим приём заявки).
    await notifyAdmins("admin.lead.new", {
      leadId,
      kind: "vizapro",
      name,
      phone,
    }).catch((e) => console.error("[vizapro] notifyAdmins failed:", e));

    return NextResponse.json(
      { ok: true, lead: { id: leadId, createdAt: rows[0].created_at } },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST /api/integrations/vizapro error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
