import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/pool";
import { notifyAdmins } from "@/lib/notifications";

const ALLOWED_STATUSES = ["created", "success", "rejected"];

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

    const { rows } = await pool.query(
      `SELECT id, amount, bank_name, iban, account_holder, iin, status, created_at, updated_at
       FROM withdraw_requests
       WHERE user_id = $1
       ORDER BY created_at DESC, id DESC`,
      [user.id],
    );

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

    // Atomic: deduct balance + freeze + create row only if balance is sufficient.
    const { rows: inserted } = await pool.query(
      `WITH updated_user AS (
        UPDATE users
        SET balance = balance - $1,
            frozen_balance = COALESCE(frozen_balance, 0) + $1
        WHERE id = $2 AND COALESCE(balance, 0) >= $1
        RETURNING id
      )
      INSERT INTO withdraw_requests (user_id, amount, bank_name, iban, account_holder, iin, status)
      SELECT id, $1, $3, $4, $5, $6, 'created'
      FROM updated_user
      RETURNING id, amount, bank_name, iban, account_holder, iin, status, created_at, updated_at`,
      [amount, user.id, bankName, ibanRaw, accountHolder, iin],
    );

    if (inserted.length === 0) {
      return NextResponse.json({ error: "Недостаточно средств на балансе" }, { status: 409 });
    }

    const { rows: [userRow] } = await pool.query(
      `SELECT balance, COALESCE(frozen_balance, 0) AS frozen_balance, name, email
       FROM users WHERE id = $1`,
      [user.id],
    );

    await notifyAdmins("admin.withdrawal.new", {
      withdrawalId: inserted[0].id,
      userId: user.id,
      userName: userRow.name || null,
      userEmail: userRow.email || null,
      amount,
      bankName,
    });

    return NextResponse.json({
      withdrawal: serialize(inserted[0]),
      balance: userRow.balance,
      frozenBalance: userRow.frozen_balance,
    });
  } catch (err) {
    console.error("POST /api/withdrawals error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
