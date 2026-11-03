import { SITE } from "@/lib/site";

/** Sends an email to the owner via Resend. Silently skips if not configured. Never throws. */
export async function notifyOwner(subject: string, lines: string[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.NOTIFY_TO ?? SITE.email;
  const from = process.env.NOTIFY_FROM ?? "Rising Stars Adventure <onboarding@resend.dev>";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: lines.join("\n"),
      }),
    });
  } catch (err) {
    console.error("notifyOwner failed", err);
  }
}
