import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { listAll } from "@/lib/db";

export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return "unconfigured" as const;
  const given = req.headers.get("x-admin-token") ?? "";
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b) ? ("ok" as const) : ("denied" as const);
}

export async function GET(req: Request) {
  const auth = authorized(req);
  if (auth === "unconfigured") {
    return NextResponse.json({ error: "Set ADMIN_TOKEN on the server to enable the admin panel." }, { status: 503 });
  }
  if (auth === "denied") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await listAll());
}
