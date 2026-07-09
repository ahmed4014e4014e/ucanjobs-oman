alter table public.learning_courses
  add column if not exists instructor_id uuid references public.profiles(id) on delete set null,
  add column if not exists proposal_id uuid references public.instructor_course_proposals(id) on delete set null,
  add column if not exists publication_status text not null default 'draft',
  add column if not exists instructor_confirmed_at timestamptz;

alter table public.learning_courses
  drop constraint if exists learning_courses_publication_status_check;

alter table public.learning_courses
  add constraint learning_courses_publication_status_check
  check (publication_status in ('draft', 'ready', 'published', 'unpublished'));
