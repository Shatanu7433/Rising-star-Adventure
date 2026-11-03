import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { checkoutSchema } from "@/lib/schemas";
import { getTour } from "@/data/tours";
import { addBooking, attachStripeSession } from "@/lib/db";
import { notifyOwner } from "@/lib/notify";
import { formatINR, whatsappLink } from "@/lib/site";

const MIN_LEAD_MS = 48 * 60 * 60 * 1000;

function makeReference() {
  // 10 chars: RSA + 7 random base36 chars (fits VARCHAR(12))
  return "RSA" + randomBytes(5).toString("hex").slice(0, 7).toUpperCase();
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid booking details." }, { status: 400 });
  }
  const input = parsed.data;

  const tour = getTour(input.tourId);
  if (!tour) return NextResponse.json({ error: "Tour not found." }, { status: 404 });

  // Departure must be at least 48 hours ahead (India Standard Time).
  const departure = new Date(`${input.travelDate}T00:00:00+05:30`);
  if (Number.isNaN(departure.getTime()) || departure.getTime() - Date.now() < MIN_LEAD_MS) {
    return NextResponse.json({ error: "Departure date must be at least 48 hours in the future." }, { status: 400 });
  }

  // Price is always computed on the server from the tour data. The client total is never trusted.
  const total = tour.priceInr * input.travelers;
  const reference = makeReference();

  try {
    await addBooking({
      reference,
      tourId: tour.id,
      tourTitle: tour.title,
      travelDate: input.travelDate,
      travelers: input.travelers,
      totalAmountInr: total,
      customerName: input.name,
      customerPhone: input.phone,
      customerEmail: input.email,
    });
  } catch (err) {
    console.error("booking save failed", err);
    return NextResponse.json({ error: "Could not create your booking. Please try again or WhatsApp us." }, { status: 500 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // No Stripe configured: hand the traveller to WhatsApp to confirm and pay.
  if (!stripeKey) {
    await notifyOwner(`New booking request ${reference}`, [
      `${tour.title}, ${input.travelDate}, ${input.travelers} traveller(s)`,
      `Total: ${formatINR(total)}`,
      `${input.name} / ${input.phone} / ${input.email}`,
    ]);
    const msg =
      `Hi Rising Stars Adventure! I'd like to book ${tour.title} on ${input.travelDate} ` +
      `for ${input.travelers} traveller(s) (${formatINR(total)}). Booking ref: ${reference}. Name: ${input.name}.`;
    return NextResponse.json({ reference, mode: "whatsapp", url: whatsappLink(msg) });
  }

  // Stripe Checkout (hosted page, PCI-DSS handled by Stripe).
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("client_reference_id", reference);
  form.set("customer_email", input.email);
  form.set("success_url", `${origin}/checkout/success?ref=${reference}`);
  form.set("cancel_url", `${origin}/checkout/cancel?tour=${tour.slug}`);
  form.set("line_items[0][quantity]", String(input.travelers));
  form.set("line_items[0][price_data][currency]", "inr");
  form.set("line_items[0][price_data][unit_amount]", String(tour.priceInr * 100));
  form.set("line_items[0][price_data][product_data][name]", tour.title);
  form.set(
    "line_items[0][price_data][product_data][description]",
    `${tour.days}D/${tour.nights}N, departing ${input.travelDate}`,
  );
  form.set("metadata[reference]", reference);
  form.set("metadata[tour_id]", tour.id);
  form.set("metadata[travel_date]", input.travelDate);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const session = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
    if (!res.ok || !session.url || !session.id) {
      console.error("stripe error", session.error);
      return NextResponse.json({ error: "Payment could not be started. Please try again or WhatsApp us." }, { status: 502 });
    }
    await attachStripeSession(reference, session.id);
    return NextResponse.json({ reference, mode: "stripe", url: session.url });
  } catch (err) {
    console.error("stripe request failed", err);
    return NextResponse.json({ error: "Payment service unreachable. Please try again shortly." }, { status: 502 });
  }
}
