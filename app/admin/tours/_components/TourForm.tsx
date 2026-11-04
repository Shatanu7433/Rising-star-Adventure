"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Tour, TourInput, ItineraryDay } from "@/lib/tours-db";

type FormTour = TourInput;

const EMPTY: FormTour = {
  slug: "", title: "", location: "", summary: "", description: "", price: 0,
  duration: "", difficulty: "", image: "", highlights: [], itinerary: [],
  published: false, sort_order: 0,
};

const input = "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30";
const label = "block text-sm font-medium text-stone-700";

export default function TourForm({ tour }: { tour?: Tour }) {
  const router = useRouter();
  const [t, setT] = useState<FormTour>(
    tour
      ? {
          slug: tour.slug,
          title: tour.title,
          location: tour.location,
          summary: tour.summary,
          description: tour.description,
          price: tour.price,
          duration: tour.duration,
          difficulty: tour.difficulty,
          image: tour.image,
          highlights: tour.highlights,
          itinerary: tour.itinerary,
          published: tour.published,
          sort_order: tour.sort_order,
        }
      : EMPTY
  );
  const [highlightsText, setHighlightsText] = useState((tour?.highlights ?? []).join("\n"));
  const [slugTouched, setSlugTouched] = useState(Boolean(tour));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof FormTour>(k: K, v: FormTour[K]) => setT((p) => ({ ...p, [k]: v }));
  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  function updateDay(i: number, patch: Partial<ItineraryDay>) {
    set("itinerary", t.itinerary.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }
  function moveDay(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= t.itinerary.length) return;
    const next = [...t.itinerary];
    [next[i], next[j]] = [next[j], next[i]];
    set("itinerary", next);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const payload = { ...t, highlights: highlightsText.split("\n").map((s) => s.trim()).filter(Boolean) };
    const res = await fetch(tour ? `/api/admin/tours/${tour.id}` : "/api/admin/tours", {
      method: tour ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) { setError((await res.json().catch(() => ({}))).error || "Could not save"); return; }
    router.push("/admin/tours"); router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="font-semibold text-stone-900">Basics</h2>
        <div>
          <label className={label} htmlFor="title">Title</label>
          <input id="title" required className={input} value={t.title}
            onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="slug">Page address</label>
            <div className="flex items-center">
              <span className="mt-1 rounded-l-md border border-r-0 border-stone-300 bg-stone-50 px-2 py-2 text-sm text-stone-500">/tours/</span>
              <input id="slug" required className={`${input} rounded-l-none`} value={t.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="location">Location</label>
            <input id="location" className={input} value={t.location} onChange={(e) => set("location", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor="price">Price per person (₹)</label>
            <input id="price" type="number" min={0} className={input} value={t.price} onChange={(e) => set("price", Number(e.target.value))} />
          </div>
          <div>
            <label className={label} htmlFor="duration">Duration</label>
            <input id="duration" placeholder="5 days / 4 nights" className={input} value={t.duration} onChange={(e) => set("duration", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="difficulty">Difficulty</label>
            <input id="difficulty" placeholder="Easy, Moderate, Hard" className={input} value={t.difficulty} onChange={(e) => set("difficulty", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="image">Cover image URL</label>
          <input id="image" type="url" placeholder="https://..." className={input} value={t.image} onChange={(e) => set("image", e.target.value)} />
          {t.image && <img src={t.image} alt="Cover preview" className="mt-2 h-32 w-56 rounded-md object-cover" />}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="font-semibold text-stone-900">Description</h2>
        <div>
          <label className={label} htmlFor="summary">Short summary (shown on the trip card)</label>
          <input id="summary" className={input} value={t.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="description">Full description</label>
          <textarea id="description" rows={6} className={input} value={t.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="highlights">Highlights (one per line)</label>
          <textarea id="highlights" rows={4} className={input} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Itinerary</h2>
          <button type="button" onClick={() => set("itinerary", [...t.itinerary, { day: t.itinerary.length + 1, title: "", description: "" }])}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50">Add day</button>
        </div>
        {t.itinerary.length === 0 && <p className="text-sm text-stone-500">No days yet. Add the first day of the trip.</p>}
        {t.itinerary.map((d, i) => (
          <div key={i} className="rounded-md border border-stone-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">Day {i + 1}</span>
              <div className="flex gap-3 text-sm">
                <button type="button" onClick={() => moveDay(i, -1)} disabled={i === 0} className="text-stone-600 disabled:opacity-30">Move up</button>
                <button type="button" onClick={() => moveDay(i, 1)} disabled={i === t.itinerary.length - 1} className="text-stone-600 disabled:opacity-30">Move down</button>
                <button type="button" onClick={() => set("itinerary", t.itinerary.filter((_, idx) => idx !== i))} className="text-red-700">Remove</button>
              </div>
            </div>
            <input aria-label={`Day ${i + 1} title`} placeholder="Day title" className={input} value={d.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
            <textarea aria-label={`Day ${i + 1} description`} placeholder="What happens this day" rows={3} className={input} value={d.description} onChange={(e) => updateDay(i, { description: e.target.value })} />
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center gap-6 rounded-lg border border-stone-200 bg-white p-5">
        <label className="flex items-center gap-2 text-sm text-stone-800">
          <input type="checkbox" checked={t.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-teal-800" />
          Published (visible on the website)
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-800">
          Order
          <input type="number" value={t.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="w-20 rounded-md border border-stone-300 px-2 py-1" />
          <span className="text-stone-500">lower shows first</span>
        </label>
      </section>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-3">
        <button disabled={busy} className="rounded-md bg-teal-800 px-5 py-2 font-medium text-white hover:bg-teal-900 disabled:opacity-50">
          {busy ? "Saving..." : tour ? "Save changes" : "Create trip"}
        </button>
        <button type="button" onClick={() => router.push("/admin/tours")} className="rounded-md border border-stone-300 px-5 py-2 text-stone-700 hover:bg-stone-50">Cancel</button>
      </div>
    </form>
  );
}
