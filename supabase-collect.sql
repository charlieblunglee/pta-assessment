-- ============================================================
-- Central collection table for completed assessments.
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Safe to run again; it will not duplicate or overwrite anything.
-- ============================================================

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text,
  company text,
  line_of_business text,
  healthcare_track text,
  assessment_date date,
  program_score integer,
  maturity text,
  recommended_package text,
  primary_focus text,
  confidence text,
  disposition text,
  recommended_further_analysis text,
  immediate_priorities jsonb,
  payload jsonb
);

-- Lock the table down. The serverless function writes with the service-role
-- key, which bypasses these rules; nothing in the browser can read or write here.
alter table public.submissions enable row level security;

-- Optional: let admins read submissions through the API (the dashboard Table
-- Editor shows everything regardless of this). Requires the is_admin() function
-- from supabase-schema.sql. If you didn't run that file, this line is skipped.
do $$
begin
  if exists (select 1 from pg_proc where proname = 'is_admin') then
    drop policy if exists "admins read submissions" on public.submissions;
    create policy "admins read submissions"
      on public.submissions for select
      using (public.is_admin());
  end if;
end $$;
