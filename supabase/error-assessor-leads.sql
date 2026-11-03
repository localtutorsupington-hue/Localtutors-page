-- 20 Min Math Error Assessors leads.
-- Run once in the Supabase SQL editor on the LocalTutors project (localtutors-sign-up).
-- The page uses the public (publishable) key, so this table only ACCEPTS new rows from it:
-- nobody can read, change or delete rows with that key. Read them in Supabase > Table Editor.

create table if not exists public.error_assessor_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  -- Same moment as created_at, written out in South African time for easy reading on a phone.
  sast_time     text not null default to_char(now() at time zone 'Africa/Johannesburg', 'YYYY-MM-DD HH24:MI'),
  first_name    text not null check (char_length(first_name) between 1 and 100),
  surname       text not null check (char_length(surname) between 1 and 100),
  grade         smallint not null check (grade between 4 and 10),
  language      text not null check (language in ('Afrikaans', 'English')),
  lead_magnet   text not null default '20 Min Math Error Assessors' check (char_length(lead_magnet) <= 100),
  utm_source    text not null default '' check (char_length(utm_source) <= 100),
  utm_medium    text not null default '' check (char_length(utm_medium) <= 100),
  utm_campaign  text not null default '' check (char_length(utm_campaign) <= 100),
  referrer      text not null default '' check (char_length(referrer) <= 500),
  page_url      text not null default '' check (char_length(page_url) <= 500),
  -- Change this yourself in the Table Editor, for example to Contacted or Signed up.
  status        text not null default 'New' check (char_length(status) <= 40)
);

create index if not exists error_assessor_leads_created_at_idx on public.error_assessor_leads (created_at desc);

alter table public.error_assessor_leads enable row level security;

-- Insert only, and only the columns the page fills in. The id, times and status are set here, not by the page.
-- No select, update or delete grant or policy exists, so the public key cannot read anything back.
revoke all on public.error_assessor_leads from anon, authenticated;
grant insert (first_name, surname, grade, language, lead_magnet, utm_source, utm_medium, utm_campaign, referrer, page_url)
  on public.error_assessor_leads to anon;

drop policy if exists "page can add leads" on public.error_assessor_leads;
create policy "page can add leads" on public.error_assessor_leads for insert to anon with check (true);
