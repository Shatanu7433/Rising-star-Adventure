import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/schemas";
import { addInquiry } from "@/lib/db";
import { notifyOwner } from "@/lib/notify";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }

  const d = parsed.data;

  // Honeypot: bots fill this hidden field. Pretend success, store nothing.
  if (d.website) return NextResponse.json({ ok: true });

  try {
    const inquiry = await addInquiry({
      name: d.name,
      phone: d.phone,
      email: d.email ?? "",
      destination: d.destination,
      travelers: d.travelers,
      startDate: d.startDate ?? "",
      budget: d.budget ?? "",
      message: d.message ?? "",
      source: d.source ?? "website",
    });

    await notifyOwner(`New trip inquiry from ${d.name}`, [
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      `Email: ${d.email || "-"}`,
      `Destination: ${d.destination}`,
      `Travellers: ${d.travelers}`,
      `Dates: ${d.startDate || "-"}`,
      `Budget: ${d.budget || "-"}`,
      `Message: ${d.message || "-"}`,
    ]);

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("inquiry failed", err);
    return NextResponse.json({ error: "Could not save your inquiry. Please WhatsApp us instead." }, { status: 500 });
  }
}
