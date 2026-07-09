create index if not exists course_lessons_course_sort_idx
  on public.course_lessons (course_id, is_published, sort_order);

create index if not exists lesson_progress_enrollment_idx
  on public.lesson_progress (enrollment_id, learner_id);
