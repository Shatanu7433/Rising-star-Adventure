import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { setBookingStatus } from "@/lib/db";
import { notifyOwner } from "@/lib/notify";
import { formatINR } from "@/lib/site";

export const runtime = "nodejs";

function verify(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    }),
  ) as Record<string, string>;
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  // Reject events older than 5 minutes (replay protection)
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  if (!sig || !verify(body, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    type: string;
    data: { object: { client_reference_id?: string; amount_total?: number; payment_status?: string } };
  };

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const obj = event.data.object;
    const ref = obj.client_reference_id;
    if (ref && obj.payment_status === "paid") {
      const booking = await setBookingStatus(ref, "confirmed");
      if (booking) {
        await notifyOwner(`Booking confirmed ${ref}`, [
          `${booking.tourTitle}, ${booking.travelDate}, ${booking.travelers} traveller(s)`,
          `Paid: ${formatINR(booking.totalAmountInr)}`,
          `${booking.customerName} / ${booking.customerPhone} / ${booking.customerEmail}`,
        ]);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const ref = event.data.object.client_reference_id;
    if (ref) await setBookingStatus(ref, "cancelled");
  }

  return NextResponse.json({ received: true });
}
