delete from public.course_outcomes
where course_id in (
  select id
  from public.learning_courses
  where slug in (
    'frontend-engineering-for-omani-graduates',
    'backend-api-development-with-database',
    'applied-ai-for-business-and-productivity',
    'cyber-security-foundations-for-junior-roles',
    'data-analytics-with-excel-sql-and-dashboards',
    'graduate-tech-job-readiness'
  )
);
