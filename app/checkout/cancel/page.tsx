import type { Metadata } from "next";
import Link from "next/link";
import { getTourBySlug } from "@/lib/tours-db";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Checkout cancelled", robots: { index: false } };

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ tour?: string }> }) {
  const { tour: slug } = await searchParams;
  const tour = slug ? await getTourBySlug(slug) : null;

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-28 text-center sm:px-6 sm:pt-32">
      <p className="text-5xl" aria-hidden="true">🧳</p>
      <h1 className="mt-4 text-3xl font-black sm:text-5xl">Payment not completed</h1>
      <p className="mt-3 text-white/65">
        No worries, you haven&apos;t been charged. Your spot isn&apos;t held yet, so you can pick up right where you left off or ask us anything.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href={tour ? `/tours/${tour.slug}` : "/tours"} className="btn-primary">
          {tour ? `Back to ${tour.title}` : "Browse tours"}
        </Link>
        <a
          href={whatsappLink("Hi! I had trouble completing my booking and need help.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Get help on WhatsApp
        </a>
      </div>
    </div>
  );
}
