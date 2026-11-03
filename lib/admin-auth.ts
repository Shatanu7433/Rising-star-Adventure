import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "rs_admin";

function sign(): string {
  const token = process.env.ADMIN_TOKEN;
  if (!token || token.length < 12) throw new Error("Set ADMIN_TOKEN (12+ chars) in your env");
  return createHmac("sha256", token).update("rising-stars-admin-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const A = Buffer.from(a), B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export function checkPassword(input: string) {
  const token = process.env.ADMIN_TOKEN ?? "";
  return token.length >= 12 && safeEqual(input, token);
}

export async function setSession() {
  (await cookies()).set(COOKIE, sign(), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 12,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  return Boolean(v) && safeEqual(v!, sign());
}

/** Use at the top of admin pages. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
