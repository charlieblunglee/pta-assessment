-- Run this in Supabase > SQL Editor for the production backend.
create extension if not exists pgcrypto;

create type public.app_role as enum ('respondent','admin');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  role public.app_role not null default 'respondent',
  created_at timestamptz not null default now()
);
create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now()
);
create table public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  industry_id uuid not null references public.industries(id) on delete cascade,
  name text not null,
  version integer not null default 1,
  definition jsonb not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  company_name text not null,
  line_of_business text not null,
  industry text not null,
  archetype text not null check (archetype in ('nonclinical','clinical','him')),
  instructions_acknowledged_at timestamptz not null,
  answers jsonb not null default '{}'::jsonb,
  program_score numeric(5,2),
  recommended_package text,
  compliance_capped boolean not null default false,
  status text not null default 'draft' check (status in ('draft','submitted')),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.artifacts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_id text not null,
  storage_path text not null,
  original_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.industries enable row level security;
alter table public.questionnaires enable row level security;
alter table public.assessments enable row level security;
alter table public.artifacts enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
create policy "profile self read" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "profile self insert" on public.profiles for insert with check (id=auth.uid());
create policy "published industries read" on public.industries for select using (status='published' or public.is_admin());
create policy "admins manage industries" on public.industries for all using (public.is_admin()) with check (public.is_admin());
create policy "published questionnaires read" on public.questionnaires for select using (published or public.is_admin());
create policy "admins manage questionnaires" on public.questionnaires for all using (public.is_admin()) with check (public.is_admin());
create policy "assessment owner read" on public.assessments for select using (user_id=auth.uid() or public.is_admin());
create policy "assessment owner insert" on public.assessments for insert with check (user_id=auth.uid());
create policy "assessment owner update" on public.assessments for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "artifact owner read" on public.artifacts for select using (exists(select 1 from public.assessments a where a.id=assessment_id and (a.user_id=auth.uid() or public.is_admin())));
create policy "artifact owner insert" on public.artifacts for insert with check (exists(select 1 from public.assessments a where a.id=assessment_id and a.user_id=auth.uid()));

insert into public.industries(name,status) values ('Healthcare','published') on conflict do nothing;

-- In Storage, create a PRIVATE bucket named assessment-artifacts.
-- Recommended object path: <user-id>/<assessment-id>/<question-id>/<safe-filename>
