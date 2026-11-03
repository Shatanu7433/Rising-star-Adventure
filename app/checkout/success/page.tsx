import type { Metadata } from "next";
import Link from "next/link";
import { getBooking } from "@/lib/db";
import { SITE, formatINR, whatsappLink } from "@/lib/site";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = { title: "Booking confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const booking = ref && /^[A-Z0-9]{6,12}$/.test(ref) ? await getBooking(ref) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <div className="text-center">
        <p className="text-5xl" aria-hidden="true">🎉</p>
        <h1 className="mt-4 text-3xl font-black sm:text-5xl">
          You&apos;re <span className="text-gradient">booked!</span>
        </h1>
        <p className="mt-3 text-white/65">
          {booking?.status === "confirmed"
            ? "Payment received. Here is your booking voucher."
            : "Thanks! We're confirming your payment. Your voucher is below and we'll message you shortly."}
        </p>
      </div>

      {booking ? (
        <div className="print-area card mt-10 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
            <div>
              <p className="font-extrabold uppercase tracking-wider">{SITE.name}</p>
              <p className="text-xs text-white/50">Booking voucher</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-white/50">Reference</dt><dd className="text-lg font-black text-gold">{booking.reference}</dd></div>
            <div><dt className="text-white/50">Status</dt><dd className="font-bold capitalize">{booking.status}</dd></div>
            <div className="col-span-2"><dt className="text-white/50">Trip</dt><dd className="font-bold">{booking.tourTitle}</dd></div>
            <div><dt className="text-white/50">Travel date</dt><dd className="font-bold">{booking.travelDate}</dd></div>
            <div><dt className="text-white/50">Travellers</dt><dd className="font-bold">{booking.travelers}</dd></div>
            <div><dt className="text-white/50">Total</dt><dd className="font-bold">{formatINR(booking.totalAmountInr)}</dd></div>
            <div><dt className="text-white/50">Contact</dt><dd className="font-bold">{SITE.phoneDisplay}</dd></div>
          </dl>
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-white/50">We couldn&apos;t find that booking reference. Please contact us and we&apos;ll sort it out.</p>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {booking && <PrintButton />}
        <a
          href={whatsappLink(booking ? `Hi! My booking reference is ${booking.reference}.` : "Hi! I need help with my booking.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Message us on WhatsApp
        </a>
        <Link href="/" className="btn-ghost">Back to home</Link>
      </div>
    </div>
  );
}
