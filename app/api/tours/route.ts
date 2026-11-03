import { NextResponse } from "next/server";
import { TOURS } from "@/data/tours";

export const dynamic = "force-static";

export function GET() {
  const tours = TOURS.map(({ id, slug, title, destination, region, tagline, days, nights, priceInr, difficulty, tags }) => ({
    id, slug, title, destination, region, tagline, days, nights, priceInr, difficulty, tags,
  }));
  return NextResponse.json({ tours });
}
