import Link from "next/link";
import PortalHero from "@/components/PortalHero";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import ContactCard from "@/components/ContactCard";
import { getPublishedTours } from "@/lib/tours-db";

export const revalidate = 60;

const WHY = [
  { icon: "💸", title: "Transparent pricing", text: "Every inclusion and exclusion is listed up front. The price you see is the price you pay." },
  { icon: "🧭", title: "Trip captains, not guides on a clock", text: "A dedicated captain stays with your group from the first pickup to the last goodbye." },
  { icon: "👥", title: "Small groups", text: "Capped group sizes keep trips personal, flexible and easy on the places we visit." },
  { icon: "💬", title: "Real humans on WhatsApp", text: "Questions before or during a trip? Message us directly and get a quick reply." },
];

const STEPS = [
  { n: "1", title: "Pick a trip", text: "Browse tours or tell us your dream plan." },
  { n: "2", title: "Choose date & travellers", text: "See the total instantly: no surprises." },
  { n: "3", title: "Book securely", text: "Confirm online and get an instant booking voucher." },
  { n: "4", title: "Pack and go", text: "We handle the rest. You make the memories." },
];

export default async function HomePage() {
  const allTours = await getPublishedTours();
  const featured = allTours.filter((t) => t.featured);
  const featuredTours = featured.length > 0 ? featured : allTours.slice(0, 3);

  return (
    <>
      <PortalHero />

      <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Featured journeys</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
            Pick your next <span className="text-gradient">horizon</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <TourCard tour={t} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/tours" className="btn-ghost">View all tours</Link>
        </div>
      </section>

      <section id="why" className="border-y border-white/10 bg-panel/60 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Why Rising Stars</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              Adventure without the <span className="text-gradient">fine print</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.07}>
                <div className="card h-full p-6">
                  <span className="text-3xl" aria-hidden="true">{w.icon}</span>
                  <h3 className="mt-4 text-lg font-extrabold">{w.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">From idea to boarding in four steps</h2>
        </Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <li className="relative rounded-3xl border border-white/10 p-6">
                <span className="text-5xl font-black text-gradient">{s.n}</span>
                <h3 className="mt-3 font-extrabold">{s.title}</h3>
                <p className="mt-1 text-sm text-white/60">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="contact" className="border-t border-white/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Get in touch</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Let&apos;s plan your <span className="text-gradient">next escape</span>
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Call, WhatsApp or email us, or send a custom trip inquiry and we&apos;ll design the journey around you.
            </p>
            <Link href="/custom-trip" className="btn-primary mt-7">Plan a custom trip</Link>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactCard />
          </Reveal>
        </div>
      </section>
    </>
  );
}
