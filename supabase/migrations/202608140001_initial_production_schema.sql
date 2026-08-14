begin;

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create type public.app_role as enum ('respondent', 'organization_admin', 'platform_admin');
create type public.assessment_status as enum ('draft', 'in_progress', 'submitted', 'archived');
create type public.healthcare_archetype as enum ('nonclinical', 'clinical', 'him');
create type public.confidence_level as enum ('low', 'moderate', 'high');
create type public.assessment_disposition as enum ('recommendation_ready', 'targeted_further_analysis', 'deep_dive_required');
create type public.delivery_status as enum ('queued', 'sent', 'delivered', 'failed', 'bounced');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'respondent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.industry_configuration (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  version integer not null check (version > 0),
  name text not null,
  definition jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key, version)
);

create table public.archetype_configuration (
  id uuid primary key default gen_random_uuid(),
  industry_configuration_id uuid not null references public.industry_configuration(id) on delete cascade,
  archetype public.healthcare_archetype not null,
  version integer not null check (version > 0),
  title text not null,
  definition jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (industry_configuration_id, archetype, version)
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  owner_user_id uuid not null references public.profiles(id),
  industry_configuration_id uuid not null references public.industry_configuration(id),
  archetype_configuration_id uuid not null references public.archetype_configuration(id),
  status public.assessment_status not null default 'draft',
  healthcare_archetype public.healthcare_archetype not null,
  company text not null check (char_length(company) between 1 and 200),
  line_of_business text not null check (char_length(line_of_business) between 1 and 200),
  assessment_date date not null default current_date,
  confidentiality_acknowledged_at timestamptz,
  mixed_work boolean not null default false,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status <> 'submitted') or (submitted_at is not null and confidentiality_acknowledged_at is not null))
);

create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  domain_code text not null check (domain_code in ('D1','D2','D3','D4','D5','D6')),
  question_code text not null check (question_code ~ '^D[1-6]-Q[1-7]$'),
  score smallint not null check (score between 1 and 3),
  evidence_note text check (evidence_note is null or char_length(evidence_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, question_code),
  check (domain_code = split_part(question_code, '-', 1))
);

create table public.assessment_domains (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  domain_code text not null check (domain_code in ('D1','D2','D3','D4','D5','D6')),
  answered_count smallint not null check (answered_count between 0 and 7),
  weight numeric(5,2) not null check (weight > 0 and weight <= 100),
  raw_score smallint,
  normalized_score numeric(6,3),
  maturity text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, domain_code),
  check (
    (answered_count = 7 and raw_score between 7 and 21 and normalized_score between 20 and 100 and maturity is not null)
    or (answered_count < 7 and raw_score is null and normalized_score is null and maturity is null)
  )
);

create table public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  calculation_version text not null,
  overall_weighted_score numeric(6,3) not null check (overall_weighted_score between 20 and 100),
  maturity text not null,
  base_package text not null check (base_package in ('P1','P2','P3','P4','P5')),
  triggered_overrides jsonb not null default '[]'::jsonb check (jsonb_typeof(triggered_overrides) = 'array'),
  healthcare_governance_caps jsonb not null default '[]'::jsonb check (jsonb_typeof(healthcare_governance_caps) = 'array'),
  final_package text not null check (final_package in ('P1','P2','P3','P4','P5')),
  lowest_domain text not null check (lowest_domain in ('D1','D2','D3','D4','D5','D6')),
  strongest_domain text not null check (strongest_domain in ('D1','D2','D3','D4','D5','D6')),
  confidence_score numeric(5,2) not null check (confidence_score between 0 and 100),
  confidence_level public.confidence_level not null,
  assessment_disposition public.assessment_disposition not null,
  recommended_deep_dive text,
  executive_summary_data jsonb not null default '{}'::jsonb check (jsonb_typeof(executive_summary_data) = 'object'),
  recommendation_explanation jsonb not null default '{}'::jsonb check (jsonb_typeof(recommendation_explanation) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  assessment_result_id uuid not null references public.assessment_results(id) on delete cascade,
  archetype public.healthcare_archetype not null,
  package text not null check (package in ('P1','P2','P3','P4','P5')),
  priority text not null check (priority in ('Immediate','Near-Term','Roadmap','Ongoing','Innovation','Strategic')),
  domain_code text not null check (domain_code in ('D1','D2','D3','D4','D5','D6')),
  component text not null,
  title text not null,
  description text not null,
  rationale text not null,
  expected_outcome text not null,
  dependencies jsonb not null default '[]'::jsonb,
  guardrails jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessment_evidence_metadata (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  response_id uuid not null references public.assessment_responses(id) on delete cascade,
  storage_bucket text not null default 'assessment-evidence',
  storage_path text not null,
  original_filename text not null,
  content_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  sha256 text check (sha256 is null or sha256 ~ '^[a-fA-F0-9]{64}$'),
  scan_status text not null default 'pending' check (scan_status in ('pending','clean','rejected','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.email_delivery_log (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  requested_by uuid not null references public.profiles(id),
  recipient_domain text,
  recipient_hash text not null,
  provider text not null,
  provider_message_id text,
  status public.delivery_status not null default 'queued',
  error_category text,
  attempted_at timestamptz not null default now(),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assessments_owner_idx on public.assessments(owner_user_id, created_at desc);
create index assessments_organization_idx on public.assessments(organization_id, created_at desc);
create index memberships_user_idx on public.organization_memberships(user_id);
create index industry_created_by_idx on public.industry_configuration(created_by) where created_by is not null;
create index archetype_industry_idx on public.archetype_configuration(industry_configuration_id);
create index archetype_created_by_idx on public.archetype_configuration(created_by) where created_by is not null;
create index assessments_industry_config_idx on public.assessments(industry_configuration_id);
create index assessments_archetype_config_idx on public.assessments(archetype_configuration_id);
create index responses_assessment_idx on public.assessment_responses(assessment_id);
create index domains_assessment_idx on public.assessment_domains(assessment_id);
create index recommendations_result_idx on public.recommendations(assessment_result_id);
create index evidence_assessment_idx on public.assessment_evidence_metadata(assessment_id);
create index evidence_response_idx on public.assessment_evidence_metadata(response_id);
create index email_log_assessment_idx on public.email_delivery_log(assessment_id, attempted_at desc);
create index email_log_requested_by_idx on public.email_delivery_log(requested_by);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

do $$ declare table_name text; begin
  foreach table_name in array array['organizations','profiles','organization_memberships','industry_configuration','archetype_configuration','assessments','assessment_responses','assessment_domains','assessment_results','recommendations','assessment_evidence_metadata','email_delivery_log'] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create function private.is_platform_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.organization_memberships m where m.user_id = (select auth.uid()) and m.role = 'platform_admin');
$$;

create function private.can_administer_organization(target uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_platform_admin() or exists (
    select 1 from public.organization_memberships m
    where m.organization_id = target and m.user_id = (select auth.uid()) and m.role = 'organization_admin'
  );
$$;

create function private.can_access_assessment(target uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.assessments a
    where a.id = target and (a.owner_user_id = (select auth.uid()) or private.can_administer_organization(a.organization_id))
  );
$$;

revoke all on function private.is_platform_admin() from public, anon;
revoke all on function private.can_administer_organization(uuid) from public, anon;
revoke all on function private.can_access_assessment(uuid) from public, anon;
grant execute on function private.is_platform_admin() to authenticated;
grant execute on function private.can_administer_organization(uuid) to authenticated;
grant execute on function private.can_access_assessment(uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.industry_configuration enable row level security;
alter table public.archetype_configuration enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.assessment_domains enable row level security;
alter table public.assessment_results enable row level security;
alter table public.recommendations enable row level security;
alter table public.assessment_evidence_metadata enable row level security;
alter table public.email_delivery_log enable row level security;

create policy organizations_select on public.organizations for select to authenticated using (
  (select private.is_platform_admin()) or exists (select 1 from public.organization_memberships m where m.organization_id = id and m.user_id = (select auth.uid()))
);
create policy organizations_admin_update on public.organizations for update to authenticated using ((select private.can_administer_organization(id))) with check ((select private.can_administer_organization(id)));
create policy profiles_self_select on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.is_platform_admin()));
create policy profiles_self_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy memberships_select on public.organization_memberships for select to authenticated using (user_id = (select auth.uid()) or (select private.can_administer_organization(organization_id)));
create policy memberships_admin_insert on public.organization_memberships for insert to authenticated with check ((select private.can_administer_organization(organization_id)) and role <> 'platform_admin');
create policy memberships_admin_update on public.organization_memberships for update to authenticated using ((select private.can_administer_organization(organization_id))) with check ((select private.can_administer_organization(organization_id)) and role <> 'platform_admin');
create policy memberships_admin_delete on public.organization_memberships for delete to authenticated using ((select private.can_administer_organization(organization_id)) and role <> 'platform_admin');
create policy industry_published_select on public.industry_configuration for select to authenticated using (status = 'published' or (select private.is_platform_admin()));
create policy industry_platform_manage on public.industry_configuration for all to authenticated using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy archetype_published_select on public.archetype_configuration for select to authenticated using (status = 'published' or (select private.is_platform_admin()));
create policy archetype_platform_manage on public.archetype_configuration for all to authenticated using ((select private.is_platform_admin())) with check ((select private.is_platform_admin()));
create policy assessments_select on public.assessments for select to authenticated using (owner_user_id = (select auth.uid()) or (select private.can_administer_organization(organization_id)));
create policy assessments_insert on public.assessments for insert to authenticated with check (owner_user_id = (select auth.uid()) and exists (select 1 from public.organization_memberships m where m.organization_id = assessments.organization_id and m.user_id = (select auth.uid())));
create policy assessments_owner_update on public.assessments for update to authenticated using (owner_user_id = (select auth.uid()) and status <> 'submitted') with check (owner_user_id = (select auth.uid()));
create policy assessments_admin_update on public.assessments for update to authenticated using ((select private.can_administer_organization(organization_id))) with check ((select private.can_administer_organization(organization_id)));

create policy responses_select on public.assessment_responses for select to authenticated using ((select private.can_access_assessment(assessment_id)));
create policy responses_insert on public.assessment_responses for insert to authenticated with check ((select private.can_access_assessment(assessment_id)));
create policy responses_update on public.assessment_responses for update to authenticated using ((select private.can_access_assessment(assessment_id))) with check ((select private.can_access_assessment(assessment_id)));
create policy responses_delete on public.assessment_responses for delete to authenticated using ((select private.can_access_assessment(assessment_id)));
create policy domains_select on public.assessment_domains for select to authenticated using ((select private.can_access_assessment(assessment_id)));
create policy results_select on public.assessment_results for select to authenticated using ((select private.can_access_assessment(assessment_id)));
create policy recommendations_select on public.recommendations for select to authenticated using (exists (select 1 from public.assessment_results r where r.id = assessment_result_id and (select private.can_access_assessment(r.assessment_id))));
create policy evidence_select on public.assessment_evidence_metadata for select to authenticated using ((select private.can_access_assessment(assessment_id)));
create policy evidence_insert on public.assessment_evidence_metadata for insert to authenticated with check ((select private.can_access_assessment(assessment_id)));
create policy evidence_delete on public.assessment_evidence_metadata for delete to authenticated using ((select private.can_access_assessment(assessment_id)));
create policy email_log_select on public.email_delivery_log for select to authenticated using ((select private.can_access_assessment(assessment_id)));

-- Supabase no longer exposes new public tables automatically. Grant only the
-- operations the browser needs; RLS still decides which rows are accessible.
grant usage on schema public to authenticated;
grant select, update on public.organizations to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.organization_memberships to authenticated;
grant select, insert, update, delete on public.industry_configuration to authenticated;
grant select, insert, update, delete on public.archetype_configuration to authenticated;
grant select, insert, update on public.assessments to authenticated;
grant select, insert, update, delete on public.assessment_responses to authenticated;
grant select on public.assessment_domains, public.assessment_results, public.recommendations to authenticated;
grant select, insert, delete on public.assessment_evidence_metadata to authenticated;
grant select on public.email_delivery_log to authenticated;

-- Calculated domains/results/recommendations and delivery logs are written only by trusted server code.
revoke insert, update, delete on public.assessment_domains, public.assessment_results, public.recommendations, public.email_delivery_log from authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('assessment-evidence', 'assessment-evidence', false, 10485760, array['application/pdf','image/png','image/jpeg','text/plain'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy evidence_objects_select on storage.objects for select to authenticated using (
  bucket_id = 'assessment-evidence' and (select private.can_access_assessment(((storage.foldername(name))[2])::uuid))
);
create policy evidence_objects_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'assessment-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text and (select private.can_access_assessment(((storage.foldername(name))[2])::uuid))
);
create policy evidence_objects_delete on storage.objects for delete to authenticated using (
  bucket_id = 'assessment-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text and (select private.can_access_assessment(((storage.foldername(name))[2])::uuid))
);

commit;
