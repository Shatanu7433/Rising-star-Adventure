import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Server-only client. Never import this in a "use client" file. */
export function supabaseAdmin(): SupabaseClient {
  if (!hasSupabase()) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}
