import pool from "@/lib/pool";

/**
 * Best-effort вставка в notifications для конкретного гида.
 * Никогда не бросает — сбой уведомления не должен ломать основную операцию.
 */
export async function notifyOrg(orgId, type, payload = {}) {
  if (!orgId || !type) return;
  try {
    await pool.query(
      `INSERT INTO notifications (recipient_type, recipient_org_id, type, payload)
       VALUES ('org', $1, $2, $3::jsonb)`,
      [orgId, type, JSON.stringify(payload)],
    );
  } catch (err) {
    console.error("[notifyOrg]", { orgId, type, err });
  }
}

/**
 * Best-effort вставка в общий admin-inbox (recipient_type='admin',
 * recipient_org_id=NULL). Видно всем админам, синхронная "прочитанность".
 */
export async function notifyAdmins(type, payload = {}) {
  if (!type) return;
  try {
    await pool.query(
      `INSERT INTO notifications (recipient_type, type, payload)
       VALUES ('admin', $1, $2::jsonb)`,
      [type, JSON.stringify(payload)],
    );
  } catch (err) {
    console.error("[notifyAdmins]", { type, err });
  }
}
