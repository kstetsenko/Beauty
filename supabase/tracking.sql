-- Referral tracking tables for Aesthetic Guide (Supabase free plan).
-- Run once: Supabase dashboard → SQL Editor → paste → Run.
-- Only the website's server (service key) can read or write; row-level security
-- is on with no public policies, so the public anon key can do nothing here.

create table if not exists public.clicks (
  id        bigint generated always as identity primary key,
  at        timestamptz not null default now(),
  kind      text not null check (kind in ('finder','maps','site','call','book','directions','reviews','directory','license')),
  clinic    text,           -- clinic id from lib/clinics.ts, or null
  treatment text,           -- treatment id from lib/procedures.ts, or null
  city      text check (city in ('nyc','miami')),
  area      text,           -- only a neighborhood from our list; never a typed ZIP
  page      text,
  tab       text,           -- random id per browser tab (counts unique visitors)
  click     text            -- random id also added to the clinic link as ag_click
);
create index if not exists clicks_at on public.clicks (at);
create index if not exists clicks_clinic_at on public.clicks (clinic, at);


alter table public.clicks enable row level security;
revoke all on public.clicks from anon, authenticated;
