create extension if not exists pgcrypto;

create table if not exists public.institutes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  code text not null,
  title text not null,
  created_at timestamptz not null default now(),
  unique (institute_id, code)
);

create table if not exists public.tutor_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  display_name text,
  institute_code text,
  bio text,
  booking_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tutor_profiles add column if not exists display_name text;
alter table public.tutor_profiles add column if not exists institute_code text;

create table if not exists public.tutor_course_offerings (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutor_profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  session_type text not null check (session_type in ('private', 'group')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tutor_id, course_id, session_type)
);

create table if not exists public.tutoring_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  tutor_id uuid not null references public.tutor_profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  session_type text not null check (session_type in ('private', 'group')),
  institute_name_snapshot text not null,
  topics_needed_help_with text not null,
  attachment_notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists courses_institute_id_idx
  on public.courses (institute_id);

create index if not exists tutor_course_offerings_tutor_id_idx
  on public.tutor_course_offerings (tutor_id);

create index if not exists tutor_course_offerings_course_id_idx
  on public.tutor_course_offerings (course_id);

create index if not exists tutoring_requests_student_id_idx
  on public.tutoring_requests (student_id);

create index if not exists tutoring_requests_tutor_id_idx
  on public.tutoring_requests (tutor_id);

create index if not exists tutoring_requests_status_idx
  on public.tutoring_requests (status);

create index if not exists tutoring_requests_created_at_idx
  on public.tutoring_requests (created_at desc);

create index if not exists tutoring_requests_tutor_status_created_at_idx
  on public.tutoring_requests (tutor_id, status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tutor_profiles_set_updated_at on public.tutor_profiles;
create trigger tutor_profiles_set_updated_at
before update on public.tutor_profiles
for each row
execute function public.set_updated_at();

alter table public.institutes enable row level security;
alter table public.courses enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.tutor_course_offerings enable row level security;
alter table public.tutoring_requests enable row level security;

alter table public.profiles enable row level security;

drop policy if exists "Public can read basic tutor profiles" on public.profiles;
create policy "Public can read basic tutor profiles"
on public.profiles
for select
using (role = 'tutor');

drop policy if exists "Public can read institutes" on public.institutes;
create policy "Public can read institutes"
on public.institutes
for select
using (true);

drop policy if exists "Public can read courses" on public.courses;
create policy "Public can read courses"
on public.courses
for select
using (true);

drop policy if exists "Public can read tutor profiles" on public.tutor_profiles;
create policy "Public can read tutor profiles"
on public.tutor_profiles
for select
using (is_active = true);

drop policy if exists "Tutors can manage own tutor profile" on public.tutor_profiles;
create policy "Tutors can manage own tutor profile"
on public.tutor_profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Public can read active offerings" on public.tutor_course_offerings;
create policy "Public can read active offerings"
on public.tutor_course_offerings
for select
using (is_active = true);

drop policy if exists "Tutors can manage own offerings" on public.tutor_course_offerings;
create policy "Tutors can manage own offerings"
on public.tutor_course_offerings
for all
using (auth.uid() = tutor_id)
with check (auth.uid() = tutor_id);

drop policy if exists "Students can create tutoring requests" on public.tutoring_requests;
create policy "Students can create tutoring requests"
on public.tutoring_requests
for insert
with check (auth.uid() = student_id);

drop policy if exists "Students and tutors can read related requests" on public.tutoring_requests;
create policy "Students and tutors can read related requests"
on public.tutoring_requests
for select
using (auth.uid() = student_id or auth.uid() = tutor_id);

drop policy if exists "Tutors can update related requests" on public.tutoring_requests;
create policy "Tutors can update related requests"
on public.tutoring_requests
for update
using (auth.uid() = tutor_id)
with check (auth.uid() = tutor_id);

insert into public.institutes (code, name)
values
  ('MCBS', 'Modern College of Business and Science'),
  ('SQU', 'Sultan Qaboos University'),
  ('UTAS', 'University of Technology and Applied Sciences'),
  ('MEC', 'Middle East College')
on conflict (code) do update
set name = excluded.name;

insert into public.courses (institute_id, code, title)
select institutes.id, course_data.code, course_data.title
from public.institutes
join (
  values
    ('MCBS', 'ENG 213', 'English for Academic Purposes'),
    ('MCBS', 'ICT 128', 'Information and Communication Technology'),
    ('MCBS', 'MAT 255', 'Mathematics for College Studies'),
    ('MCBS', 'COSC 1301', 'Introduction to Computing'),
    ('MCBS', 'CPT 220', 'Computer Applications')
) as course_data (institute_code, code, title)
  on institutes.code = course_data.institute_code
on conflict (institute_id, code) do update
set title = excluded.title;

insert into public.tutor_profiles (id, display_name, institute_code, bio, booking_url, is_active)
select
  profiles.id,
  profiles.full_name,
  profiles.institute,
  'Offers free tutoring support for selected MCBS courses through Ucan Oman.',
  'https://calendly.com/ahmed4014e/30min',
  true
from public.profiles
where profiles.email = 'ahmed4014e@gmail.com'
  and profiles.role = 'tutor'
on conflict (id) do update
set display_name = excluded.display_name,
    institute_code = excluded.institute_code,
    bio = excluded.bio,
    booking_url = excluded.booking_url,
    is_active = excluded.is_active;

update public.tutor_profiles
set
  display_name = profiles.full_name,
  institute_code = profiles.institute
from public.profiles
where profiles.id = tutor_profiles.id
  and (
    tutor_profiles.display_name is distinct from profiles.full_name
    or tutor_profiles.institute_code is distinct from profiles.institute
  );

insert into public.tutor_course_offerings (tutor_id, course_id, session_type, is_active)
select
  tutor_profiles.id,
  courses.id,
  session_data.session_type,
  true
from public.tutor_profiles
join public.profiles
  on profiles.id = tutor_profiles.id
join (
  values
    ('ENG 213', 'private'),
    ('ICT 128', 'private'),
    ('MAT 255', 'private'),
    ('COSC 1301', 'private'),
    ('CPT 220', 'private'),
    ('ENG 213', 'group'),
    ('ICT 128', 'group'),
    ('MAT 255', 'group'),
    ('COSC 1301', 'group'),
    ('CPT 220', 'group')
) as session_data (course_code, session_type)
  on true
join public.institutes
  on institutes.code = 'MCBS'
join public.courses
  on courses.institute_id = institutes.id
 and courses.code = session_data.course_code
where profiles.email = 'ahmed4014e@gmail.com'
on conflict (tutor_id, course_id, session_type) do update
set is_active = excluded.is_active;
