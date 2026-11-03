import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Persistence layer.
 * - DATABASE_URL set  -> PostgreSQL (Supabase / Neon / any). Tables are auto-created.
 * - otherwise         -> JSON file store (.data/store.json) for local development.
 */

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  travelers: number;
  startDate: string;
  budget: string;
  message: string;
  source: string;
}

export interface Booking {
  id: string;
  reference: string;
  createdAt: string;
  tourId: string;
  tourTitle: string;
  travelDate: string;
  travelers: number;
  totalAmountInr: number;
  status: BookingStatus;
  stripeSessionId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

const SCHEMA = `
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
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  stripe_session_id VARCHAR(255) UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(255) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(reference);
`;

/* ---------------------------- PostgreSQL ---------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pool: any = null;
let ready: Promise<void> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function pg(): Promise<any> {
  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
      max: 3,
    });
  }
  if (!ready) ready = pool.query(SCHEMA).then(() => undefined);
  await ready;
  return pool;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapInquiry = (r: any): Inquiry => ({
  id: r.id,
  createdAt: new Date(r.created_at).toISOString(),
  name: r.name,
  phone: r.phone,
  email: r.email,
  destination: r.destination,
  travelers: r.travelers,
  startDate: r.start_date,
  budget: r.budget,
  message: r.message,
  source: r.source,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBooking = (r: any): Booking => ({
  id: r.id,
  reference: r.reference,
  createdAt: new Date(r.created_at).toISOString(),
  tourId: r.tour_id,
  tourTitle: r.tour_title,
  travelDate: typeof r.travel_date === "string" ? r.travel_date.slice(0, 10) : new Date(r.travel_date).toISOString().slice(0, 10),
  travelers: r.travelers,
  totalAmountInr: Number(r.total_amount_inr),
  status: r.status,
  stripeSessionId: r.stripe_session_id,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  customerEmail: r.customer_email,
});

/* ---------------------------- File store ---------------------------- */

interface Store {
  inquiries: Inquiry[];
  bookings: Booking[];
}

const storePath = process.env.VERCEL
  ? path.join(os.tmpdir(), "rsa-store.json")
  : path.join(process.cwd(), ".data", "store.json");

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await fs.readFile(storePath, "utf8")) as Store;
  } catch {
    return { inquiries: [], bookings: [] };
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

const usePg = () => Boolean(process.env.DATABASE_URL);

/* ------------------------------ Public API ------------------------------ */

export async function addInquiry(
  data: Omit<Inquiry, "id" | "createdAt">,
): Promise<Inquiry> {
  const inquiry: Inquiry = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
  if (usePg()) {
    const db = await pg();
    await db.query(
      `INSERT INTO inquiries (id, name, phone, email, destination, travelers, start_date, budget, message, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [inquiry.id, data.name, data.phone, data.email, data.destination, data.travelers, data.startDate, data.budget, data.message, data.source],
    );
  } else {
    const store = await readStore();
    store.inquiries.unshift(inquiry);
    await writeStore(store);
  }
  return inquiry;
}

export async function addBooking(
  data: Omit<Booking, "id" | "createdAt" | "status" | "stripeSessionId">,
): Promise<Booking> {
  const booking: Booking = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    stripeSessionId: null,
    ...data,
  };
  if (usePg()) {
    const db = await pg();
    await db.query(
      `INSERT INTO bookings (id, reference, tour_id, tour_title, travel_date, travelers, total_amount_inr, status,
        customer_name, customer_phone, customer_email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10)`,
      [booking.id, data.reference, data.tourId, data.tourTitle, data.travelDate, data.travelers, data.totalAmountInr, data.customerName, data.customerPhone, data.customerEmail],
    );
  } else {
    const store = await readStore();
    store.bookings.unshift(booking);
    await writeStore(store);
  }
  return booking;
}

export async function attachStripeSession(reference: string, sessionId: string) {
  if (usePg()) {
    const db = await pg();
    await db.query(`UPDATE bookings SET stripe_session_id = $1 WHERE reference = $2`, [sessionId, reference]);
  } else {
    const store = await readStore();
    const b = store.bookings.find((x) => x.reference === reference);
    if (b) b.stripeSessionId = sessionId;
    await writeStore(store);
  }
}

export async function setBookingStatus(reference: string, status: BookingStatus): Promise<Booking | null> {
  if (usePg()) {
    const db = await pg();
    const res = await db.query(`UPDATE bookings SET status = $1 WHERE reference = $2 RETURNING *`, [status, reference]);
    return res.rows[0] ? mapBooking(res.rows[0]) : null;
  }
  const store = await readStore();
  const b = store.bookings.find((x) => x.reference === reference);
  if (!b) return null;
  b.status = status;
  await writeStore(store);
  return b;
}

export async function getBooking(reference: string): Promise<Booking | null> {
  if (usePg()) {
    const db = await pg();
    const res = await db.query(`SELECT * FROM bookings WHERE reference = $1`, [reference]);
    return res.rows[0] ? mapBooking(res.rows[0]) : null;
  }
  const store = await readStore();
  return store.bookings.find((x) => x.reference === reference) ?? null;
}

export async function listAll(): Promise<{ inquiries: Inquiry[]; bookings: Booking[] }> {
  if (usePg()) {
    const db = await pg();
    const [i, b] = await Promise.all([
      db.query(`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200`),
      db.query(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`),
    ]);
    return { inquiries: i.rows.map(mapInquiry), bookings: b.rows.map(mapBooking) };
  }
  return readStore();
}
