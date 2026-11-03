"use client";

import { useMemo, useState } from "react";
import type { Tour } from "@/data/tours";
import TourCard from "@/components/TourCard";

const DURATIONS = [
  { label: "Any length", test: () => true },
  { label: "Up to 4 days", test: (t: Tour) => t.days <= 4 },
  { label: "5–6 days", test: (t: Tour) => t.days >= 5 && t.days <= 6 },
  { label: "7+ days", test: (t: Tour) => t.days >= 7 },
];

const BUDGETS = [
  { label: "Any budget", test: () => true },
  { label: "Under ₹15,000", test: (t: Tour) => t.priceInr < 15000 },
  { label: "₹15,000 – ₹25,000", test: (t: Tour) => t.priceInr >= 15000 && t.priceInr <= 25000 },
  { label: "₹25,000+", test: (t: Tour) => t.priceInr > 25000 },
];

export default function TourCatalog({ tours }: { tours: Tour[] }) {
  const [q, setQ] = useState("");
  const [dest, setDest] = useState("All");
  const [dur, setDur] = useState(0);
  const [bud, setBud] = useState(0);

  const destinations = useMemo(() => ["All", ...Array.from(new Set(tours.map((t) => t.destination)))], [tours]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tours.filter(
      (t) =>
        (dest === "All" || t.destination === dest) &&
        DURATIONS[dur].test(t) &&
        BUDGETS[bud].test(t) &&
        (!needle ||
          `${t.title} ${t.destination} ${t.region} ${t.tags.join(" ")}`.toLowerCase().includes(needle)),
    );
  }, [tours, q, dest, dur, bud]);

  return (
    <div>
      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className="field"
          type="search"
          placeholder="Search trips…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search trips"
        />
        <select className="field" value={dest} onChange={(e) => setDest(e.target.value)} aria-label="Destination">
          {destinations.map((d) => (
            <option key={d} value={d}>{d === "All" ? "All destinations" : d}</option>
          ))}
        </select>
        <select className="field" value={dur} onChange={(e) => setDur(Number(e.target.value))} aria-label="Duration">
          {DURATIONS.map((d, i) => (
            <option key={d.label} value={i}>{d.label}</option>
          ))}
        </select>
        <select className="field" value={bud} onChange={(e) => setBud(Number(e.target.value))} aria-label="Budget">
          {BUDGETS.map((b, i) => (
            <option key={b.label} value={i}>{b.label}</option>
          ))}
        </select>
      </div>

      <p className="mt-6 text-sm text-white/50" aria-live="polite">
        {results.length} {results.length === 1 ? "trip" : "trips"} found
      </p>

      {results.length ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      ) : (
        <div className="card mt-6 p-10 text-center">
          <p className="text-lg font-bold">Nothing matches those filters.</p>
          <p className="mt-1 text-sm text-white/60">Try widening them, or tell us what you have in mind.</p>
        </div>
      )}
    </div>
  );
}
