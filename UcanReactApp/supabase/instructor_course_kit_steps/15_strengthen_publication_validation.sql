create or replace function public.instructor_confirm_course_publication(
  p_course_id uuid
)
returns public.learning_courses
language plpgsql
security definer
set search_path = public
as $$
declare
  published_course public.learning_courses%rowtype;
begin
  if not exists (
    select 1
    from public.learning_courses
    join public.instructor_course_proposals
      on instructor_course_proposals.id = learning_courses.proposal_id
    where learning_courses.id = p_course_id
      and learning_courses.instructor_id = auth.uid()
      and instructor_course_proposals.status = 'approved'
  ) then
    raise exception 'This approved instructor course was not found.';
  end if;

  if not exists (
    select 1
    from public.course_lessons
    where course_lessons.course_id = p_course_id
      and course_lessons.is_published = true
  ) then
    raise exception 'Add at least one included lesson before publishing the course.';
  end if;

  if exists (
    select 1
    from public.course_quizzes
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    where course_lessons.course_id = p_course_id
      and (
        not exists (
          select 1 from public.quiz_questions
          where quiz_questions.quiz_id = course_quizzes.id
        )
        or exists (
          select 1
          from public.quiz_questions
          where quiz_questions.quiz_id = course_quizzes.id
            and (
              (select count(*) from public.quiz_options
               where quiz_options.question_id = quiz_questions.id) < 2
              or
              (select count(*) from public.quiz_options
               where quiz_options.question_id = quiz_questions.id
                 and quiz_options.is_correct = true) <> 1
            )
        )
      )
  ) then
    raise exception 'Every quiz needs questions with at least two options and exactly one correct answer.';
  end if;

  update public.learning_courses
  set
    is_published = true,
    publication_status = 'published',
    instructor_confirmed_at = now(),
    updated_at = now()
  where id = p_course_id
  returning * into published_course;

  return published_course;
end;
$$;
