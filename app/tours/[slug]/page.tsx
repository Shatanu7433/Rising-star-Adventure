import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedTours, getTourBySlug } from "@/lib/tours-db";
import TourArt from "@/components/TourArt";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import BookingWidget from "@/components/BookingWidget";
import { SITE, formatINR } from "@/lib/site";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  const tours = await getPublishedTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};
  return { title: tour.title, description: `${tour.tagline} ${tour.days} days / ${tour.nights} nights from ${formatINR(tour.priceInr)} per person.` };
}

export default async function TourPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.overview,
    touristType: tour.tags,
    itinerary: tour.itinerary.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Day ${d.day}: ${d.title}`,
      description: d.details ?? d.description ?? "",
    })),
    provider: { "@type": "TravelAgency", name: SITE.name, telephone: SITE.phoneTel, email: SITE.email },
    offers: {
      "@type": "Offer",
      price: tour.priceInr,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative h-[52vh] min-h-[340px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {tour.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
          ) : (
            <TourArt motif={tour.motif ?? "mountain"} palette={tour.palette ?? ["#ff8a1f", "#120700"]} id={`hero-${tour.id}`} />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <Link href="/tours" className="text-sm text-white/70 hover:text-ember">← All tours</Link>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-ember">{tour.destination} · {tour.region}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">{tour.title}</h1>
          <p className="mt-2 max-w-xl text-white/75">{tour.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-14">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Duration", `${tour.days}D / ${tour.nights}N`],
              ["Difficulty", tour.difficulty],
              ["Group size", tour.groupSize],
              ["Best season", tour.bestSeason],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-panel p-4">
                <dt className="text-xs uppercase tracking-widest text-white/45">{k}</dt>
                <dd className="mt-1 font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="text-2xl font-black">Overview</h2>
            <p className="mt-3 leading-relaxed text-white/70">{tour.overview}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {tour.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-white/80">
                  <span className="text-gold" aria-hidden="true">★</span> {h}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-black">Day-by-day itinerary</h2>
            <ItineraryTimeline days={tour.itinerary} />
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-lg font-extrabold text-wa">What&apos;s included</h2>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {tour.inclusions.map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-wa" aria-hidden="true">✓</span> {i}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="text-lg font-extrabold text-rose">What&apos;s not included</h2>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {tour.exclusions.map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-rose" aria-hidden="true">✕</span> {i}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget tourId={tour.id} tourTitle={tour.title} priceInr={tour.priceInr} />
        </aside>
      </div>
    </>
  );
}
