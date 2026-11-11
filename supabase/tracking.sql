-- Referral tracking tables for Aesthetic Guide (Supabase free plan).
-- Run once: Supabase dashboard → SQL Editor → paste → Run.
-- Only the website's server (service key) can read or write; row-level security
-- is on with no public policies, so the public anon key can do nothing here.

create table if not exists public.clicks (
  id        bigint generated always as identity primary key,
  at        timestamptz not null default now(),
  kind      text not null check (kind in ('maps','site','call','book','directory','license')),
  clinic    text,           -- partner clinic id from lib/clinics.ts, or null
  treatment text,           -- treatment id from lib/procedures.ts, or null
  city      text check (city in ('nyc','miami')),
  area      text,           -- only a neighborhood from our list; never a typed ZIP
  page      text,
  tab       text,           -- random id per browser tab (counts unique visitors)
  click     text            -- random id also added to the clinic link as ag_click
);
create index if not exists clicks_at on public.clicks (at);
create index if not exists clicks_clinic_at on public.clicks (clinic, at);

create table if not exists public.leads (
  id             bigint generated always as identity primary key,
  at             timestamptz not null default now(),
  ref            text not null unique,   -- e.g. AG-7K2P9M, shown to the person and the clinic
  clinic         text not null,
  city           text,
  treatment      text,
  name           text not null,
  email          text,
  phone          text,
  preferred_time text,
  consent_text   text not null,
  tab            text,
  status         text not null default 'new' check (status in ('new','sent','booked','no-show','declined'))
);
create index if not exists leads_at on public.leads (at);

alter table public.clicks enable row level security;
alter table public.leads  enable row level security;
revoke all on public.clicks, public.leads from anon, authenticated;
