-- Phase 5 enrollment RLS repair.
-- Run this in Supabase SQL editor if enrolling shows:
-- "new row violates row-level security policy for table course_enrollments"

alter table public.course_enrollments enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

revoke all on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to authenticated;

drop policy if exists "Learners can create own course enrollments"
on public.course_enrollments;

create policy "Learners can create own course enrollments"
on public.course_enrollments
for insert
to authenticated
with check (
  auth.uid() = learner_id
  and exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_enrollments.course_id
      and learning_courses.is_published = true
  )
);

drop policy if exists "Learners can read own course enrollments"
on public.course_enrollments;

create policy "Learners can read own course enrollments"
on public.course_enrollments
for select
to authenticated
using (auth.uid() = learner_id);

drop policy if exists "Learners can update own course enrollments"
on public.course_enrollments;

create policy "Learners can update own course enrollments"
on public.course_enrollments
for update
to authenticated
using (auth.uid() = learner_id)
with check (auth.uid() = learner_id);

drop policy if exists "Admins can manage course enrollments"
on public.course_enrollments;

create policy "Admins can manage course enrollments"
on public.course_enrollments
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'course_enrollments'
order by policyname;
