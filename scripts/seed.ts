// Imports the trips from data/tours.ts into Supabase. Safe to re-run (upserts by slug).
// Run: npm run seed
import { createClient } from "@supabase/supabase-js";
import { TOURS as local } from "../data/tours";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first."); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });

const rows = (local as any[]).map((t, i) => ({
  slug: t.slug,
  title: t.title ?? t.name,
  location: t.location ?? t.destination ?? "",
  summary: t.summary ?? t.tagline ?? "",
  description: t.description ?? t.overview ?? "",
  price: Math.round(Number(t.price ?? t.priceInr ?? 0)),
  duration: t.duration ?? (t.days ? `${t.days}D / ${t.nights}N` : ""),
  difficulty: t.difficulty ?? "",
  image: t.image ?? "",
  highlights: t.highlights ?? [],
  itinerary: (t.itinerary ?? []).map((d: any, n: number) => ({
    day: d.day ?? n + 1,
    title: d.title ?? "",
    description: d.description ?? d.details ?? d.text ?? "",
  })),
  published: true,
  sort_order: i,
}));

const { error } = await sb.from("tours").upsert(rows, { onConflict: "slug" });
if (error) { console.error(error.message); process.exit(1); }
console.log(`Imported ${rows.length} trips.`);
