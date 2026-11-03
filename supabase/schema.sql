-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.tours (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  location      text not null default '',
  summary       text not null default '',
  description   text not null default '',
  price         integer not null default 0,         -- in INR
  duration      text not null default '',           -- e.g. "5 days / 4 nights"
  difficulty    text not null default '',
  image         text not null default '',           -- image URL
  highlights    jsonb not null default '[]'::jsonb, -- ["Trek", "Camping"]
  itinerary     jsonb not null default '[]'::jsonb, -- [{"day":1,"title":"..","description":".."}]
  published     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists tours_touch on public.tours;
create trigger tours_touch before update on public.tours
for each row execute function public.touch_updated_at();

-- Security: the site and admin talk to the DB from the server with the
-- service-role key. Browsers only get read access to published tours.
alter table public.tours enable row level security;

drop policy if exists "public read published tours" on public.tours;
create policy "public read published tours" on public.tours
  for select using (published = true);
