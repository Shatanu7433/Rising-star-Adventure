import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { parseTour } from "@/lib/tour-validate";

type Ctx = { params: Promise<{ id: string }> };

function refresh() {
  revalidatePath("/tours");
  revalidatePath("/tours/[slug]", "page");
  revalidatePath("/");
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = parseTour(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await supabaseAdmin().from("tours").update(parsed.value).eq("id", id).select().single();
  if (error) {
    const msg = error.code === "23505" ? "That slug is already used by another trip" : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  refresh();
  return NextResponse.json(data);
}

/** Partial update, used for the quick publish/draft toggle. */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (typeof body.published !== "boolean") return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  const { error } = await supabaseAdmin().from("tours").update({ published: body.published }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  refresh();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { error } = await supabaseAdmin().from("tours").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  refresh();
  return NextResponse.json({ ok: true });
}
