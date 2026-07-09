drop policy if exists "Public can read preview course lessons"
on public.course_lessons;

create policy "Public can read preview course lessons"
on public.course_lessons
for select
using (
  is_preview = true
  and is_published = true
  and exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_lessons.course_id
      and learning_courses.is_published = true
  )
);
