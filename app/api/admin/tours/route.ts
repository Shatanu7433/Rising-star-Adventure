import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getAllTours } from "@/lib/tours-db";
import { parseTour } from "@/lib/tour-validate";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAllTours());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = parseTour(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await supabaseAdmin().from("tours").insert(parsed.value).select().single();
  if (error) {
    const msg = error.code === "23505" ? "That slug is already used by another trip" : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  revalidatePath("/tours");
  revalidatePath("/");
  return NextResponse.json(data, { status: 201 });
}
