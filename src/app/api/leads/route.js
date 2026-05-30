import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";
import { notifyOrg, notifyAdmins } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const ALLOWED_KINDS = new Set([
  "tour_request",
  "tour_calculator",
  "tour_booking",
  "endowment",
  "legal_consult",
  "insurance_request",
  "tickets_request",
  "kids_go_free",
]);

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

function intOrNull(value) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const kind = clean(body.kind, 32);
  if (!kind || !ALLOWED_KINDS.has(kind)) {
    return NextResponse.json({ error: "Неизвестный тип заявки" }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);

  let contactMethod = clean(body.contactMethod, 20);
  if (contactMethod && !ALLOWED_CONTACT_METHODS.has(contactMethod)) {
    contactMethod = null;
  }

  // Минимальная валидация: имя + способ связаться.
  if (!name) {
    return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: "Укажите телефон или email" },
      { status: 400 },
    );
  }

  const user = await getCurrentUser().catch(() => null);

  const tourId = intOrNull(body.tourId);
  const resortDirectionId = intOrNull(body.resortDirectionId);
  const resortBaseId = intOrNull(body.resortBaseId);

  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? body.data
      : {};

  const source = clean(body.source, 500);

  try {
    const { rows } = await pool.query(
      `INSERT INTO leads (
         kind, name, phone, email, contact_method, message,
         user_id, tour_id, resort_direction_id, resort_base_id,
         data, source
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12)
       RETURNING id, created_at`,
      [
        kind,
        name,
        phone,
        email,
        contactMethod,
        message,
        user?.id ?? null,
        tourId,
        resortDirectionId,
        resortBaseId,
        JSON.stringify(data),
        source,
      ],
    );

    const leadId = rows[0].id;

    let tourTitle = null;
    if (tourId) {
      const { rows: tourRows } = await pool.query(
        `SELECT org_id, title FROM tours WHERE id = $1`,
        [tourId],
      );
      const tour = tourRows[0];
      tourTitle = tour?.title ?? null;
      if (kind === "tour_booking" && tour?.org_id) {
        await notifyOrg(tour.org_id, "lead.new", {
          leadId,
          tourId,
          tourTitle,
          name,
          phone,
        });
      }
    }

    // Админам — любой kind (tour_booking, tour_request, endowment и т.д.).
    await notifyAdmins("admin.lead.new", {
      leadId,
      kind,
      name,
      phone,
      tourId,
      tourTitle,
    });

    return NextResponse.json({
      ok: true,
      lead: { id: leadId, createdAt: rows[0].created_at },
    });
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
