import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover" />
            <span className="font-extrabold uppercase tracking-wider">
              Rising <span className="text-gradient">Stars</span> Adventure
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/60">{SITE.tagline}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-ember">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/tours" className="hover:text-ember">All tours</Link></li>
            <li><Link href="/custom-trip" className="hover:text-ember">Plan a custom trip</Link></li>
            <li><Link href="/#contact" className="hover:text-ember">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-ember">Reach us</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><a href={`tel:${SITE.phoneTel}`} className="hover:text-ember">{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="break-all hover:text-ember">{SITE.email}</a></li>
            <li>{SITE.baseCity}</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </p>
    </footer>
  );
}
