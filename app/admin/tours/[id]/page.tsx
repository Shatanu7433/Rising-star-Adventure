import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getTourById } from "@/lib/tours-db";
import AdminNav from "../_components/AdminNav";
import TourForm from "../_components/TourForm";

export const dynamic = "force-dynamic";

export default async function EditTour({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) notFound();
  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-stone-900">Edit {tour.title}</h1>
        <TourForm tour={tour} />
      </main>
    </div>
  );
}
