create or replace function public.get_learner_lesson_quiz(p_lesson_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  quiz_payload jsonb;
begin
  if not exists (
    select 1
    from public.course_lessons
    join public.course_enrollments
      on course_enrollments.course_id = course_lessons.course_id
    where course_lessons.id = p_lesson_id
      and course_lessons.is_published = true
      and course_enrollments.learner_id = auth.uid()
      and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  ) then
    raise exception 'This lesson quiz is not available to the current learner.';
  end if;

  select jsonb_build_object(
    'id', course_quizzes.id,
    'lessonId', course_quizzes.lesson_id,
    'title', course_quizzes.title_en,
    'passingScore', course_quizzes.passing_score,
    'latestAttempt', (
      select jsonb_build_object(
        'scorePercent', quiz_attempts.score_percent,
        'passed', quiz_attempts.passed,
        'submittedAt', quiz_attempts.submitted_at
      )
      from public.quiz_attempts
      where quiz_attempts.quiz_id = course_quizzes.id
        and quiz_attempts.learner_id = auth.uid()
      order by quiz_attempts.submitted_at desc
      limit 1
    ),
    'questions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', quiz_questions.id,
          'prompt', quiz_questions.prompt_en,
          'sortOrder', quiz_questions.sort_order,
          'options', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', quiz_options.id,
                'text', quiz_options.option_en,
                'sortOrder', quiz_options.sort_order
              )
              order by quiz_options.sort_order
            )
            from public.quiz_options
            where quiz_options.question_id = quiz_questions.id
          ), '[]'::jsonb)
        )
        order by quiz_questions.sort_order
      )
      from public.quiz_questions
      where quiz_questions.quiz_id = course_quizzes.id
    ), '[]'::jsonb)
  )
  into quiz_payload
  from public.course_quizzes
  where course_quizzes.lesson_id = p_lesson_id;

  return quiz_payload;
end;
$$;

revoke all on function public.get_learner_lesson_quiz(uuid) from public;
grant execute on function public.get_learner_lesson_quiz(uuid) to authenticated;
