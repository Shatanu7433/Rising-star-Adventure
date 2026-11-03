import { NextResponse } from "next/server";
import { checkPassword, setSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(String(password ?? ""))) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  await setSession();
  return NextResponse.json({ ok: true });
}
