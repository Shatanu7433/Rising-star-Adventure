"use client";

import { useMemo, useState } from "react";
import { formatINR, whatsappLink } from "@/lib/site";

interface Props {
  tourId: string;
  tourTitle: string;
  priceInr: number;
}

function isoDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingWidget({ tourId, tourTitle, priceInr }: Props) {
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minDate = useMemo(() => isoDate(3), []); // 48h rule, with a day of margin
  const total = priceInr * travelers;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!travelDate) return setError("Please choose a travel date.");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId, travelers, travelDate, name, phone, email }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-5 sm:p-6" aria-label={`Book ${tourTitle}`}>
      <p className="text-sm text-white/60">Price per person</p>
      <p className="text-3xl font-black text-gradient">{formatINR(priceInr)}</p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Travel date</span>
          <input
            type="date"
            required
            min={minDate}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="field"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-semibold">Travellers</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer travellers"
              onClick={() => setTravelers((n) => Math.max(1, n - 1))}
              className="h-11 w-11 rounded-xl border border-white/15 text-xl hover:border-ember"
            >
              −
            </button>
            <span className="w-10 text-center text-xl font-bold" aria-live="polite">{travelers}</span>
            <button
              type="button"
              aria-label="More travellers"
              onClick={() => setTravelers((n) => Math.min(30, n + 1))}
              className="h-11 w-11 rounded-xl border border-white/15 text-xl hover:border-ember"
            >
              +
            </button>
          </div>
        </div>

        <input className="field" required placeholder="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" required type="tel" inputMode="tel" placeholder="Phone / WhatsApp" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="field" required type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm text-white/60">Total ({travelers} × {formatINR(priceInr)})</span>
        <span className="text-xl font-black">{formatINR(total)}</span>
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-rose">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
        {loading ? "Please wait…" : "Book now"}
      </button>
      <a
        href={whatsappLink(`Hi! I have a question about ${tourTitle}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost mt-3 w-full"
      >
        Ask on WhatsApp first
      </a>
      <p className="mt-3 text-center text-xs text-white/40">Secure checkout. Free to start: no hidden surcharges.</p>
    </form>
  );
}
