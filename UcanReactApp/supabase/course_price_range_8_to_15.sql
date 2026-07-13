-- Course pricing policy: all course offerings must be priced from 8 OMR to 15 OMR.
-- Run this once in Supabase SQL Editor to update existing rows and enforce the rule in database.

update public.learning_courses
set price_omr = least(15, greatest(8, coalesce(price_omr, 8)))
where price_omr is null
   or price_omr < 8
   or price_omr > 15;

alter table public.learning_courses
  alter column price_omr set default 8;

alter table public.learning_courses
  drop constraint if exists learning_courses_price_omr_8_to_15_check;

alter table public.learning_courses
  add constraint learning_courses_price_omr_8_to_15_check
  check (price_omr >= 8 and price_omr <= 15);

update public.instructor_course_proposals
set suggested_price_omr = least(15, greatest(8, coalesce(suggested_price_omr, 8)))
where suggested_price_omr is null
   or suggested_price_omr < 8
   or suggested_price_omr > 15;

alter table public.instructor_course_proposals
  drop constraint if exists instructor_course_proposals_price_omr_8_to_15_check;

alter table public.instructor_course_proposals
  add constraint instructor_course_proposals_price_omr_8_to_15_check
  check (suggested_price_omr is null or (suggested_price_omr >= 8 and suggested_price_omr <= 15));
