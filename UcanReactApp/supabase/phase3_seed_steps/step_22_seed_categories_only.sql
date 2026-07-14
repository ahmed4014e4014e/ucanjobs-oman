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
    'software-engineering',
    'Software Engineering',
    'Software Engineering',
    'Frontend, backend, and practical software delivery skills.',
    'Frontend, backend, and practical software delivery skills.',
    10,
    true
  ),
  (
    'artificial-intelligence',
    'Artificial Intelligence',
    'Artificial Intelligence',
    'Applied AI and machine learning skills for business and product work.',
    'Applied AI and machine learning skills for business and product work.',
    20,
    true
  ),
  (
    'cyber-security',
    'Cyber Security',
    'Cyber Security',
    'Security foundations for junior technology roles.',
    'Security foundations for junior technology roles.',
    30,
    true
  ),
  (
    'data-analytics',
    'Data Analytics',
    'Data Analytics',
    'Excel, SQL, dashboards, and practical reporting skills.',
    'Excel, SQL, dashboards, and practical reporting skills.',
    40,
    true
  ),
  (
    'career-readiness',
    'Job Readiness',
    'Job Readiness',
    'Portfolio, CV, interview, and workplace readiness skills.',
    'Portfolio, CV, interview, and workplace readiness skills.',
    50,
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
