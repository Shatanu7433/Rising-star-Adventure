"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) { router.push("/admin/tours"); router.refresh(); }
    else setError((await res.json().catch(() => ({}))).error || "Could not log in");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">Admin login</h1>
        <p className="mt-1 text-sm text-stone-500">Enter the admin password to manage trips.</p>
        <label className="mt-5 block text-sm font-medium text-stone-700" htmlFor="pw">Password</label>
        <input id="pw" type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30" />
        {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        <button disabled={busy || !password}
          className="mt-5 w-full rounded-md bg-teal-800 px-4 py-2 font-medium text-white hover:bg-teal-900 disabled:opacity-50">
          {busy ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
