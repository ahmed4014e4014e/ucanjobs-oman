-- Phase 5 visibility repair.
-- Run this in Supabase SQL editor if course_categories are visible but learning_courses
-- returns no rows in the React app.

alter table public.learning_courses enable row level security;
alter table public.course_outcomes enable row level security;
alter table public.course_modules enable row level security;

update public.learning_courses
set is_published = true
where slug in (
  'test-react-job-readiness',
  'test-data-analytics-starter',
  'frontend-engineering-for-omani-graduates',
  'backend-api-development-with-database',
  'applied-ai-for-business-and-productivity',
  'cyber-security-foundations-for-junior-roles',
  'data-analytics-with-excel-sql-and-dashboards',
  'graduate-tech-job-readiness'
);

drop policy if exists "Public can read published courses"
on public.learning_courses;

create policy "Public can read published courses"
on public.learning_courses
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read published course outcomes"
on public.course_outcomes;

create policy "Public can read published course outcomes"
on public.course_outcomes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_outcomes.course_id
      and learning_courses.is_published = true
  )
);

drop policy if exists "Public can read published course modules"
on public.course_modules;

create policy "Public can read published course modules"
on public.course_modules
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_modules.course_id
      and learning_courses.is_published = true
  )
);

select
  slug,
  title_en,
  is_published
from public.learning_courses
where slug in (
  'test-react-job-readiness',
  'test-data-analytics-starter'
)
order by slug;
