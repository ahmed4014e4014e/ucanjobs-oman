insert into public.course_modules (course_id, title_en, title_ar, sort_order)
select learning_courses.id, module_data.title_en, module_data.title_ar, module_data.sort_order
from public.learning_courses
join (
  values
    ('frontend-engineering-for-omani-graduates', 'HTML, CSS, and responsive layout foundations', 'HTML, CSS, and responsive layout foundations', 10),
    ('frontend-engineering-for-omani-graduates', 'JavaScript fundamentals for real interfaces', 'JavaScript fundamentals for real interfaces', 20),
    ('frontend-engineering-for-omani-graduates', 'React components, routing, and state', 'React components, routing, and state', 30),
    ('frontend-engineering-for-omani-graduates', 'Portfolio project and deployment workflow', 'Portfolio project and deployment workflow', 40),
    ('backend-api-development-with-database', 'Backend architecture basics', 'Backend architecture basics', 10),
    ('backend-api-development-with-database', 'Database tables, relationships, and queries', 'Database tables, relationships, and queries', 20),
    ('backend-api-development-with-database', 'Authentication, roles, and policies', 'Authentication, roles, and policies', 30),
    ('backend-api-development-with-database', 'Storage, uploads, and production checks', 'Storage, uploads, and production checks', 40),
    ('applied-ai-for-business-and-productivity', 'AI tools and workplace use cases', 'AI tools and workplace use cases', 10),
    ('applied-ai-for-business-and-productivity', 'Prompting for research, writing, and planning', 'Prompting for research, writing, and planning', 20),
    ('applied-ai-for-business-and-productivity', 'Automation ideas for small teams', 'Automation ideas for small teams', 30),
    ('applied-ai-for-business-and-productivity', 'Responsible AI and verification habits', 'Responsible AI and verification habits', 40),
    ('cyber-security-foundations-for-junior-roles', 'Security mindset and threat basics', 'Security mindset and threat basics', 10),
    ('cyber-security-foundations-for-junior-roles', 'Accounts, passwords, and access control', 'Accounts, passwords, and access control', 20),
    ('cyber-security-foundations-for-junior-roles', 'Network and web security foundations', 'Network and web security foundations', 30),
    ('cyber-security-foundations-for-junior-roles', 'Junior security role preparation', 'Junior security role preparation', 40),
    ('data-analytics-with-excel-sql-and-dashboards', 'Spreadsheet cleaning and formulas', 'Spreadsheet cleaning and formulas', 10),
    ('data-analytics-with-excel-sql-and-dashboards', 'SQL filtering, grouping, and joins', 'SQL filtering, grouping, and joins', 20),
    ('data-analytics-with-excel-sql-and-dashboards', 'Dashboard design for decisions', 'Dashboard design for decisions', 30),
    ('data-analytics-with-excel-sql-and-dashboards', 'Final reporting project', 'Final reporting project', 40),
    ('graduate-tech-job-readiness', 'CV and LinkedIn foundations', 'CV and LinkedIn foundations', 10),
    ('graduate-tech-job-readiness', 'Portfolio and project storytelling', 'Portfolio and project storytelling', 20),
    ('graduate-tech-job-readiness', 'Interview practice for junior roles', 'Interview practice for junior roles', 30),
    ('graduate-tech-job-readiness', 'Job search workflow in Oman', 'Job search workflow in Oman', 40)
) as module_data (course_slug, title_en, title_ar, sort_order)
  on learning_courses.slug = module_data.course_slug;
