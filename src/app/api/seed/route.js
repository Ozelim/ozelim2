export async function GET() {
  return Response.json({ ok: true, message: "Schema managed via db/migrations" });
}
