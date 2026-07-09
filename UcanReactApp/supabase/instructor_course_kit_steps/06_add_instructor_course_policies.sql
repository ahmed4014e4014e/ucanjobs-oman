alter table public.learning_courses enable row level security;

drop policy if exists "Instructors can read own courses"
on public.learning_courses;

create policy "Instructors can read own courses"
on public.learning_courses
for select
to authenticated
using (instructor_id = auth.uid());

drop policy if exists "Instructors can update own draft courses"
on public.learning_courses;

create policy "Instructors can update own draft courses"
on public.learning_courses
for update
to authenticated
using (
  instructor_id = auth.uid()
  and publication_status in ('draft', 'ready', 'unpublished')
)
with check (instructor_id = auth.uid());
