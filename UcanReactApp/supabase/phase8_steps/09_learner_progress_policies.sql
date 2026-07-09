drop policy if exists "Learners can read own lesson progress"
on public.lesson_progress;

create policy "Learners can read own lesson progress"
on public.lesson_progress
for select
to authenticated
using (learner_id = auth.uid());

drop policy if exists "Learners can create own lesson progress"
on public.lesson_progress;

create policy "Learners can create own lesson progress"
on public.lesson_progress
for insert
to authenticated
with check (
  learner_id = auth.uid()
  and exists (
    select 1
    from public.course_enrollments
    where course_enrollments.id = lesson_progress.enrollment_id
      and course_enrollments.learner_id = auth.uid()
      and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  )
);

drop policy if exists "Learners can update own lesson progress"
on public.lesson_progress;

create policy "Learners can update own lesson progress"
on public.lesson_progress
for update
to authenticated
using (learner_id = auth.uid())
with check (learner_id = auth.uid());

drop policy if exists "Learners can delete own lesson progress"
on public.lesson_progress;

create policy "Learners can delete own lesson progress"
on public.lesson_progress
for delete
to authenticated
using (learner_id = auth.uid());
