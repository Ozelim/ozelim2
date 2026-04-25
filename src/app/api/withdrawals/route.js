import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import sql from "@/lib/db";

const ALLOWED_STATUSES = ["created", "success", "rejected"];

async function ensureSchema() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS frozen_balance INTEGER DEFAULT 0`;
  await sql`
    CREATE TABLE IF NOT EXISTS withdraw_requests (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount          INTEGER NOT NULL CHECK (amount > 0),
      bank_name       TEXT NOT NULL,
      iban            TEXT NOT NULL,
      account_holder  TEXT NOT NULL,
      iin             TEXT NOT NULL,
      status          TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'success', 'rejected')),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS withdraw_requests_user_id_idx ON withdraw_requests(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS withdraw_requests_created_at_idx ON withdraw_requests(created_at DESC)`;
}

function serialize(row) {
  return {
    id: row.id,
    amount: row.amount,
    bankName: row.bank_name,
    iban: row.iban,
    accountHolder: row.account_holder,
    iin: row.iin,
    status: ALLOWED_STATUSES.includes(row.status) ? row.status : "created",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    await ensureSchema();

    const rows = await sql`
      SELECT id, amount, bank_name, iban, account_holder, iin, status, created_at, updated_at
      FROM withdraw_requests
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC, id DESC
    `;

    return NextResponse.json({ withdrawals: rows.map(serialize) });
  } catch (err) {
    console.error("GET /api/withdrawals error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
    }

    const amount = Number.parseInt(body.amount, 10);
    const bankName = String(body.bankName ?? "").trim();
    const ibanRaw = String(body.iban ?? "").replace(/\s/g, "").toUpperCase();
    const accountHolder = String(body.accountHolder ?? "").trim();
    const iin = String(body.iin ?? "").trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Сумма должна быть больше 0" }, { status: 400 });
    }
    if (!bankName) {
      return NextResponse.json({ error: "Выберите банк" }, { status: 400 });
    }
    if (!ibanRaw) {
      return NextResponse.json({ error: "Введите IBAN" }, { status: 400 });
    }
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(ibanRaw)) {
      return NextResponse.json({ error: "Неверный формат IBAN" }, { status: 400 });
    }
    if (!accountHolder) {
      return NextResponse.json({ error: "Введите владельца счёта" }, { status: 400 });
    }
    if (!/^\d{12}$/.test(iin)) {
      return NextResponse.json({ error: "ИИН должен содержать ровно 12 цифр" }, { status: 400 });
    }

    await ensureSchema();

    // Atomic: deduct balance + freeze + create row only if balance is sufficient.
    const inserted = await sql`
      WITH updated_user AS (
        UPDATE users
        SET balance = balance - ${amount},
            frozen_balance = COALESCE(frozen_balance, 0) + ${amount}
        WHERE id = ${user.id} AND COALESCE(balance, 0) >= ${amount}
        RETURNING id, balance, COALESCE(frozen_balance, 0) AS frozen_balance
      )
      INSERT INTO withdraw_requests (user_id, amount, bank_name, iban, account_holder, iin, status)
      SELECT id, ${amount}, ${bankName}, ${ibanRaw}, ${accountHolder}, ${iin}, 'created'
      FROM updated_user
      RETURNING id, amount, bank_name, iban, account_holder, iin, status, created_at, updated_at
    `;

    if (inserted.length === 0) {
      return NextResponse.json({ error: "Недостаточно средств на балансе" }, { status: 409 });
    }

    const [{ balance, frozen_balance }] = await sql`
      SELECT balance, COALESCE(frozen_balance, 0) AS frozen_balance
      FROM users
      WHERE id = ${user.id}
    `;

    return NextResponse.json({
      withdrawal: serialize(inserted[0]),
      balance,
      frozenBalance: frozen_balance,
    });
  } catch (err) {
    console.error("POST /api/withdrawals error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
