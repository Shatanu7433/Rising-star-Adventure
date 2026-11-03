"use client";

import { useState } from "react";
import { formatINR } from "@/lib/site";
import type { Booking, Inquiry } from "@/lib/db";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<{ inquiries: Inquiry[]; bookings: Booking[] } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-token": token } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <h1 className="text-3xl font-black">Admin</h1>
      <form onSubmit={load} className="mt-6 flex max-w-lg gap-3">
        <input
          type="password"
          className="field"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
        />
        <button className="btn-primary" disabled={loading || !token}>{loading ? "…" : "Open"}</button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-rose">{error}</p>}

      {data && (
        <div className="mt-10 space-y-12">
          <section>
            <h2 className="text-xl font-extrabold">Bookings ({data.bookings.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-panel text-white/50">
                  <tr>
                    {["Ref", "Trip", "Date", "Pax", "Total", "Status", "Customer"].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.map((b) => (
                    <tr key={b.id} className="border-t border-white/10">
                      <td className="px-4 py-3 font-bold text-gold">{b.reference}</td>
                      <td className="px-4 py-3">{b.tourTitle}</td>
                      <td className="px-4 py-3">{b.travelDate}</td>
                      <td className="px-4 py-3">{b.travelers}</td>
                      <td className="px-4 py-3">{formatINR(b.totalAmountInr)}</td>
                      <td className="px-4 py-3 capitalize">{b.status}</td>
                      <td className="px-4 py-3">{b.customerName}<br /><span className="text-white/50">{b.customerPhone} · {b.customerEmail}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-extrabold">Custom trip inquiries ({data.inquiries.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-panel text-white/50">
                  <tr>
                    {["When", "Name", "Contact", "Destination", "Pax", "Dates", "Budget", "Message"].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.inquiries.map((i) => (
                    <tr key={i.id} className="border-t border-white/10 align-top">
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(i.createdAt).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 font-semibold">{i.name}</td>
                      <td className="px-4 py-3">{i.phone}<br /><span className="text-white/50">{i.email}</span></td>
                      <td className="px-4 py-3">{i.destination}</td>
                      <td className="px-4 py-3">{i.travelers}</td>
                      <td className="px-4 py-3">{i.startDate}</td>
                      <td className="px-4 py-3">{i.budget}</td>
                      <td className="px-4 py-3 max-w-xs">{i.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
