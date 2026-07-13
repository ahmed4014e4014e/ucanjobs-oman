-- Phase 8: Instructor course proposal submissions
-- Run this once in Supabase SQL Editor before testing the instructor dashboard proposal form.

create table if not exists public.instructor_course_proposals (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  instructor_email text not null,
  instructor_name text,
  course_title text not null,
  course_category text not null,
  target_level text not null,
  career_outcome text not null,
  course_summary text not null,
  learning_outcomes text not null,
  module_outline text not null,
  required_tools text,
  final_project text,
  suggested_duration text,
  suggested_price_omr numeric(10, 3)
    check (suggested_price_omr is null or (suggested_price_omr >= 8 and suggested_price_omr <= 15)),
  additional_notes text,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'approved', 'changes_requested', 'rejected', 'archived')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists instructor_course_proposals_instructor_idx
  on public.instructor_course_proposals (instructor_id, submitted_at desc);

create index if not exists instructor_course_proposals_status_idx
  on public.instructor_course_proposals (status, submitted_at desc);

drop trigger if exists set_instructor_course_proposals_updated_at
on public.instructor_course_proposals;

create trigger set_instructor_course_proposals_updated_at
before update on public.instructor_course_proposals
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.instructor_course_proposals enable row level security;

drop policy if exists "Instructors can create own course proposals"
on public.instructor_course_proposals;

create policy "Instructors can create own course proposals"
on public.instructor_course_proposals
for insert
to authenticated
with check (
  auth.uid() = instructor_id
  and (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('instructor', 'tutor', 'admin')
    )
    or auth.jwt() -> 'user_metadata' ->> 'role' in ('instructor', 'tutor', 'admin')
    or auth.jwt() -> 'app_metadata' ->> 'role' in ('instructor', 'tutor', 'admin')
  )
);

drop policy if exists "Instructors can read own course proposals"
on public.instructor_course_proposals;

create policy "Instructors can read own course proposals"
on public.instructor_course_proposals
for select
to authenticated
using (auth.uid() = instructor_id);

drop policy if exists "Admins can manage instructor course proposals"
on public.instructor_course_proposals;

create policy "Admins can manage instructor course proposals"
on public.instructor_course_proposals
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
