begin;

create temp table kit_test_actors as
select
  (select id from public.profiles where role = 'admin' order by created_at limit 1) as admin_id,
  (select id from public.profiles where role = 'instructor' order by created_at limit 1) as instructor_id,
  (select id from public.profiles where role = 'learner' order by created_at limit 1) as learner_id;

do $$
begin
  if exists (
    select 1
    from kit_test_actors
    where admin_id is null or instructor_id is null or learner_id is null
  ) then
    raise exception 'The lifecycle test requires one admin, instructor, and learner profile.';
  end if;
end;
$$;

create temp table kit_test_entities (
  proposal_id uuid not null,
  course_id uuid,
  lesson_id uuid not null,
  quiz_id uuid not null,
  question_id uuid not null,
  correct_option_id uuid not null,
  wrong_option_id uuid not null,
  enrollment_id uuid not null
);

insert into kit_test_entities (
  proposal_id,
  lesson_id,
  quiz_id,
  question_id,
  correct_option_id,
  wrong_option_id,
  enrollment_id
)
values (
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid()
);

grant select on kit_test_actors, kit_test_entities to authenticated;

insert into public.instructor_course_proposals (
  id,
  instructor_id,
  instructor_email,
  instructor_name,
  course_title,
  course_category,
  target_level,
  career_outcome,
  course_summary,
  learning_outcomes,
  module_outline,
  suggested_duration,
  suggested_price_omr,
  status
)
select
  kit_test_entities.proposal_id,
  kit_test_actors.instructor_id,
  'rollback-test@ucan.invalid',
  'Rollback Test Instructor',
  'Rollback Course Kit Test',
  'Software Engineering',
  'Beginner',
  'Verify the complete instructor-to-learner lifecycle',
  'Temporary course created inside a rolled-back transaction.',
  'Complete a lesson and pass its quiz.',
  'One temporary lesson.',
  '1 hour',
  5,
  'pending'
from kit_test_entities
cross join kit_test_actors;

select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', admin_id,
    'role', 'authenticated',
    'user_metadata', json_build_object('role', 'admin')
  )::text,
  true
)
from kit_test_actors;

set local role authenticated;

select public.review_instructor_course_proposal(
  (select proposal_id from kit_test_entities),
  'approved',
  'Approved by rollback lifecycle test'
);

reset role;

update kit_test_entities
set course_id = instructor_course_proposals.approved_course_id
from public.instructor_course_proposals
where instructor_course_proposals.id = kit_test_entities.proposal_id;

do $$
begin
  if not exists (
    select 1
    from kit_test_entities
    join public.learning_courses
      on learning_courses.id = kit_test_entities.course_id
    join kit_test_actors
      on learning_courses.instructor_id = kit_test_actors.instructor_id
    where learning_courses.publication_status = 'draft'
      and learning_courses.is_published = false
  ) then
    raise exception 'Admin approval did not create the expected instructor draft.';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', instructor_id,
    'role', 'authenticated',
    'user_metadata', json_build_object('role', 'instructor')
  )::text,
  true
)
from kit_test_actors;

set local role authenticated;

insert into public.course_lessons (
  id,
  course_id,
  title_en,
  body_en,
  video_url,
  resource_url,
  sort_order,
  is_preview,
  is_published
)
select
  lesson_id,
  course_id,
  'Temporary text and video lesson',
  'This lesson verifies learner-facing text content.',
  'https://example.com/test-video',
  'https://example.com/test-resource',
  1,
  false,
  true
from kit_test_entities;

insert into public.course_quizzes (id, lesson_id, title_en, passing_score)
select quiz_id, lesson_id, 'Temporary lesson quiz', 70
from kit_test_entities;

insert into public.quiz_questions (id, quiz_id, prompt_en, sort_order)
select question_id, quiz_id, 'Which answer passes this rollback test?', 1
from kit_test_entities;

insert into public.quiz_options (
  id,
  question_id,
  option_en,
  is_correct,
  sort_order
)
select correct_option_id, question_id, 'The correct answer', true, 1
from kit_test_entities
union all
select wrong_option_id, question_id, 'The incorrect answer', false, 2
from kit_test_entities;

select public.instructor_confirm_course_publication(
  (select course_id from kit_test_entities)
);

reset role;

do $$
begin
  if not exists (
    select 1
    from public.learning_courses
    join kit_test_entities on kit_test_entities.course_id = learning_courses.id
    where learning_courses.is_published = true
      and learning_courses.publication_status = 'published'
      and learning_courses.instructor_confirmed_at is not null
  ) then
    raise exception 'Instructor publication confirmation did not publish the course.';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', learner_id,
    'role', 'authenticated',
    'user_metadata', json_build_object('role', 'learner')
  )::text,
  true
)
from kit_test_actors;

set local role authenticated;

insert into public.course_enrollments (
  id,
  learner_id,
  course_id,
  status,
  progress_percent
)
select
  enrollment_id,
  learner_id,
  course_id,
  'enrolled',
  0
from kit_test_entities
cross join kit_test_actors;

do $$
declare
  quiz_payload jsonb;
begin
  quiz_payload := public.get_learner_lesson_quiz(
    (select lesson_id from kit_test_entities)
  );

  if quiz_payload is null
    or jsonb_array_length(quiz_payload -> 'questions') <> 1
    or (quiz_payload -> 'questions' -> 0 -> 'options' -> 0) ? 'is_correct'
  then
    raise exception 'Learner quiz payload is missing or exposes the correct answer.';
  end if;
end;
$$;

select public.submit_lesson_quiz(
  (select quiz_id from kit_test_entities),
  (
    select jsonb_build_object(question_id::text, correct_option_id::text)
    from kit_test_entities
  )
);

insert into public.lesson_progress (
  enrollment_id,
  lesson_id,
  learner_id
)
select
  enrollment_id,
  lesson_id,
  learner_id
from kit_test_entities
cross join kit_test_actors;

reset role;

do $$
begin
  if not exists (
    select 1
    from public.quiz_attempts
    join kit_test_entities on kit_test_entities.quiz_id = quiz_attempts.quiz_id
    join kit_test_actors on kit_test_actors.learner_id = quiz_attempts.learner_id
    where quiz_attempts.passed = true
      and quiz_attempts.score_percent = 100
  ) then
    raise exception 'The learner quiz was not scored as a passing attempt.';
  end if;

  if not exists (
    select 1
    from public.lesson_progress
    join kit_test_entities
      on kit_test_entities.lesson_id = lesson_progress.lesson_id
     and kit_test_entities.enrollment_id = lesson_progress.enrollment_id
  ) then
    raise exception 'Learner lesson progress was not recorded.';
  end if;
end;
$$;

rollback;

select
  'passed' as lifecycle_test,
  'All temporary proposal, course, content, quiz, enrollment, attempt, and progress rows were rolled back.' as cleanup;
