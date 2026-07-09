alter table public.instructor_course_proposals
  add column if not exists admin_notes text,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists approved_course_id uuid references public.learning_courses(id) on delete set null;
