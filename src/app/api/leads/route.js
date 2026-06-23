import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";
import { notifyOrg, notifyAdmins } from "@/lib/notifications";
import { partnerSnapshot } from "@/lib/partner-pricing";

// Базовый итог калькулятора пересчитываем на сервере из выбранных услуг и состава
// группы — нельзя доверять сумме с клиента, раз от неё зависит «замороженная» цена.
function calculatorBaseTotal(data) {
  const adults = Number(data?.adults) || 0;
  const children = Number(data?.children) || 0;
  const services = Array.isArray(data?.services) ? data.services : [];
  let total = 0;
  for (const s of services) {
    total += (Number(s?.priceAdult) || 0) * adults + (Number(s?.priceChild) || 0) * children;
  }
  return total;
}

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

  // Партнёрский снимок цены — считаем на сервере (нельзя доверять клиенту).
  // Скидку и тарифы берём из БД по привязке заявки:
  //   - тур → tours.partner_discount_pct + price_adult/price_child (взрослый/детский);
  //   - калькулятор → resort_directions.partner_discount_pct, итог из услуг («Итого»);
  //   - заявка по направлению → resort_directions цены adults/youth/kids.
  // Кладём только для ценовых заявок (есть тур или направление).
  if (tourId || resortDirectionId) {
    try {
      let snapPct = null;
      let lines = [];
      if (tourId) {
        const { rows: pr } = await pool.query(
          `SELECT price_adult, price_child, partner_discount_pct FROM tours WHERE id = $1`,
          [tourId],
        );
        snapPct = pr[0]?.partner_discount_pct ?? null;
        lines = [
          { label: "Взрослый", price: pr[0]?.price_adult },
          { label: "Детский", price: pr[0]?.price_child },
        ];
      } else if (resortDirectionId) {
        const { rows: dr } = await pool.query(
          `SELECT partner_discount_pct, price_adults, price_kids, price_youth
             FROM resort_directions WHERE id = $1`,
          [resortDirectionId],
        );
        snapPct = dr[0]?.partner_discount_pct ?? null;
        if (kind === "tour_calculator") {
          lines = [{ label: "Итого", price: calculatorBaseTotal(data) }];
        } else {
          lines = [
            { label: "Взрослые", price: dr[0]?.price_adults },
            { label: "Молодёжь", price: dr[0]?.price_youth },
            { label: "Дети", price: dr[0]?.price_kids },
          ];
        }
      }
      data.partner = partnerSnapshot({ lines, pct: snapPct, user });
    } catch (e) {
      // Снимок — best-effort; не валим подачу заявки из-за него.
      console.error("[leads] partner snapshot failed:", e);
    }
  }

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
