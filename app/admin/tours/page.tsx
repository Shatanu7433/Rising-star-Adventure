import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllTours } from "@/lib/tours-db";
import { hasSupabase } from "@/lib/supabase";
import AdminNav from "./_components/AdminNav";
import TourRows from "./_components/TourRows";

export const dynamic = "force-dynamic";

export default async function AdminTours() {
  await requireAdmin();
  const configured = hasSupabase();
  const tours = configured ? await getAllTours() : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-stone-900">Trips</h1>
          {configured && (
            <Link href="/admin/tours/new" className="rounded-md bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900">
              Add trip
            </Link>
          )}
        </div>

        {!configured ? (
          <p className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Supabase isn&apos;t connected. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then reload.
          </p>
        ) : tours.length === 0 ? (
          <p className="mt-6 rounded-md border border-stone-200 bg-white p-6 text-stone-600">
            No trips yet. Add your first trip, or run <code className="rounded bg-stone-100 px-1">npm run seed</code> to import the ones in data/tours.ts.
          </p>
        ) : (
          <TourRows initial={tours} />
        )}
      </main>
    </div>
  );
}
