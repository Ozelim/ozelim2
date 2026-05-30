import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/jwt";

export async function POST() {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
  c.delete("session_user_id"); // legacy
  return NextResponse.json({ ok: true });
}
