create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (enrollment_id, lesson_id)
);
