create index if not exists quiz_questions_quiz_sort_idx
  on public.quiz_questions (quiz_id, sort_order);

create index if not exists quiz_options_question_sort_idx
  on public.quiz_options (question_id, sort_order);

create index if not exists quiz_attempts_learner_quiz_idx
  on public.quiz_attempts (learner_id, quiz_id, submitted_at desc);

drop trigger if exists set_course_quizzes_updated_at
on public.course_quizzes;

create trigger set_course_quizzes_updated_at
before update on public.course_quizzes
for each row
execute function public.set_current_timestamp_updated_at();
