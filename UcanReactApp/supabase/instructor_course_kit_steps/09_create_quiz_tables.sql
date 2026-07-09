create table if not exists public.course_quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.course_lessons(id) on delete cascade,
  title_en text not null,
  passing_score integer not null default 70 check (passing_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.course_quizzes(id) on delete cascade,
  prompt_en text not null,
  explanation_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  option_en text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.course_quizzes(id) on delete cascade,
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score_percent integer not null check (score_percent between 0 and 100),
  passed boolean not null,
  submitted_at timestamptz not null default now()
);
