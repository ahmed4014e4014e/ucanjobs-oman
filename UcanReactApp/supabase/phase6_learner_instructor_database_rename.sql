-- Phase 6: rename account roles and legacy tutoring database objects.
-- Run this once in the Supabase SQL editor after deploying the matching frontend code.
-- This script preserves existing rows; it renames objects and updates role values.

begin;

-- 1) Role values: student -> learner, tutor -> instructor.
alter table public.profiles drop constraint if exists profiles_role_check;

update public.profiles
set role = case
  when role = 'student' then 'learner'
  when role = 'tutor' then 'instructor'
  else role
end
where role in ('student', 'tutor');

alter table public.profiles
add constraint profiles_role_check
check (role in ('learner', 'instructor', 'admin'));

update auth.users
set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  to_jsonb(case
    when raw_user_meta_data ->> 'role' = 'student' then 'learner'
    when raw_user_meta_data ->> 'role' = 'tutor' then 'instructor'
    else raw_user_meta_data ->> 'role'
  end),
  true
)
where raw_user_meta_data ->> 'role' in ('student', 'tutor');

alter table public.contact_messages drop constraint if exists contact_messages_role_check;

update public.contact_messages
set role = case
  when role = 'student' then 'learner'
  when role = 'tutor' then 'instructor'
  else role
end
where role in ('student', 'tutor');

alter table public.contact_messages
add constraint contact_messages_role_check
check (role in ('learner', 'instructor'));

-- 2) Rename tables, keeping all existing data.
do $$
begin
  if to_regclass('public.tutor_profiles') is not null
     and to_regclass('public.instructor_profiles') is null then
    alter table public.tutor_profiles rename to instructor_profiles;
  end if;

  if to_regclass('public.tutor_course_offerings') is not null
     and to_regclass('public.instructor_course_offerings') is null then
    alter table public.tutor_course_offerings rename to instructor_course_offerings;
  end if;

  if to_regclass('public.tutoring_requests') is not null
     and to_regclass('public.learning_requests') is null then
    alter table public.tutoring_requests rename to learning_requests;
  end if;

  if to_regclass('public.tutor_applicants') is not null
     and to_regclass('public.instructor_applicants') is null then
    alter table public.tutor_applicants rename to instructor_applicants;
  end if;
end $$;

-- 3) Rename key columns.
do $$
begin
  if to_regclass('public.instructor_course_offerings') is not null
     and exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'instructor_course_offerings'
         and column_name = 'tutor_id'
     )
     and not exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'instructor_course_offerings'
         and column_name = 'instructor_id'
     ) then
    alter table public.instructor_course_offerings rename column tutor_id to instructor_id;
  end if;

  if to_regclass('public.learning_requests') is not null
     and exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'learning_requests'
         and column_name = 'student_id'
     )
     and not exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'learning_requests'
         and column_name = 'learner_id'
     ) then
    alter table public.learning_requests rename column student_id to learner_id;
  end if;

  if to_regclass('public.learning_requests') is not null
     and exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'learning_requests'
         and column_name = 'tutor_id'
     )
     and not exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'learning_requests'
         and column_name = 'instructor_id'
     ) then
    alter table public.learning_requests rename column tutor_id to instructor_id;
  end if;

  if to_regclass('public.instructor_applicants') is not null
     and exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'instructor_applicants'
         and column_name = 'desired_tutoring_courses'
     )
     and not exists (
       select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name = 'instructor_applicants'
         and column_name = 'desired_courses'
     ) then
    alter table public.instructor_applicants rename column desired_tutoring_courses to desired_courses;
  end if;
end $$;

-- 4) Recreate foreign keys with the new names used by the frontend PostgREST selects.
alter table public.instructor_course_offerings
  drop constraint if exists tutor_course_offerings_tutor_id_fkey,
  drop constraint if exists instructor_course_offerings_instructor_id_fkey;

alter table public.instructor_course_offerings
  add constraint instructor_course_offerings_instructor_id_fkey
  foreign key (instructor_id) references public.instructor_profiles(id) on delete cascade;

alter table public.learning_requests
  drop constraint if exists tutoring_requests_student_id_fkey,
  drop constraint if exists tutoring_requests_tutor_id_fkey,
  drop constraint if exists tutoring_requests_course_id_fkey,
  drop constraint if exists learning_requests_learner_id_fkey,
  drop constraint if exists learning_requests_instructor_id_fkey,
  drop constraint if exists learning_requests_course_id_fkey;

alter table public.learning_requests
  add constraint learning_requests_learner_id_fkey
  foreign key (learner_id) references public.profiles(id) on delete cascade,
  add constraint learning_requests_instructor_id_fkey
  foreign key (instructor_id) references public.instructor_profiles(id) on delete cascade,
  add constraint learning_requests_course_id_fkey
  foreign key (course_id) references public.courses(id) on delete cascade;

-- 5) Rebuild the auth profile sync function with learner as the default role.
create or replace function public.handle_auth_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  incoming_role text;
begin
  incoming_role := coalesce(new.raw_user_meta_data ->> 'role', 'learner');

  if incoming_role = 'student' then
    incoming_role := 'learner';
  elsif incoming_role = 'tutor' then
    incoming_role := 'instructor';
  end if;

  insert into public.profiles (
    id,
    full_name,
    role,
    institute,
    email
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    incoming_role,
    new.raw_user_meta_data ->> 'institute',
    new.email
  )
  on conflict (id) do update
  set
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    institute = coalesce(public.profiles.institute, excluded.institute),
    email = excluded.email,
    role = coalesce(public.profiles.role, excluded.role);

  return new;
end;
$$;

-- 6) Recreate RLS policies on renamed tables.
alter table public.instructor_profiles enable row level security;
alter table public.instructor_course_offerings enable row level security;
alter table public.learning_requests enable row level security;
alter table public.instructor_applicants enable row level security;

drop policy if exists "Public can read basic tutor profiles" on public.profiles;
drop policy if exists "Public can read basic instructor profiles" on public.profiles;
create policy "Public can read basic instructor profiles"
on public.profiles
for select
using (role = 'instructor');

drop policy if exists "Public can read tutor profiles" on public.instructor_profiles;
drop policy if exists "Public can read instructor profiles" on public.instructor_profiles;
create policy "Public can read instructor profiles"
on public.instructor_profiles
for select
using (is_active = true);

drop policy if exists "Tutors can manage own tutor profile" on public.instructor_profiles;
drop policy if exists "Instructors can manage own instructor profile" on public.instructor_profiles;
create policy "Instructors can manage own instructor profile"
on public.instructor_profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Public can read active offerings" on public.instructor_course_offerings;
create policy "Public can read active instructor offerings"
on public.instructor_course_offerings
for select
using (is_active = true);

drop policy if exists "Tutors can manage own offerings" on public.instructor_course_offerings;
drop policy if exists "Instructors can manage own offerings" on public.instructor_course_offerings;
create policy "Instructors can manage own offerings"
on public.instructor_course_offerings
for all
using (auth.uid() = instructor_id)
with check (auth.uid() = instructor_id);

drop policy if exists "Students can create tutoring requests" on public.learning_requests;
drop policy if exists "Learners can create learning requests" on public.learning_requests;
create policy "Learners can create learning requests"
on public.learning_requests
for insert
with check (auth.uid() = learner_id);

drop policy if exists "Students and tutors can read related requests" on public.learning_requests;
drop policy if exists "Learners and instructors can read related requests" on public.learning_requests;
create policy "Learners and instructors can read related requests"
on public.learning_requests
for select
using (auth.uid() = learner_id or auth.uid() = instructor_id);

drop policy if exists "Tutors can update related requests" on public.learning_requests;
drop policy if exists "Instructors can update related requests" on public.learning_requests;
create policy "Instructors can update related requests"
on public.learning_requests
for update
using (auth.uid() = instructor_id)
with check (auth.uid() = instructor_id);

drop policy if exists "Admins can read tutoring requests" on public.learning_requests;
drop policy if exists "Admins can read learning requests" on public.learning_requests;
create policy "Admins can read learning requests"
on public.learning_requests
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update tutoring requests" on public.learning_requests;
drop policy if exists "Admins can update learning requests" on public.learning_requests;
create policy "Admins can update learning requests"
on public.learning_requests
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Public can create tutor applications" on public.instructor_applicants;
drop policy if exists "Public can create instructor applications" on public.instructor_applicants;
create policy "Public can create instructor applications"
on public.instructor_applicants
for insert
to anon, authenticated
with check (true);

drop policy if exists "Applicants can read own tutor applications" on public.instructor_applicants;
drop policy if exists "Applicants can read own instructor applications" on public.instructor_applicants;
create policy "Applicants can read own instructor applications"
on public.instructor_applicants
for select
to authenticated
using (applicant_profile_id = auth.uid());

drop policy if exists "Admins can read tutor applications" on public.instructor_applicants;
drop policy if exists "Admins can read instructor applications" on public.instructor_applicants;
create policy "Admins can read instructor applications"
on public.instructor_applicants
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update tutor applications" on public.instructor_applicants;
drop policy if exists "Admins can update instructor applications" on public.instructor_applicants;
create policy "Admins can update instructor applications"
on public.instructor_applicants
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- 7) Rename private storage buckets used by the old request/application flows.
insert into storage.buckets (id, name, public)
values
  ('learning-attachments', 'learning-attachments', false),
  ('instructor-applicant-attachments', 'instructor-applicant-attachments', false)
on conflict (id) do nothing;

update storage.objects
set bucket_id = 'learning-attachments'
where bucket_id = 'tutoring-attachments';

update storage.objects
set bucket_id = 'instructor-applicant-attachments'
where bucket_id = 'tutor-applicant-attachments';

-- Supabase protects storage-managed tables from direct deletes.
-- Keep the old empty buckets if they exist; the app will use the new bucket names.

drop policy if exists "Users can upload own tutoring attachments" on storage.objects;
drop policy if exists "Users can read own tutoring attachments" on storage.objects;
drop policy if exists "Tutors can read assigned tutoring attachments" on storage.objects;
drop policy if exists "Users can update own tutoring attachments" on storage.objects;
drop policy if exists "Users can delete own tutoring attachments" on storage.objects;
drop policy if exists "Admins can read tutoring attachments" on storage.objects;
drop policy if exists "Public can upload tutor applicant files" on storage.objects;
drop policy if exists "Admins can read tutor applicant files" on storage.objects;
drop policy if exists "Admins can delete tutor applicant files" on storage.objects;

drop policy if exists "Users can upload own learning attachments" on storage.objects;
create policy "Users can upload own learning attachments"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'learning-attachments'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can read own learning attachments" on storage.objects;
create policy "Users can read own learning attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'learning-attachments'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Instructors can read assigned learning attachments" on storage.objects;
create policy "Instructors can read assigned learning attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'learning-attachments'
  and exists (
    select 1
    from public.learning_requests
    where learning_requests.instructor_id = auth.uid()
      and exists (
        select 1
        from jsonb_array_elements(coalesce(learning_requests.attachment_files, '[]'::jsonb)) as file_data
        where file_data ->> 'path' = storage.objects.name
      )
  )
);

drop policy if exists "Admins can read learning attachments" on storage.objects;
create policy "Admins can read learning attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'learning-attachments'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Public can upload instructor applicant files" on storage.objects;
create policy "Public can upload instructor applicant files"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'instructor-applicant-attachments');

drop policy if exists "Admins can read instructor applicant files" on storage.objects;
create policy "Admins can read instructor applicant files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'instructor-applicant-attachments'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete instructor applicant files" on storage.objects;
create policy "Admins can delete instructor applicant files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'instructor-applicant-attachments'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

commit;
