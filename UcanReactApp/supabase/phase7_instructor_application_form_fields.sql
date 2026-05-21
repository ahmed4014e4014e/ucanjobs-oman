-- Phase 7: update instructor applications for the commercial Ucan instructor form.
-- Run this after phase6_learner_instructor_database_rename.sql.
-- It keeps old columns for historical records but makes them optional.

begin;

alter table public.instructor_applicants
  add column if not exists email text,
  add column if not exists professional_background text,
  add column if not exists portfolio_url text,
  add column if not exists course_topic_proposal text,
  add column if not exists teaching_experience text,
  add column if not exists payment_details text;

alter table public.instructor_applicants
  alter column university_name drop not null,
  alter column university_id drop not null,
  alter column major_name drop not null,
  alter column desired_courses drop not null,
  alter column university_email drop not null,
  alter column phone_number drop not null;

update public.instructor_applicants
set
  email = coalesce(email, university_email),
  professional_background = coalesce(professional_background, major_name, application_message),
  course_topic_proposal = coalesce(course_topic_proposal, desired_courses),
  teaching_experience = coalesce(teaching_experience, application_message)
where email is null
   or professional_background is null
   or course_topic_proposal is null
   or teaching_experience is null;

commit;
