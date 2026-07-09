-- Phase 8: Course content delivery and lesson progress
-- Run this in Supabase SQL Editor before using the /learn/:slug pages.
-- This adds lesson content and per-lesson completion without deleting existing data.

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.learning_courses(id) on delete cascade,
  title_en text not null,
  body_en text,
  video_url text,
  resource_url text,
  sort_order integer not null default 0,
  is_preview boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (enrollment_id, lesson_id)
);

create index if not exists course_lessons_course_sort_idx
  on public.course_lessons (course_id, is_published, sort_order);

create index if not exists lesson_progress_enrollment_idx
  on public.lesson_progress (enrollment_id, learner_id);

drop trigger if exists set_course_lessons_updated_at
on public.course_lessons;

create trigger set_course_lessons_updated_at
before update on public.course_lessons
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.course_lessons enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "Public can read preview course lessons" on public.course_lessons;
create policy "Public can read preview course lessons"
on public.course_lessons
for select
using (
  is_preview = true
  and is_published = true
  and exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_lessons.course_id
      and learning_courses.is_published = true
  )
);

drop policy if exists "Learners can read enrolled course lessons" on public.course_lessons;
create policy "Learners can read enrolled course lessons"
on public.course_lessons
for select
to authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.course_enrollments
    where course_enrollments.course_id = course_lessons.course_id
      and course_enrollments.learner_id = auth.uid()
      and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  )
);

drop policy if exists "Admins can manage course lessons" on public.course_lessons;
create policy "Admins can manage course lessons"
on public.course_lessons
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

drop policy if exists "Learners can read own lesson progress" on public.lesson_progress;
create policy "Learners can read own lesson progress"
on public.lesson_progress
for select
to authenticated
using (learner_id = auth.uid());

drop policy if exists "Learners can create own lesson progress" on public.lesson_progress;
create policy "Learners can create own lesson progress"
on public.lesson_progress
for insert
to authenticated
with check (
  learner_id = auth.uid()
  and exists (
    select 1
    from public.course_enrollments
    where course_enrollments.id = lesson_progress.enrollment_id
      and course_enrollments.learner_id = auth.uid()
      and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  )
);


drop policy if exists "Learners can update own lesson progress" on public.lesson_progress;
create policy "Learners can update own lesson progress"
on public.lesson_progress
for update
to authenticated
using (learner_id = auth.uid())
with check (learner_id = auth.uid());
drop policy if exists "Learners can delete own lesson progress" on public.lesson_progress;
create policy "Learners can delete own lesson progress"
on public.lesson_progress
for delete
to authenticated
using (learner_id = auth.uid());

drop policy if exists "Admins can manage lesson progress" on public.lesson_progress;
create policy "Admins can manage lesson progress"
on public.lesson_progress
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

insert into public.course_lessons (
  course_id,
  title_en,
  body_en,
  sort_order,
  is_preview,
  is_published
)
select
  learning_courses.id,
  'Welcome and course outcomes',
  'Start here. Review the course goals, the expected practical outcomes, and how this course supports job readiness.',
  1,
  true,
  true
from public.learning_courses
where not exists (
  select 1
  from public.course_lessons
  where course_lessons.course_id = learning_courses.id
);

