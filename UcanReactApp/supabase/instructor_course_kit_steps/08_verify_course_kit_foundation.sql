select
  to_regclass('public.instructor_course_proposals') as proposals_table,
  to_regclass('public.learning_courses') as courses_table,
  to_regclass('public.course_lessons') as lessons_table,
  count(*) filter (where instructor_id is not null) as instructor_owned_courses,
  count(*) filter (where publication_status = 'published') as instructor_published_courses
from public.learning_courses;
