insert into public.course_lessons (
  course_id,
  title_en,
  body_en,
  sort_order,
  is_preview,
  is_published
)
select
  learning_courses.id,
  'Welcome and course outcomes',
  'Start here. Review the course goals, the expected practical outcomes, and how this course supports job readiness.',
  1,
  true,
  true
from public.learning_courses
where not exists (
  select 1
  from public.course_lessons
  where course_lessons.course_id = learning_courses.id
);
