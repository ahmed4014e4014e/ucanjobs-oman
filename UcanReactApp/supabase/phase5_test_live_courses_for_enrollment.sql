-- Phase 5 test data: live database courses for enrollment testing.
-- Run this file in the Supabase SQL editor after Phase 3 tables/policies exist.

insert into public.course_categories (
  slug,
  name_en,
  name_ar,
  description_en,
  description_ar,
  sort_order,
  is_active
)
values
  (
    'test-enrollment',
    'Test Enrollment Courses',
    'Test Enrollment Courses',
    'Temporary published courses used to test learner enrollment.',
    'Temporary published courses used to test learner enrollment.',
    5,
    true
  )
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.learning_courses (
  category_id,
  slug,
  title_en,
  title_ar,
  subtitle_en,
  subtitle_ar,
  summary_en,
  summary_ar,
  level,
  duration,
  language,
  price_omr,
  is_published,
  sort_order
)
select
  course_categories.id,
  course_data.slug,
  course_data.title_en,
  course_data.title_ar,
  course_data.subtitle_en,
  course_data.subtitle_ar,
  course_data.summary_en,
  course_data.summary_ar,
  course_data.level,
  course_data.duration,
  course_data.language,
  course_data.price_omr,
  true,
  course_data.sort_order
from public.course_categories
join (
  values
    (
      'test-enrollment',
      'test-react-job-readiness',
      'Test Course: React Job Readiness',
      'Test Course: React Job Readiness',
      'A short test course for checking enrollment, dashboard display, and course detail routing.',
      'A short test course for checking enrollment, dashboard display, and course detail routing.',
      'Use this temporary course to confirm that a signed-in learner can enroll and see the course in the learner dashboard.',
      'Use this temporary course to confirm that a signed-in learner can enroll and see the course in the learner dashboard.',
      'Beginner',
      '2 weeks',
      'English',
      0.000,
      1
    ),
    (
      'test-enrollment',
      'test-data-analytics-starter',
      'Test Course: Data Analytics Starter',
      'Test Course: Data Analytics Starter',
      'A second live test course for confirming multiple enrollments appear correctly.',
      'A second live test course for confirming multiple enrollments appear correctly.',
      'Use this temporary course to test enrolling in more than one course and reviewing enrollment cards in the dashboard.',
      'Use this temporary course to test enrolling in more than one course and reviewing enrollment cards in the dashboard.',
      'Beginner',
      '1 week',
      'English',
      0.000,
      2
    )
) as course_data (
  category_slug,
  slug,
  title_en,
  title_ar,
  subtitle_en,
  subtitle_ar,
  summary_en,
  summary_ar,
  level,
  duration,
  language,
  price_omr,
  sort_order
)
  on course_categories.slug = course_data.category_slug
on conflict (slug) do update
set
  category_id = excluded.category_id,
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  subtitle_en = excluded.subtitle_en,
  subtitle_ar = excluded.subtitle_ar,
  summary_en = excluded.summary_en,
  summary_ar = excluded.summary_ar,
  level = excluded.level,
  duration = excluded.duration,
  language = excluded.language,
  price_omr = excluded.price_omr,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();

delete from public.course_outcomes
where course_id in (
  select id
  from public.learning_courses
  where slug in ('test-react-job-readiness', 'test-data-analytics-starter')
);

insert into public.course_outcomes (course_id, outcome_en, outcome_ar, sort_order)
select learning_courses.id, outcome_data.outcome_en, outcome_data.outcome_ar, outcome_data.sort_order
from public.learning_courses
join (
  values
    ('test-react-job-readiness', 'Confirm course detail pages load from database.', 'Confirm course detail pages load from database.', 10),
    ('test-react-job-readiness', 'Confirm learner enrollment creates a database row.', 'Confirm learner enrollment creates a database row.', 20),
    ('test-react-job-readiness', 'Confirm the enrolled course appears in the learner dashboard.', 'Confirm the enrolled course appears in the learner dashboard.', 30),
    ('test-data-analytics-starter', 'Confirm a second enrollment can be created.', 'Confirm a second enrollment can be created.', 10),
    ('test-data-analytics-starter', 'Confirm multiple enrolled courses appear in the dashboard.', 'Confirm multiple enrolled courses appear in the dashboard.', 20),
    ('test-data-analytics-starter', 'Confirm course status and progress display correctly.', 'Confirm course status and progress display correctly.', 30)
) as outcome_data (course_slug, outcome_en, outcome_ar, sort_order)
  on learning_courses.slug = outcome_data.course_slug;

delete from public.course_modules
where course_id in (
  select id
  from public.learning_courses
  where slug in ('test-react-job-readiness', 'test-data-analytics-starter')
);

insert into public.course_modules (course_id, title_en, title_ar, sort_order)
select learning_courses.id, module_data.title_en, module_data.title_ar, module_data.sort_order
from public.learning_courses
join (
  values
    ('test-react-job-readiness', 'Open the live course detail page', 'Open the live course detail page', 10),
    ('test-react-job-readiness', 'Click the enrollment button', 'Click the enrollment button', 20),
    ('test-react-job-readiness', 'Review the learner dashboard enrollment card', 'Review the learner dashboard enrollment card', 30),
    ('test-data-analytics-starter', 'Enroll in a second live course', 'Enroll in a second live course', 10),
    ('test-data-analytics-starter', 'Check multiple dashboard cards', 'Check multiple dashboard cards', 20),
    ('test-data-analytics-starter', 'Confirm status and progress values', 'Confirm status and progress values', 30)
) as module_data (course_slug, title_en, title_ar, sort_order)
  on learning_courses.slug = module_data.course_slug;

select
  learning_courses.slug,
  learning_courses.title_en,
  learning_courses.is_published,
  count(distinct course_outcomes.id) as outcomes_count,
  count(distinct course_modules.id) as modules_count
from public.learning_courses
left join public.course_outcomes
  on course_outcomes.course_id = learning_courses.id
left join public.course_modules
  on course_modules.course_id = learning_courses.id
where learning_courses.slug in ('test-react-job-readiness', 'test-data-analytics-starter')
group by learning_courses.slug, learning_courses.title_en, learning_courses.is_published
order by learning_courses.slug;
