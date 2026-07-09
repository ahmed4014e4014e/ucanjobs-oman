select
  to_regclass('public.course_quizzes') as quizzes_table,
  to_regclass('public.quiz_questions') as questions_table,
  to_regclass('public.quiz_options') as options_table,
  to_regclass('public.quiz_attempts') as attempts_table,
  exists (
    select 1 from storage.buckets where id = 'course-content'
  ) as course_content_bucket_exists;
