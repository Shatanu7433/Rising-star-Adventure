# Rising Stars Adventure: Website + Backend

Next.js 15 (App Router) + Tailwind 4 + Framer Motion. Frontend and backend live in one project.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you need (everything is optional to start)
npm run dev                  # http://localhost:3000
```

## What's inside

| Area | Path |
| --- | --- |
| Scroll-portal landing page | `app/page.tsx`, `components/PortalHero.tsx` |
| Tour catalog with filters | `app/tours/page.tsx`, `components/TourCatalog.tsx` |
| Tour page (itinerary, booking widget, SEO JSON-LD) | `app/tours/[slug]/page.tsx` |
| Custom trip inquiry form | `app/custom-trip/page.tsx` |
| Checkout success (voucher) / cancel | `app/checkout/*` |
| Admin (bookings + inquiries) | `/admin` (needs `ADMIN_TOKEN`) |
| **Your tours (edit this!)** | `data/tours.ts` |
| Contact details, phone, email | `lib/site.ts` |
| Brand colours | `app/globals.css` (`@theme`) |

## Backend API

- `GET  /api/tours`: tour list
- `POST /api/checkout`: validates, prices on the server, creates a booking, then returns a Stripe Checkout URL (or a WhatsApp link if Stripe isn't configured)
- `POST /api/webhooks/stripe`: verifies the signature and marks the booking `confirmed`
- `POST /api/inquiries`: saves custom-trip leads (honeypot spam protection) and emails the owner if Resend is set
- `GET  /api/admin`: bookings + inquiries (header `x-admin-token`)

## Going live checklist

1. **Tours:** replace the sample packages in `data/tours.ts` with real trips and prices.
2. **Social links:** set `NEXT_PUBLIC_INSTAGRAM_URL` and `NEXT_PUBLIC_WHATSAPP_GROUP_URL` (buttons appear automatically).
3. **Database:** set `DATABASE_URL` (Supabase/Neon). Without it, data goes to `.data/store.json`, which is local-only and is NOT persistent on Vercel.
4. **Payments (optional):** set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, and add a webhook endpoint at `/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.expired`. Confirm INR payments are enabled on your Stripe account.
5. **Email alerts (optional):** `RESEND_API_KEY`, `NOTIFY_FROM`, `NOTIFY_TO`.
6. **Admin:** set a long random `ADMIN_TOKEN`.
7. **Deploy:** push to GitHub, import into Vercel, add the env vars, set `NEXT_PUBLIC_SITE_URL` to your domain.
