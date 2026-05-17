insert into public.course_outcomes (course_id, outcome_en, outcome_ar, sort_order)
select learning_courses.id, outcome_data.outcome_en, outcome_data.outcome_ar, outcome_data.sort_order
from public.learning_courses
join (
  values
    ('frontend-engineering-for-omani-graduates', 'Build responsive pages and React components', 'Build responsive pages and React components', 10),
    ('frontend-engineering-for-omani-graduates', 'Understand browser fundamentals and modern JavaScript', 'Understand browser fundamentals and modern JavaScript', 20),
    ('frontend-engineering-for-omani-graduates', 'Create portfolio projects for job applications', 'Create portfolio projects for job applications', 30),
    ('backend-api-development-with-database', 'Design relational tables and API flows', 'Design relational tables and API flows', 10),
    ('backend-api-development-with-database', 'Use authentication and role-based access safely', 'Use authentication and role-based access safely', 20),
    ('backend-api-development-with-database', 'Connect frontend apps to backend services', 'Connect frontend apps to backend services', 30),
    ('applied-ai-for-business-and-productivity', 'Use AI tools for research and productivity tasks', 'Use AI tools for research and productivity tasks', 10),
    ('applied-ai-for-business-and-productivity', 'Write better prompts for practical workflows', 'Write better prompts for practical workflows', 20),
    ('applied-ai-for-business-and-productivity', 'Understand responsible AI limitations', 'Understand responsible AI limitations', 30),
    ('cyber-security-foundations-for-junior-roles', 'Understand common threats and safe practices', 'Understand common threats and safe practices', 10),
    ('cyber-security-foundations-for-junior-roles', 'Apply access control and account security basics', 'Apply access control and account security basics', 20),
    ('cyber-security-foundations-for-junior-roles', 'Prepare for junior security conversations', 'Prepare for junior security conversations', 30),
    ('data-analytics-with-excel-sql-and-dashboards', 'Clean and analyze spreadsheet data', 'Clean and analyze spreadsheet data', 10),
    ('data-analytics-with-excel-sql-and-dashboards', 'Write useful SQL queries', 'Write useful SQL queries', 20),
    ('data-analytics-with-excel-sql-and-dashboards', 'Present insights through dashboards', 'Present insights through dashboards', 30),
    ('graduate-tech-job-readiness', 'Improve CV and LinkedIn positioning', 'Improve CV and LinkedIn positioning', 10),
    ('graduate-tech-job-readiness', 'Build a portfolio story around projects', 'Build a portfolio story around projects', 20),
    ('graduate-tech-job-readiness', 'Practice junior role interview answers', 'Practice junior role interview answers', 30)
) as outcome_data (course_slug, outcome_en, outcome_ar, sort_order)
  on learning_courses.slug = outcome_data.course_slug;
