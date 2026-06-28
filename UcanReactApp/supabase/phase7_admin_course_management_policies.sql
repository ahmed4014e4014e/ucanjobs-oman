-- Phase 7: Admin course management policies
-- Run this once in Supabase SQL Editor if the admin course page cannot read or save courses.
-- This does not delete course data. It only refreshes the RLS policies needed by the admin UI.

alter table public.course_categories enable row level security;
alter table public.learning_courses enable row level security;
alter table public.course_outcomes enable row level security;
alter table public.course_modules enable row level security;

drop policy if exists "Admins can manage course categories" on public.course_categories;
create policy "Admins can manage course categories"
on public.course_categories
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

drop policy if exists "Admins can manage learning courses" on public.learning_courses;
create policy "Admins can manage learning courses"
on public.learning_courses
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

drop policy if exists "Admins can manage course outcomes" on public.course_outcomes;
create policy "Admins can manage course outcomes"
on public.course_outcomes
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

drop policy if exists "Admins can manage course modules" on public.course_modules;
create policy "Admins can manage course modules"
on public.course_modules
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
