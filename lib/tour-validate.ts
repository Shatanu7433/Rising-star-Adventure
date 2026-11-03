import type { TourInput } from "./tours-db";

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function parseTour(body: any): { ok: true; value: TourInput } | { ok: false; error: string } {
  const title = String(body?.title ?? "").trim();
  if (!title) return { ok: false, error: "Title is required" };
  const slug = slugify(String(body?.slug || title));
  if (!slug) return { ok: false, error: "Slug is required" };
  const price = Math.max(0, Math.round(Number(body?.price ?? 0)));
  if (!Number.isFinite(price)) return { ok: false, error: "Price must be a number" };

  const highlights = Array.isArray(body?.highlights)
    ? body.highlights.map((h: any) => String(h).trim()).filter(Boolean) : [];
  const itinerary = Array.isArray(body?.itinerary)
    ? body.itinerary.map((d: any, i: number) => ({
        day: i + 1,
        title: String(d?.title ?? "").trim(),
        description: String(d?.description ?? "").trim(),
      })) : [];

  return {
    ok: true,
    value: {
      slug, title, price, highlights, itinerary,
      location: String(body?.location ?? "").trim(),
      summary: String(body?.summary ?? "").trim(),
      description: String(body?.description ?? "").trim(),
      duration: String(body?.duration ?? "").trim(),
      difficulty: String(body?.difficulty ?? "").trim(),
      image: String(body?.image ?? "").trim(),
      published: Boolean(body?.published),
      sort_order: Math.round(Number(body?.sort_order ?? 0)) || 0,
    },
  };
}
