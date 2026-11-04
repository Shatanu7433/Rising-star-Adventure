import { NextResponse } from "next/server";
import { getPublishedTours } from "@/lib/tours-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const tours = await getPublishedTours();
  return NextResponse.json({ tours });
}
