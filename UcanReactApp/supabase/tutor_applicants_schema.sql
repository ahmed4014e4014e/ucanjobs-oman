create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.tutor_applicants (
  id uuid primary key default gen_random_uuid(),
  applicant_profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  university_name text not null,
  university_id text not null,
  major_name text not null,
  desired_tutoring_courses text not null,
  university_email text not null,
  phone_number text not null,
  application_message text,
  attachment_notes text,
  attachment_files jsonb not null default '[]'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'approved', 'rejected', 'completed')),
  admin_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tutor_applicants_status_idx
  on public.tutor_applicants (status);

create index if not exists tutor_applicants_submitted_at_idx
  on public.tutor_applicants (submitted_at desc);

create index if not exists tutor_applicants_university_email_idx
  on public.tutor_applicants (university_email);

create index if not exists tutor_applicants_profile_id_idx
  on public.tutor_applicants (applicant_profile_id);

drop trigger if exists set_tutor_applicants_updated_at
on public.tutor_applicants;

create trigger set_tutor_applicants_updated_at
before update on public.tutor_applicants
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.tutor_applicants enable row level security;

drop policy if exists "Applicants can create tutor applications"
on public.tutor_applicants;

drop policy if exists "Public can create tutor applications"
on public.tutor_applicants;

drop policy if exists "Applicants can read own tutor applications"
on public.tutor_applicants;

drop policy if exists "Admins can read tutor applications"
on public.tutor_applicants;

drop policy if exists "Admins can update tutor applications"
on public.tutor_applicants;

create policy "Public can create tutor applications"
on public.tutor_applicants
for insert
to anon, authenticated
with check (true);

create policy "Applicants can read own tutor applications"
on public.tutor_applicants
for select
to authenticated
using (
  applicant_profile_id = auth.uid()
);

create policy "Admins can read tutor applications"
on public.tutor_applicants
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can update tutor applications"
on public.tutor_applicants
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

insert into storage.buckets (id, name, public)
values ('tutor-applicant-attachments', 'tutor-applicant-attachments', false)
on conflict (id) do nothing;

drop policy if exists "Public can upload tutor applicant files"
on storage.objects;

drop policy if exists "Admins can read tutor applicant files"
on storage.objects;

drop policy if exists "Admins can delete tutor applicant files"
on storage.objects;

create policy "Public can upload tutor applicant files"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'tutor-applicant-attachments'
);

create policy "Admins can read tutor applicant files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'tutor-applicant-attachments'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can delete tutor applicant files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'tutor-applicant-attachments'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
