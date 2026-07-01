-- Reference only. Apply this from the app repo (D:\valens_app) via `supabase db push`,
-- since that's where the Supabase project schema (lkkijojnuqnrjyqrqgnd) lives.
-- This file is not executed by anything in this static-site repo.

create table if not exists public.newsletter_signups (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  source     text default 'landing',
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

-- anon may INSERT only; no select/update/delete policy => the list is not publicly readable.
create policy newsletter_insert on public.newsletter_signups
  for insert to anon, authenticated with check (true);
