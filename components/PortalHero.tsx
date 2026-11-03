"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappLink } from "@/lib/site";

// Deterministic star field (no Math.random, so server and client render identically)
const STARS = Array.from({ length: 70 }, (_, i) => {
  const a = (i * 9301 + 49297) % 233280;
  const b = (i * 7919 + 12345) % 233280;
  return {
    x: (a / 233280) * 100,
    y: (b / 233280) * 62,
    r: 0.6 + ((i * 37) % 10) / 8,
    o: 0.35 + ((i * 53) % 10) / 15,
  };
});

/**
 * Scroll-driven portal: the page starts "outside" (dark, logo + ring). As you scroll, the ring
 * expands and you step through into the adventure world (sunset peaks), then the page continues.
 */
export default function PortalHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const r = useTransform(p, [0, 0.72], [11, 90]); // portal radius in vmax
  const clip = useTransform(r, (v) => `circle(${v}vmax at 50% 64%)`);
  const ringSize = useTransform(r, (v) => `${v * 2}vmax`);
  const ringOpacity = useTransform(p, [0.5, 0.78], [1, 0]);

  const outerOpacity = useTransform(p, [0, 0.3], [1, 0]);
  const outerY = useTransform(p, [0, 0.3], [0, -70]);
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

  const sceneScale = useTransform(p, [0, 1], [1.3, 1]);
  const farY = useTransform(p, [0, 1], [30, -30]);
  const midY = useTransform(p, [0, 1], [60, -10]);
  const nearY = useTransform(p, [0, 1], [110, 0]);
  const sunY = useTransform(p, [0, 1], [90, -20]);

  const titleOpacity = useTransform(p, [0.66, 0.86], [0, 1]);
  const titleY = useTransform(p, [0.66, 0.86], [50, 0]);

  return (
    <section ref={ref} className="relative h-[320vh]" aria-label="Rising Stars Adventure introduction">
      <div className="sticky top-0 h-screen min-h-[560px] w-full overflow-hidden bg-ink">
        {/* ---------- OUTSIDE: dark threshold ---------- */}
        <motion.div
          style={{ opacity: outerOpacity, y: outerY }}
          className="pointer-events-none absolute inset-x-0 top-[11%] z-10 flex flex-col items-center px-5 text-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Rising Stars Adventure"
            width={150}
            height={150}
            className="h-24 w-24 rounded-2xl object-cover shadow-[0_0_60px_rgba(255,138,31,0.35)] sm:h-32 sm:w-32"
          />
          <h1 className="mt-5 text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Rising <span className="text-gradient">Stars</span> Adventure
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/65 sm:text-base">
            Small-group journeys from Nagpur to the edge of the map.
          </p>
        </motion.div>

        {/* Ambient stars on the dark side */}
        <div className="absolute inset-0" aria-hidden="true">
          {STARS.slice(0, 40).map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, opacity: s.o * 0.6 }}
            />
          ))}
        </div>

        {/* ---------- THE WORLD (revealed through the portal) ---------- */}
        <motion.div style={{ clipPath: clip, WebkitClipPath: clip }} className="absolute inset-0 z-20">
          <motion.div style={{ scale: sceneScale }} className="absolute inset-0 origin-[50%_64%]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,#07040a 0%,#1d0b12 28%,#5a1d10 55%,#b8531a 76%,#ff8a1f 92%,#ffc247 100%)",
              }}
            />
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y * 0.8}%`, width: s.r, height: s.r, opacity: s.o }}
              />
            ))}

            <motion.svg
              style={{ y: sunY }}
              className="absolute inset-x-0 bottom-0 h-full w-full"
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMax slice"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="sun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff3c4" />
                  <stop offset="45%" stopColor="#ffc247" />
                  <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="800" cy="640" r="330" fill="url(#sun)" opacity="0.7" />
              <circle cx="800" cy="640" r="105" fill="#ffd978" />
            </motion.svg>

            <motion.svg style={{ y: farY }} className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d="M0 640 L170 470 L310 570 L520 360 L700 560 L900 430 L1110 580 L1320 410 L1500 540 L1600 490 L1600 900 L0 900Z" fill="#3a1408" />
            </motion.svg>
            <motion.svg style={{ y: midY }} className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d="M0 720 L210 540 L400 660 L650 470 L870 670 L1090 520 L1330 690 L1600 560 L1600 900 L0 900Z" fill="#240c05" />
            </motion.svg>
            <motion.svg style={{ y: nearY }} className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d="M0 820 L260 700 L520 800 L800 660 L1100 810 L1380 710 L1600 800 L1600 900 L0 900Z" fill="#0a0403" />
              {/* pines */}
              {[120, 190, 1350, 1430, 1520].map((x, i) => (
                <path key={x} d={`M${x} ${800 + (i % 2) * 14} l-34 90 h68z M${x} ${770 + (i % 2) * 14} l-26 70 h52z`} fill="#050202" />
              ))}
            </motion.svg>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </motion.div>

          {/* World copy */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="absolute inset-x-0 top-[15%] z-10 flex flex-col items-center px-5 text-center"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[125%] bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,0,0,0.6),transparent_68%)]"
            />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold sm:text-sm">You&apos;re through</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Where the road ends, <span className="text-gradient">the story begins.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-lg">
              Himalayas, deserts, coasts and rainforests with trip captains who know every turn and pricing with no surprises.
            </p>
            <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link href="/tours" className="btn-primary">Explore tours</Link>
              <Link href="/custom-trip" className="btn-ghost">Plan a custom trip</Link>
              <a
                href={whatsappLink("Hi Rising Stars Adventure! I'd like to know more about your trips.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !border-wa/50 !text-wa"
              >
                <WhatsAppIcon /> WhatsApp us
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- THE PORTAL RING ---------- */}
        <motion.div
          aria-hidden="true"
          style={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
          className="pointer-events-none absolute left-1/2 top-[64%] z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ember/90 shadow-[0_0_70px_rgba(255,138,31,0.55),inset_0_0_70px_rgba(255,138,31,0.3),0_0_140px_rgba(214,51,108,0.25)]"
        />

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70"
        >
          Scroll to step through
          <span className="h-9 w-5 rounded-full border border-white/40 p-1">
            <span className="block h-2 w-full animate-bounce rounded-full bg-ember" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
