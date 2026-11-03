"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-5 text-sm">
          <span className="font-semibold text-stone-900">Rising Stars admin</span>
          <Link href="/admin/tours" className="text-stone-600 hover:text-stone-900">Trips</Link>
          <Link href="/admin" className="text-stone-600 hover:text-stone-900">Bookings &amp; inquiries</Link>
          <Link href="/" target="_blank" className="text-stone-600 hover:text-stone-900">View site</Link>
        </nav>
        <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-900">Log out</button>
      </div>
    </header>
  );
}
