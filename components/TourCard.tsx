import Link from "next/link";
import type { Tour } from "@/lib/tours-db";
import TourArt from "@/components/TourArt";
import { ArrowIcon } from "@/components/Icons";
import { formatINR } from "@/lib/site";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-ember/70"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-105">
          {tour.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
          ) : (
            <TourArt motif={tour.motif ?? "mountain"} palette={tour.palette ?? ["#ff8a1f", "#120700"]} id={tour.id} />
          )}
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold backdrop-blur">
          {tour.days}D / {tour.nights}N
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-gold backdrop-blur">
          {tour.difficulty}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-ember">{tour.destination}</p>
        <h3 className="mt-1 text-xl font-extrabold leading-snug">{tour.title}</h3>
        <p className="mt-2 flex-1 text-sm text-white/60">{tour.tagline}</p>
        <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-white/50">From</p>
            <p className="text-xl font-black text-gradient">{formatINR(tour.priceInr)}</p>
            <p className="text-[11px] text-white/45">per person, all-inclusive as listed</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/15 text-ember transition group-hover:bg-ember group-hover:text-black">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}
