-- Rising Stars Adventure: Postgres schema (Supabase / Neon).
-- The app creates the `inquiries` and `bookings` tables automatically when DATABASE_URL is set,
-- so running this file is optional. It is provided for reference and for manual migrations.

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL DEFAULT '',
  destination VARCHAR(200) NOT NULL,
  travelers INT NOT NULL,
  start_date VARCHAR(60) NOT NULL DEFAULT '',
  budget VARCHAR(60) NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  source VARCHAR(60) NOT NULL DEFAULT 'website'
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,
  reference VARCHAR(12) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tour_id VARCHAR(80) NOT NULL,
  tour_title VARCHAR(255) NOT NULL,
  travel_date DATE NOT NULL,
  travelers INT NOT NULL CHECK (travelers > 0),
  total_amount_inr NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',   -- pending | confirmed | cancelled | refunded
  stripe_session_id VARCHAR(255) UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(reference);

-- Recommended on Supabase: lock tables down. The server connects with the DB URL (bypasses RLS).
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
