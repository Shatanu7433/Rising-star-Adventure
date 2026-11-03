"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

const BUDGETS = ["Under ₹10,000", "₹10,000 – ₹20,000", "₹20,000 – ₹40,000", "₹40,000+", "Not sure yet"];

export default function InquiryForm({ defaultDestination = "" }: { defaultDestination?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "custom-trip" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl" aria-hidden="true">🌟</p>
        <h2 className="mt-3 text-2xl font-black">Inquiry received!</h2>
        <p className="mt-2 text-white/70">We&apos;ll get back to you shortly with a tailored plan and quote.</p>
        <a
          href={whatsappLink("Hi! I just sent a custom trip inquiry on your website.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6"
        >
          Chat on WhatsApp for a faster reply
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-8">
      {/* Honeypot (hidden from people, bots fill it) */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" name="name" required placeholder="Your name" autoComplete="name" />
        <input className="field" name="phone" required type="tel" inputMode="tel" placeholder="Phone / WhatsApp" autoComplete="tel" />
      </div>
      <input className="field" name="email" type="email" placeholder="Email (optional)" autoComplete="email" />
      <input className="field" name="destination" required placeholder="Where do you want to go?" defaultValue={defaultDestination} />
      <div className="grid gap-4 sm:grid-cols-3">
        <input className="field" name="travelers" required type="number" min={1} max={100} defaultValue={2} aria-label="Number of travellers" />
        <input className="field" name="startDate" placeholder="Rough dates (e.g. Dec 2026)" />
        <select className="field" name="budget" defaultValue="" aria-label="Budget per person">
          <option value="" disabled>Budget / person</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <textarea className="field min-h-32" name="message" placeholder="Tell us about your dream trip: interests, group, must-haves…" />

      {error && <p role="alert" className="text-sm text-rose">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
