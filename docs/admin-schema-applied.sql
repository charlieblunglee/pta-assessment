-- Applied via Supabase migration admin_access_and_submission_notifications.
-- Record for review; do not rerun against an already-configured database.
create table public.admin_access (
  email text primary key check (email = lower(email)),
  respondents boolean not null default false,
  results boolean not null default false,
  answers boolean not null default false,
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.admin_access enable row level security;
revoke all on public.admin_access from anon, authenticated;
grant all on public.admin_access to service_role;
create table public.submission_notifications (
  assessment_id uuid primary key references public.assessments(id),
  status text not null default 'queued' check (status in ('queued','sending','sent','failed')),
  attempted_at timestamptz, sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.submission_notifications enable row level security;
revoke all on public.submission_notifications from anon, authenticated;
grant all on public.submission_notifications to service_role;
create function private.queue_submission_notification() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.status='submitted' and old.status is distinct from new.status then
    insert into public.submission_notifications(assessment_id) values(new.id) on conflict do nothing;
  end if;
  return new;
end; $$;
revoke all on function private.queue_submission_notification() from public,anon,authenticated;
create trigger queue_submission_notification after update of status on public.assessments
for each row execute function private.queue_submission_notification();
