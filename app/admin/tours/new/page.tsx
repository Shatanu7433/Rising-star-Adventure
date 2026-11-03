import { requireAdmin } from "@/lib/admin-auth";
import AdminNav from "../_components/AdminNav";
import TourForm from "../_components/TourForm";

export default async function NewTour() {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-stone-900">Add trip</h1>
        <TourForm />
      </main>
    </div>
  );
}
