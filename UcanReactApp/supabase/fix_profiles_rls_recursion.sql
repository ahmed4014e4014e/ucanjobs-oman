-- Repair RLS recursion caused by admin policies that query public.profiles.
-- Run this in the Supabase SQL editor if the app shows:
-- "infinite recursion detected in policy for relation \"profiles\""
--
-- This script does not delete or modify user/course/enrollment data.

begin;

-- IMPORTANT:
-- This helper intentionally disables row-security checks inside the function.
-- That lets it read the current user's profile role without recursively
-- triggering public.profiles policies.
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

-- Recreate the profile admin-read policy so it no longer calls a helper that
-- selects from public.profiles.
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin_user());

-- Course marketplace admin policies. The learner dashboard reads enrollments,
-- so a recursive admin policy here can surface as a course-loading error.
drop policy if exists "Admins can manage course categories" on public.course_categories;
create policy "Admins can manage course categories"
on public.course_categories
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage learning courses" on public.learning_courses;
create policy "Admins can manage learning courses"
on public.learning_courses
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage course outcomes" on public.course_outcomes;
create policy "Admins can manage course outcomes"
on public.course_outcomes
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage course modules" on public.course_modules;
create policy "Admins can manage course modules"
on public.course_modules
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage course enrollments" on public.course_enrollments;
create policy "Admins can manage course enrollments"
on public.course_enrollments
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Optional tables from the learner/instructor migration. These DO blocks are
-- safe even if your database has not created every table yet.
do $$
begin
  if to_regclass('public.learning_requests') is not null then
    execute 'drop policy if exists "Admins can read learning requests" on public.learning_requests';
    execute 'create policy "Admins can read learning requests" on public.learning_requests for select to authenticated using (public.is_admin_user())';
    execute 'drop policy if exists "Admins can update learning requests" on public.learning_requests';
    execute 'create policy "Admins can update learning requests" on public.learning_requests for update to authenticated using (public.is_admin_user()) with check (public.is_admin_user())';
  end if;

  if to_regclass('public.instructor_applicants') is not null then
    execute 'drop policy if exists "Admins can read instructor applications" on public.instructor_applicants';
    execute 'create policy "Admins can read instructor applications" on public.instructor_applicants for select to authenticated using (public.is_admin_user())';
    execute 'drop policy if exists "Admins can update instructor applications" on public.instructor_applicants';
    execute 'create policy "Admins can update instructor applications" on public.instructor_applicants for update to authenticated using (public.is_admin_user()) with check (public.is_admin_user())';
  end if;

  if to_regclass('public.contact_messages') is not null then
    execute 'drop policy if exists "Admins can read contact messages" on public.contact_messages';
    execute 'create policy "Admins can read contact messages" on public.contact_messages for select to authenticated using (public.is_admin_user())';
    execute 'drop policy if exists "Admins can update contact messages" on public.contact_messages';
    execute 'create policy "Admins can update contact messages" on public.contact_messages for update to authenticated using (public.is_admin_user()) with check (public.is_admin_user())';
  end if;
end $$;

-- Storage policies that used the same admin helper now inherit the fixed,
-- non-recursive behavior.
drop policy if exists "Admins can read learning attachments" on storage.objects;
create policy "Admins can read learning attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'learning-attachments'
  and public.is_admin_user()
);

drop policy if exists "Admins can read instructor applicant files" on storage.objects;
create policy "Admins can read instructor applicant files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'instructor-applicant-attachments'
  and public.is_admin_user()
);

drop policy if exists "Admins can delete instructor applicant files" on storage.objects;
create policy "Admins can delete instructor applicant files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'instructor-applicant-attachments'
  and public.is_admin_user()
);

drop policy if exists "Admins can read contact attachments" on storage.objects;
create policy "Admins can read contact attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'contact-attachments'
  and public.is_admin_user()
);

commit;

select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'profiles',
    'course_categories',
    'learning_courses',
    'course_outcomes',
    'course_modules',
    'course_enrollments',
    'learning_requests',
    'instructor_applicants',
    'contact_messages'
  )
order by tablename, policyname;
