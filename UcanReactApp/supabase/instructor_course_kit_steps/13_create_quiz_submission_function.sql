create or replace function public.submit_lesson_quiz(
  p_quiz_id uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  enrollment_record public.course_enrollments%rowtype;
  question_count integer;
  correct_count integer;
  calculated_score integer;
  required_score integer;
  attempt_id uuid;
begin
  select course_enrollments.*
  into enrollment_record
  from public.course_enrollments
  join public.course_lessons
    on course_lessons.course_id = course_enrollments.course_id
  join public.course_quizzes
    on course_quizzes.lesson_id = course_lessons.id
  where course_quizzes.id = p_quiz_id
    and course_enrollments.learner_id = auth.uid()
    and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  limit 1;

  if not found then
    raise exception 'No active enrollment was found for this quiz.';
  end if;

  select count(*)
  into question_count
  from public.quiz_questions
  where quiz_questions.quiz_id = p_quiz_id;

  if question_count = 0 then
    raise exception 'This quiz has no questions.';
  end if;

  select count(*)
  into correct_count
  from public.quiz_questions
  join public.quiz_options
    on quiz_options.question_id = quiz_questions.id
   and quiz_options.is_correct = true
  where quiz_questions.quiz_id = p_quiz_id
    and p_answers ->> quiz_questions.id::text = quiz_options.id::text;

  calculated_score := round((correct_count::numeric / question_count::numeric) * 100);

  select passing_score
  into required_score
  from public.course_quizzes
  where id = p_quiz_id;

  insert into public.quiz_attempts (
    quiz_id,
    enrollment_id,
    learner_id,
    answers,
    score_percent,
    passed
  )
  values (
    p_quiz_id,
    enrollment_record.id,
    auth.uid(),
    p_answers,
    calculated_score,
    calculated_score >= required_score
  )
  returning id into attempt_id;

  return jsonb_build_object(
    'attemptId', attempt_id,
    'scorePercent', calculated_score,
    'passingScore', required_score,
    'passed', calculated_score >= required_score
  );
end;
$$;

revoke all on function public.submit_lesson_quiz(uuid, jsonb) from public;
grant execute on function public.submit_lesson_quiz(uuid, jsonb) to authenticated;
