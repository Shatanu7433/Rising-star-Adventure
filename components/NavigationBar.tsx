"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/tours", label: "Tours" },
  { href: "/custom-trip", label: "Custom Trip" },
  { href: "/#why", label: "Why Us" },
  { href: "/#contact", label: "Contact" },
];

export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Rising Stars Adventure logo" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
          <span className="text-sm font-extrabold uppercase tracking-wider sm:text-base">
            Rising <span className="text-gradient">Stars</span> Adventure
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-white/80 transition hover:text-ember">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/tours" className="btn-primary !py-2 text-sm">
              Book a Trip
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-black/95 px-4 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-4 text-lg font-semibold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/tours" onClick={() => setOpen(false)} className="btn-primary mt-5 w-full">
            Book a Trip
          </Link>
        </div>
      )}
    </header>
  );
}
