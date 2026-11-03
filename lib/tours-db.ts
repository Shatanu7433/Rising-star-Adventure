import "server-only";
import { supabaseAdmin, hasSupabase } from "./supabase";

export type ItineraryDay = { day: number; title: string; description: string };

export type Tour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  summary: string;
  description: string;
  price: number;
  duration: string;
  difficulty: string;
  image: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type TourInput = Omit<Tour, "id" | "created_at" | "updated_at">;

/** Public site: published tours only. Falls back to data/tours.ts if Supabase isn't configured. */
export async function getPublishedTours(): Promise<Tour[]> {
  if (!hasSupabase()) return fallbackTours();
  const { data, error } = await supabaseAdmin()
    .from("tours").select("*").eq("published", true)
    .order("sort_order").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Tour[];
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  if (!hasSupabase()) return (await fallbackTours()).find((t) => t.slug === slug) ?? null;
  const { data, error } = await supabaseAdmin()
    .from("tours").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw error;
  return (data as Tour) ?? null;
}

/** Admin: everything, including drafts. */
export async function getAllTours(): Promise<Tour[]> {
  const { data, error } = await supabaseAdmin()
    .from("tours").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Tour[];
}

export async function getTourById(id: string): Promise<Tour | null> {
  const { data, error } = await supabaseAdmin().from("tours").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Tour) ?? null;
}

// Fallback: maps your existing data/tours.ts into the Tour shape.
async function fallbackTours(): Promise<Tour[]> {
  const mod: any = await import("@/data/tours");
  const list: any[] = mod.TOURS ?? mod.tours ?? mod.default ?? [];
  return list.map((t, i) => ({
    id: t.id ?? t.slug,
    slug: t.slug,
    title: t.title ?? t.name,
    location: t.location ?? t.destination ?? "",
    summary: t.summary ?? t.tagline ?? "",
    description: t.description ?? t.overview ?? "",
    price: Number(t.price ?? t.priceInr ?? 0),
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
}
