import type { Metadata } from "next";
import Link from "next/link";
import TourCatalog from "@/components/TourCatalog";
import { getPublishedTours } from "@/lib/tours-db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tours",
  description: "Browse small-group adventure tours across India: mountains, deserts, coasts and wildlife, with transparent pricing.",
};

export default async function ToursPage() {
  const tours = await getPublishedTours();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">All journeys</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
        Find your <span className="text-gradient">adventure</span>
      </h1>
      <p className="mt-4 max-w-xl text-white/65">
        Filter by destination, length and budget. Every price is per person with inclusions and exclusions listed clearly.
      </p>

      <div className="mt-10">
        <TourCatalog tours={tours} />
      </div>

      <div className="card mt-16 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-extrabold">Don&apos;t see your dream trip?</h2>
          <p className="mt-1 text-sm text-white/60">We design custom itineraries for friends, families and teams.</p>
        </div>
        <Link href="/custom-trip" className="btn-primary shrink-0">Plan a custom trip</Link>
      </div>
    </div>
  );
}
