-- Run this in Supabase SQL editor if live test courses do not appear in /courses/.
-- It checks whether the two test courses exist, are published, and have readable seed data.

select
  learning_courses.slug,
  learning_courses.title_en,
  learning_courses.is_published,
  course_categories.slug as category_slug,
  course_categories.is_active as category_is_active,
  count(distinct course_outcomes.id) as outcomes_count,
  count(distinct course_modules.id) as modules_count
from public.learning_courses
left join public.course_categories
  on course_categories.id = learning_courses.category_id
left join public.course_outcomes
  on course_outcomes.course_id = learning_courses.id
left join public.course_modules
  on course_modules.course_id = learning_courses.id
where learning_courses.slug in ('test-react-job-readiness', 'test-data-analytics-starter')
group by
  learning_courses.slug,
  learning_courses.title_en,
  learning_courses.is_published,
  course_categories.slug,
  course_categories.is_active
order by learning_courses.slug;

-- Expected:
-- 2 rows
-- is_published = true for both
-- category_slug = test-enrollment for both
-- category_is_active = true for both
-- outcomes_count = 3 for both
-- modules_count = 3 for both
