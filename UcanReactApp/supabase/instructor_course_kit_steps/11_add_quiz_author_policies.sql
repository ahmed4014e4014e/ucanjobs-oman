alter table public.course_quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "Instructors can read own course quizzes" on public.course_quizzes;
create policy "Instructors can read own course quizzes"
on public.course_quizzes
for select to authenticated
using (
  exists (
    select 1
    from public.course_lessons
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where course_lessons.id = course_quizzes.lesson_id
      and learning_courses.instructor_id = auth.uid()
  )
);

drop policy if exists "Instructors can manage own course quizzes" on public.course_quizzes;
create policy "Instructors can manage own course quizzes"
on public.course_quizzes
for all to authenticated
using (
  exists (
    select 1
    from public.course_lessons
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where course_lessons.id = course_quizzes.lesson_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
)
with check (
  exists (
    select 1
    from public.course_lessons
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where course_lessons.id = course_quizzes.lesson_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Instructors can read own quiz questions" on public.quiz_questions;
create policy "Instructors can read own quiz questions"
on public.quiz_questions
for select to authenticated
using (
  exists (
    select 1
    from public.course_quizzes
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where course_quizzes.id = quiz_questions.quiz_id
      and learning_courses.instructor_id = auth.uid()
  )
);

drop policy if exists "Instructors can manage own quiz questions" on public.quiz_questions;
create policy "Instructors can manage own quiz questions"
on public.quiz_questions
for all to authenticated
using (
  exists (
    select 1
    from public.course_quizzes
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where course_quizzes.id = quiz_questions.quiz_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
)
with check (
  exists (
    select 1
    from public.course_quizzes
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where course_quizzes.id = quiz_questions.quiz_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Instructors can read own quiz options" on public.quiz_options;
create policy "Instructors can read own quiz options"
on public.quiz_options
for select to authenticated
using (
  exists (
    select 1
    from public.quiz_questions
    join public.course_quizzes on course_quizzes.id = quiz_questions.quiz_id
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where quiz_questions.id = quiz_options.question_id
      and learning_courses.instructor_id = auth.uid()
  )
);

drop policy if exists "Instructors can manage own quiz options" on public.quiz_options;
create policy "Instructors can manage own quiz options"
on public.quiz_options
for all to authenticated
using (
  exists (
    select 1
    from public.quiz_questions
    join public.course_quizzes on course_quizzes.id = quiz_questions.quiz_id
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where quiz_questions.id = quiz_options.question_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
)
with check (
  exists (
    select 1
    from public.quiz_questions
    join public.course_quizzes on course_quizzes.id = quiz_questions.quiz_id
    join public.course_lessons on course_lessons.id = course_quizzes.lesson_id
    join public.learning_courses on learning_courses.id = course_lessons.course_id
    where quiz_questions.id = quiz_options.question_id
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Learners can read own quiz attempts" on public.quiz_attempts;
create policy "Learners can read own quiz attempts"
on public.quiz_attempts
for select to authenticated
using (learner_id = auth.uid());
