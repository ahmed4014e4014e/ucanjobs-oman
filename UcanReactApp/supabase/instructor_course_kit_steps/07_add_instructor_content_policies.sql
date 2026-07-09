alter table public.course_lessons enable row level security;
alter table public.course_outcomes enable row level security;
alter table public.course_modules enable row level security;

drop policy if exists "Instructors can read own course lessons"
on public.course_lessons;

create policy "Instructors can read own course lessons"
on public.course_lessons
for select
to authenticated
using (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_lessons.course_id
      and learning_courses.instructor_id = auth.uid()
  )
);

drop policy if exists "Instructors can manage own course lessons"
on public.course_lessons;

create policy "Instructors can manage own course lessons"
on public.course_lessons
for all
to authenticated
using (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_lessons.course_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
)
with check (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_lessons.course_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Instructors can manage own course outcomes"
on public.course_outcomes;

create policy "Instructors can manage own course outcomes"
on public.course_outcomes
for all
to authenticated
using (
  exists (
    select 1 from public.learning_courses
    where learning_courses.id = course_outcomes.course_id
      and learning_courses.instructor_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.learning_courses
    where learning_courses.id = course_outcomes.course_id
      and learning_courses.instructor_id = auth.uid()
  )
);

drop policy if exists "Instructors can manage own course modules"
on public.course_modules;

create policy "Instructors can manage own course modules"
on public.course_modules
for all
to authenticated
using (
  exists (
    select 1 from public.learning_courses
    where learning_courses.id = course_modules.course_id
      and learning_courses.instructor_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.learning_courses
    where learning_courses.id = course_modules.course_id
      and learning_courses.instructor_id = auth.uid()
  )
);
