-- Reference only. Apply this from the app repo (D:\valens_app) via `supabase db push`,
-- since that's where the Supabase project schema (lkkijojnuqnrjyqrqgnd) lives.
-- IMPORTANT: the migration filename in the app repo must carry a datetime prefix,
-- e.g. supabase/migrations/20260702120000_coaching_requests.sql
-- This file is not executed by anything in this static-site repo.

create table if not exists public.coaching_requests (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  message    text,
  created_at timestamptz not null default now()
);

alter table public.coaching_requests enable row level security;

-- anon may INSERT only; no select/update/delete policy => requests are not publicly readable.
create policy coaching_insert on public.coaching_requests
  for insert to anon, authenticated with check (true);
