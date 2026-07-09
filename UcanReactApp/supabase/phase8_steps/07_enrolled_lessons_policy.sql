drop policy if exists "Learners can read enrolled course lessons"
on public.course_lessons;

create policy "Learners can read enrolled course lessons"
on public.course_lessons
for select
to authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.course_enrollments
    where course_enrollments.course_id = course_lessons.course_id
      and course_enrollments.learner_id = auth.uid()
      and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  )
);
