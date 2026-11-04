import "server-only";
import { supabaseAdmin, hasSupabase } from "./supabase";

export type Motif = "mountain" | "dunes" | "waves" | "forest" | "snow";
export type Difficulty = "Easy" | "Moderate" | "Challenging" | string;

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  details?: string;
};

export type Tour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  destination: string;
  region: string;
  summary: string;
  tagline: string;
  description: string;
  overview: string;
  price: number;
  priceInr: number;
  duration: string;
  days: number;
  nights: number;
  difficulty: Difficulty;
  groupSize: string;
  bestSeason: string;
  tags: string[];
  image: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  motif?: Motif;
  palette?: [string, string];
  published: boolean;
  sort_order: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TourInput = {
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
};

function parseDays(duration?: string): number {
  if (!duration) return 5;
  const match = duration.match(/(\d+)\s*(?:d|days?)/i);
  return match ? parseInt(match[1], 10) : 5;
}

function parseNights(duration?: string, days = 5): number {
  if (!duration) return Math.max(1, days - 1);
  const match = duration.match(/(\d+)\s*(?:n|nights?)/i);
  return match ? parseInt(match[1], 10) : Math.max(1, days - 1);
}

export function normalizeTour(row: any, index = 0): Tour {
  const days = row.days ?? parseDays(row.duration);
  const nights = row.nights ?? parseNights(row.duration, days);
  const price = Number(row.price ?? row.priceInr ?? 0);
  const loc = row.location ?? row.destination ?? "";
  const sum = row.summary ?? row.tagline ?? "";
  const desc = row.description ?? row.overview ?? "";

  return {
    id: String(row.id ?? row.slug ?? index),
    slug: row.slug ?? "",
    title: row.title ?? row.name ?? "",
    location: loc,
    destination: loc || "India",
    region: row.region ?? loc ?? "India",
    summary: sum,
    tagline: sum,
    description: desc,
    overview: desc,
    price,
    priceInr: price,
    duration: row.duration ?? `${days}D / ${nights}N`,
    days,
    nights,
    difficulty: row.difficulty || "Moderate",
    groupSize: row.groupSize || row.group_size || "8–16 travellers",
    bestSeason: row.bestSeason || row.best_season || "Oct – May",
    tags: Array.isArray(row.tags) && row.tags.length > 0 ? row.tags : (row.highlights ?? []),
    image: row.image ?? "",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    inclusions: Array.isArray(row.inclusions) && row.inclusions.length > 0
      ? row.inclusions
      : ["Accommodations as per itinerary", "Internal transport", "Trip captain & guides", "Breakfast & dinner"],
    exclusions: Array.isArray(row.exclusions) && row.exclusions.length > 0
      ? row.exclusions
      : ["Personal expenses", "Camera fees", "Travel insurance"],
    itinerary: (row.itinerary ?? []).map((d: any, n: number) => ({
      day: d.day ?? n + 1,
      title: d.title ?? "",
      description: d.description ?? d.details ?? d.text ?? "",
      details: d.details ?? d.description ?? d.text ?? "",
    })),
    motif: row.motif || "mountain",
    palette: row.palette || ["#ff8a1f", "#120700"],
    published: row.published !== false,
    sort_order: row.sort_order ?? index,
    featured: Boolean(row.featured ?? index < 3),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Fallback: maps data/tours.ts
async function fallbackTours(): Promise<Tour[]> {
  const mod: any = await import("@/data/tours");
  const list: any[] = mod.TOURS ?? mod.tours ?? mod.default ?? [];
  return list.map((t, i) => normalizeTour(t, i));
}

/** Public site: published tours only. Falls back to data/tours.ts if Supabase isn't configured or empty. */
export async function getPublishedTours(): Promise<Tour[]> {
  if (!hasSupabase()) return fallbackTours();
  try {
    const { data, error } = await supabaseAdmin()
      .from("tours")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return fallbackTours();
    }
    return data.map((r, i) => normalizeTour(r, i));
  } catch {
    return fallbackTours();
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  if (!hasSupabase()) return (await fallbackTours()).find((t) => t.slug === slug) ?? null;
  try {
    const { data, error } = await supabaseAdmin()
      .from("tours")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) {
      return (await fallbackTours()).find((t) => t.slug === slug) ?? null;
    }
    return normalizeTour(data);
  } catch {
    return (await fallbackTours()).find((t) => t.slug === slug) ?? null;
  }
}

/** Admin: everything, including drafts. */
export async function getAllTours(): Promise<Tour[]> {
  if (!hasSupabase()) return fallbackTours();
  try {
    const { data, error } = await supabaseAdmin()
      .from("tours")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error || !data) return fallbackTours();
    return data.map((r, i) => normalizeTour(r, i));
  } catch {
    return fallbackTours();
  }
}

export async function getTourById(id: string): Promise<Tour | null> {
  if (!hasSupabase()) return (await fallbackTours()).find((t) => t.id === id || t.slug === id) ?? null;
  try {
    const { data, error } = await supabaseAdmin()
      .from("tours")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      return (await fallbackTours()).find((t) => t.id === id || t.slug === id) ?? null;
    }
    return normalizeTour(data);
  } catch {
    return (await fallbackTours()).find((t) => t.id === id || t.slug === id) ?? null;
  }
}
