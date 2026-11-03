"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Tour } from "@/lib/tours-db";

export default function TourRows({ initial }: { initial: Tour[] }) {
  const router = useRouter();
  const [tours, setTours] = useState(initial);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  const shown = useMemo(
    () => tours.filter((t) => (t.title + t.location + t.slug).toLowerCase().includes(q.toLowerCase())),
    [tours, q]
  );

  async function toggle(t: Tour) {
    const res = await fetch(`/api/admin/tours/${t.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    });
    if (res.ok) setTours((a) => a.map((x) => (x.id === t.id ? { ...x, published: !t.published } : x)));
    else setMsg("Could not change status");
  }

  async function remove(t: Tour) {
    if (!confirm(`Delete "${t.title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/tours/${t.id}`, { method: "DELETE" });
    if (res.ok) setTours((a) => a.filter((x) => x.id !== t.id));
    else setMsg("Could not delete trip");
  }

  async function duplicate(t: Tour) {
    const { id, created_at, updated_at, ...rest } = t;
    const res = await fetch("/api/admin/tours", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, title: `${t.title} (copy)`, slug: `${t.slug}-copy-${Date.now().toString(36)}`, published: false }),
    });
    if (res.ok) { router.refresh(); location.reload(); }
    else setMsg((await res.json().catch(() => ({}))).error || "Could not duplicate");
  }

  return (
    <div className="mt-5">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trips"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 sm:w-72" />
      {msg && <p role="alert" className="mt-2 text-sm text-red-700">{msg}</p>}

      <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-2 font-medium">Trip</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((t) => (
              <tr key={t.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">{t.title}</div>
                  <div className="text-stone-500">{t.location || "No location"} · /tours/{t.slug}</div>
                </td>
                <td className="px-4 py-3 text-stone-700">₹{t.price.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(t)} aria-label={`Toggle ${t.title} between published and draft`}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.published ? "bg-teal-100 text-teal-900" : "bg-stone-200 text-stone-700"}`}>
                    {t.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/admin/tours/${t.id}`} className="text-teal-800 hover:underline">Edit</Link>
                  <button onClick={() => duplicate(t)} className="ml-4 text-stone-600 hover:underline">Duplicate</button>
                  <button onClick={() => remove(t)} className="ml-4 text-red-700 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-stone-500">No trips match &quot;{q}&quot;</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
