-- Mark Leak Finder sign-ups and results.
-- Run once in the Supabase SQL editor (or as a migration) on the LocalTutors project.
-- The page uses the public (anon / publishable) key, so these tables only ACCEPT new rows from it:
-- nobody can read, change or delete rows with that key. Read them in the Supabase dashboard (Table Editor).

create table if not exists public.leads (
  id           uuid primary key,
  created_at   timestamptz not null default now(),
  child_name   text not null check (char_length(child_name) between 1 and 40),
  parent_name  text not null check (char_length(parent_name) between 1 and 80),
  email        text not null check (char_length(email) <= 200 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  whatsapp     text check (whatsapp is null or (char_length(whatsapp) <= 30 and whatsapp ~ '^[0-9 ()+-]+$')),
  lang         text not null default 'en' check (lang in ('en', 'af'))
);

create table if not exists public.lead_results (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  lead_id        uuid not null references public.leads (id) on delete cascade,
  report_code    text not null check (char_length(report_code) <= 80),
  result_type    text not null check (result_type in ('A', 'B', 'C', 'D', 'E')),
  right_answers  smallint not null check (right_answers between 0 and 12),
  right_and_sure smallint not null check (right_and_sure between 0 and 12),
  score          numeric(5, 2) not null check (score between 0 and 100),
  biggest_leak   text check (biggest_leak in ('neg', 'frac', 'exp', 'alg', 'eq', 'word')),
  lang           text not null default 'en' check (lang in ('en', 'af'))
);

create index if not exists lead_results_lead_id_idx on public.lead_results (lead_id);

alter table public.leads enable row level security;
alter table public.lead_results enable row level security;

-- Insert only. No select, update or delete policy exists, so the public key cannot read anything back.
revoke all on public.leads, public.lead_results from anon, authenticated;
grant insert on public.leads, public.lead_results to anon;

drop policy if exists "page can add sign-ups" on public.leads;
create policy "page can add sign-ups" on public.leads for insert to anon with check (true);

drop policy if exists "page can add results" on public.lead_results;
create policy "page can add results" on public.lead_results for insert to anon with check (true);

-- One row per learner with their latest result, for reading in the dashboard.
create or replace view public.leads_with_results with (security_invoker = true) as
select l.created_at, l.child_name, l.parent_name, l.email, l.whatsapp, l.lang,
       r.result_type, r.right_answers, r.right_and_sure, r.score, r.biggest_leak, r.report_code, r.created_at as finished_at
from public.leads l
left join lateral (
  select * from public.lead_results r where r.lead_id = l.id order by r.created_at desc limit 1
) r on true
order by l.created_at desc;

revoke all on public.leads_with_results from anon, authenticated;
