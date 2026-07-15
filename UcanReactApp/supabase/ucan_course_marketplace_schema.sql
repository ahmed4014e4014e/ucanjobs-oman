-- UcanJobs course marketplace schema
-- Run each STEP block sequentially in the database SQL editor.
-- If a step succeeds, continue to the next one. If a step fails, stop and fix that step first.

-- STEP 01: Enable UUID support and create shared updated_at trigger function.
create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- STEP 02: Create course category table.
create table if not exists public.course_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text,
  description_en text,
  description_ar text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- STEP 03: Create main learning course table.
create table if not exists public.learning_courses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.course_categories(id) on delete set null,
  slug text not null unique,
  title_en text not null,
  title_ar text,
  subtitle_en text,
  subtitle_ar text,
  summary_en text,
  summary_ar text,
  level text not null,
  duration text not null,
  language text not null,
  price_omr numeric(10, 3) not null default 8,
  constraint learning_courses_price_omr_8_to_15_check check (price_omr >= 8 and price_omr <= 15),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- STEP 04: Create course outcomes table.
create table if not exists public.course_outcomes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.learning_courses(id) on delete cascade,
  outcome_en text not null,
  outcome_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- STEP 05: Create course modules table.
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.learning_courses(id) on delete cascade,
  title_en text not null,
  title_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- STEP 06: Create learner enrollment table.
create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.learning_courses(id) on delete restrict,
  status text not null default 'interested'
    check (status in ('interested', 'enrolled', 'in_progress', 'completed', 'cancelled')),
  progress_percent integer not null default 0
    check (progress_percent >= 0 and progress_percent <= 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_id, course_id)
);

-- STEP 07: Add indexes for course browsing and learner enrollment queries.
create index if not exists course_categories_active_sort_idx
  on public.course_categories (is_active, sort_order);

create index if not exists learning_courses_category_idx
  on public.learning_courses (category_id);

create index if not exists learning_courses_published_sort_idx
  on public.learning_courses (is_published, sort_order);

create index if not exists course_outcomes_course_sort_idx
  on public.course_outcomes (course_id, sort_order);

create index if not exists course_modules_course_sort_idx
  on public.course_modules (course_id, sort_order);

create index if not exists course_enrollments_learner_idx
  on public.course_enrollments (learner_id, status, enrolled_at desc);

-- STEP 08: Add updated_at triggers.
drop trigger if exists set_course_categories_updated_at
on public.course_categories;

create trigger set_course_categories_updated_at
before update on public.course_categories
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_learning_courses_updated_at
on public.learning_courses;

create trigger set_learning_courses_updated_at
before update on public.learning_courses
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_course_enrollments_updated_at
on public.course_enrollments;

create trigger set_course_enrollments_updated_at
before update on public.course_enrollments
for each row
execute function public.set_current_timestamp_updated_at();

-- STEP 09: Enable row level security.
alter table public.course_categories enable row level security;
alter table public.learning_courses enable row level security;
alter table public.course_outcomes enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_enrollments enable row level security;

-- STEP 10: Allow public visitors to read active course categories.
drop policy if exists "Public can read active course categories"
on public.course_categories;

create policy "Public can read active course categories"
on public.course_categories
for select
using (is_active = true);

-- STEP 11: Allow public visitors to read published courses.
drop policy if exists "Public can read published courses"
on public.learning_courses;

create policy "Public can read published courses"
on public.learning_courses
for select
using (is_published = true);

-- STEP 12: Allow public visitors to read outcomes for published courses.
drop policy if exists "Public can read published course outcomes"
on public.course_outcomes;

create policy "Public can read published course outcomes"
on public.course_outcomes
for select
using (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_outcomes.course_id
      and learning_courses.is_published = true
  )
);

-- STEP 13: Allow public visitors to read modules for published courses.
drop policy if exists "Public can read published course modules"
on public.course_modules;

create policy "Public can read published course modules"
on public.course_modules
for select
using (
  exists (
    select 1
    from public.learning_courses
    where learning_courses.id = course_modules.course_id
      and learning_courses.is_published = true
  )
);

-- STEP 14: Allow learners to create their own enrollment records.
drop policy if exists "Learners can create own course enrollments"
on public.course_enrollments;

create policy "Learners can create own course enrollments"
on public.course_enrollments
for insert
to authenticated
with check (auth.uid() = learner_id);

-- STEP 15: Allow learners to read their own enrollment records.
drop policy if exists "Learners can read own course enrollments"
on public.course_enrollments;

create policy "Learners can read own course enrollments"
on public.course_enrollments
for select
to authenticated
using (auth.uid() = learner_id);

-- STEP 16: Allow learners to update their own enrollment records.
drop policy if exists "Learners can update own course enrollments"
on public.course_enrollments;

create policy "Learners can update own course enrollments"
on public.course_enrollments
for update
to authenticated
using (auth.uid() = learner_id)
with check (auth.uid() = learner_id);

-- STEP 17: Allow admins to manage course categories.
drop policy if exists "Admins can manage course categories"
on public.course_categories;

create policy "Admins can manage course categories"
on public.course_categories
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- STEP 18: Allow admins to manage learning courses.
drop policy if exists "Admins can manage learning courses"
on public.learning_courses;

create policy "Admins can manage learning courses"
on public.learning_courses
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- STEP 19: Allow admins to manage course outcomes.
drop policy if exists "Admins can manage course outcomes"
on public.course_outcomes;

create policy "Admins can manage course outcomes"
on public.course_outcomes
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- STEP 20: Allow admins to manage course modules.
drop policy if exists "Admins can manage course modules"
on public.course_modules;

create policy "Admins can manage course modules"
on public.course_modules
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- STEP 21: Allow admins to manage course enrollments.
drop policy if exists "Admins can manage course enrollments"
on public.course_enrollments;

create policy "Admins can manage course enrollments"
on public.course_enrollments
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- STEP 22: Seed the initial course categories.
insert into public.course_categories (slug, name_en, name_ar, description_en, description_ar, sort_order, is_active)
values
  ('software-engineering', 'Software Engineering', 'هندسة البرمجيات', 'Frontend, backend, and practical software delivery skills.', 'مهارات الواجهات والخلفية وتسليم البرمجيات بشكل عملي.', 10, true),
  ('artificial-intelligence', 'Artificial Intelligence', 'الذكاء الاصطناعي', 'Applied AI and machine learning skills for business and product work.', 'مهارات تطبيقية في الذكاء الاصطناعي وتعلم الآلة للأعمال والمنتجات.', 20, true),
  ('cyber-security', 'Cyber Security', 'الأمن السيبراني', 'Security foundations for junior technology roles.', 'أساسيات الأمن السيبراني للوظائف التقنية المبتدئة.', 30, true),
  ('data-analytics', 'Data Analytics', 'تحليل البيانات', 'Excel, SQL, dashboards, and practical reporting skills.', 'مهارات Excel وSQL ولوحات البيانات والتقارير العملية.', 40, true),
  ('career-readiness', 'Job Readiness', 'الاستعداد الوظيفي', 'Portfolio, CV, interview, and workplace readiness skills.', 'مهارات الملف المهني والسيرة الذاتية والمقابلات والاستعداد لسوق العمل.', 50, true)
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

-- STEP 23: Seed the initial published courses.
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
    ('software-engineering', 'frontend-engineering-for-omani-graduates', 'Frontend Engineering For Omani Graduates', 'هندسة الواجهات الأمامية للخريجين في عمان', 'Build modern web interfaces with HTML, CSS, JavaScript, React, and portfolio projects.', 'بناء واجهات ويب حديثة باستخدام HTML وCSS وJavaScript وReact ومشاريع عملية.', 'A practical frontend path for graduates who need stronger web development skills before applying for junior software roles.', 'مسار عملي للواجهات الأمامية للخريجين الذين يحتاجون إلى مهارات تطوير ويب أقوى قبل التقديم على وظائف برمجية للمبتدئين.', 'Beginner to Intermediate', '8 weeks', 'English + Arabic support', 12.000, 10),
    ('software-engineering', 'backend-api-development-with-database', 'Backend API Development With Database', 'تطوير واجهات Backend API باستخدام database', 'Learn databases, authentication, storage, and API workflows using a practical backend stack.', 'تعلم قواعد البيانات والمصادقة والتخزين وسير عمل API من خلال تطبيق عملي.', 'A backend course focused on the skills junior developers need when working with application data, users, and secure access.', 'دورة خلفية تركز على المهارات التي يحتاجها المطور المبتدئ للتعامل مع البيانات والمستخدمين والوصول الآمن.', 'Intermediate', '7 weeks', 'English', 15.000, 20),
    ('artificial-intelligence', 'applied-ai-for-business-and-productivity', 'Applied AI For Business And Productivity', 'الذكاء الاصطناعي التطبيقي للأعمال والإنتاجية', 'Use AI tools, prompt workflows, and automation to solve practical workplace problems.', 'استخدام أدوات الذكاء الاصطناعي وسير عمل الأوامر والأتمتة لحل مشكلات العمل العملية.', 'A practical AI course for graduates who need to understand modern AI tools and use them responsibly in business contexts.', 'دورة عملية في الذكاء الاصطناعي للخريجين الذين يحتاجون إلى فهم أدوات الذكاء الاصطناعي الحديثة واستخدامها بمسؤولية في بيئات العمل.', 'Beginner', '5 weeks', 'English + Arabic support', 10.000, 30),
    ('cyber-security', 'cyber-security-foundations-for-junior-roles', 'Cyber Security Foundations For Junior Roles', 'أساسيات الأمن السيبراني للوظائف المبتدئة', 'Learn security concepts, common threats, access control, and safe operational practices.', 'تعلم مفاهيم الأمن والتهديدات الشائعة والتحكم في الوصول والممارسات التشغيلية الآمنة.', 'A foundation course for graduates preparing for entry-level security, support, or IT operations roles.', 'دورة تأسيسية للخريجين المستعدين لوظائف الأمن أو الدعم أو تشغيل تقنية المعلومات للمبتدئين.', 'Beginner', '6 weeks', 'English', 13.000, 40),
    ('data-analytics', 'data-analytics-with-excel-sql-and-dashboards', 'Data Analytics With Excel, SQL, And Dashboards', 'تحليل البيانات باستخدام Excel وSQL ولوحات البيانات', 'Turn raw data into clear reports using spreadsheet analysis, SQL queries, and dashboard thinking.', 'تحويل البيانات الخام إلى تقارير واضحة باستخدام تحليل الجداول واستعلامات SQL ومنطق لوحات البيانات.', 'A job-focused analytics path for graduates who want practical reporting and business insight skills.', 'مسار تحليلي موجه للوظائف للخريجين الذين يريدون مهارات عملية في التقارير وفهم الأعمال.', 'Beginner to Intermediate', '7 weeks', 'English + Arabic support', 11.000, 50),
    ('career-readiness', 'graduate-tech-job-readiness', 'Graduate Tech Job Readiness', 'الاستعداد الوظيفي للخريجين في التقنية', 'Prepare a stronger CV, portfolio, LinkedIn profile, interview answers, and job search workflow.', 'إعداد سيرة ذاتية وملف أعمال وحساب LinkedIn وإجابات مقابلات وخطة بحث وظيفي أقوى.', 'A practical employability course for graduates who need to present their skills clearly to technology employers in Oman.', 'دورة عملية للتوظيف للخريجين الذين يحتاجون إلى عرض مهاراتهم بوضوح لأصحاب العمل التقنيين في عمان.', 'Beginner', '4 weeks', 'English + Arabic support', 8.000, 60)
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

-- STEP 24: Clear old seeded outcomes before re-inserting them.
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

-- STEP 25: Seed course outcomes.
insert into public.course_outcomes (course_id, outcome_en, outcome_ar, sort_order)
select learning_courses.id, outcome_data.outcome_en, outcome_data.outcome_ar, outcome_data.sort_order
from public.learning_courses
join (
  values
    ('frontend-engineering-for-omani-graduates', 'Build responsive pages and React components', 'بناء صفحات متجاوبة ومكونات React', 10),
    ('frontend-engineering-for-omani-graduates', 'Understand browser fundamentals and modern JavaScript', 'فهم أساسيات المتصفح وJavaScript الحديثة', 20),
    ('frontend-engineering-for-omani-graduates', 'Create portfolio projects for job applications', 'إنشاء مشاريع عملية لملف التقديم الوظيفي', 30),
    ('backend-api-development-with-database', 'Design relational tables and API flows', 'تصميم الجداول العلائقية وتدفقات API', 10),
    ('backend-api-development-with-database', 'Use authentication and role-based access safely', 'استخدام المصادقة والوصول حسب الدور بشكل آمن', 20),
    ('backend-api-development-with-database', 'Connect frontend apps to backend services', 'ربط تطبيقات الواجهة الأمامية بالخدمات الخلفية', 30),
    ('applied-ai-for-business-and-productivity', 'Use AI tools for research and productivity tasks', 'استخدام أدوات الذكاء الاصطناعي للبحث والإنتاجية', 10),
    ('applied-ai-for-business-and-productivity', 'Write better prompts for practical workflows', 'كتابة أوامر أفضل لسير العمل العملي', 20),
    ('applied-ai-for-business-and-productivity', 'Understand responsible AI limitations', 'فهم حدود الذكاء الاصطناعي المسؤول', 30),
    ('cyber-security-foundations-for-junior-roles', 'Understand common threats and safe practices', 'فهم التهديدات الشائعة والممارسات الآمنة', 10),
    ('cyber-security-foundations-for-junior-roles', 'Apply access control and account security basics', 'تطبيق أساسيات التحكم في الوصول وأمان الحسابات', 20),
    ('cyber-security-foundations-for-junior-roles', 'Prepare for junior security conversations', 'الاستعداد لمناقشات الأمن للوظائف المبتدئة', 30),
    ('data-analytics-with-excel-sql-and-dashboards', 'Clean and analyze spreadsheet data', 'تنظيف وتحليل بيانات الجداول', 10),
    ('data-analytics-with-excel-sql-and-dashboards', 'Write useful SQL queries', 'كتابة استعلامات SQL مفيدة', 20),
    ('data-analytics-with-excel-sql-and-dashboards', 'Present insights through dashboards', 'عرض النتائج من خلال لوحات البيانات', 30),
    ('graduate-tech-job-readiness', 'Improve CV and LinkedIn positioning', 'تحسين السيرة الذاتية وحضور LinkedIn', 10),
    ('graduate-tech-job-readiness', 'Build a portfolio story around projects', 'بناء قصة مهنية حول المشاريع', 20),
    ('graduate-tech-job-readiness', 'Practice junior role interview answers', 'التدرب على إجابات مقابلات الوظائف المبتدئة', 30)
) as outcome_data (course_slug, outcome_en, outcome_ar, sort_order)
  on learning_courses.slug = outcome_data.course_slug;

-- STEP 26: Clear old seeded modules before re-inserting them.
delete from public.course_modules
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

-- STEP 27: Seed course modules.
insert into public.course_modules (course_id, title_en, title_ar, sort_order)
select learning_courses.id, module_data.title_en, module_data.title_ar, module_data.sort_order
from public.learning_courses
join (
  values
    ('frontend-engineering-for-omani-graduates', 'HTML, CSS, and responsive layout foundations', 'أساسيات HTML وCSS والتصميم المتجاوب', 10),
    ('frontend-engineering-for-omani-graduates', 'JavaScript fundamentals for real interfaces', 'أساسيات JavaScript للواجهات العملية', 20),
    ('frontend-engineering-for-omani-graduates', 'React components, routing, and state', 'مكونات React والتوجيه وإدارة الحالة', 30),
    ('frontend-engineering-for-omani-graduates', 'Portfolio project and deployment workflow', 'مشروع عملي ونشره', 40),
    ('backend-api-development-with-database', 'Backend architecture basics', 'أساسيات بنية الخلفية', 10),
    ('backend-api-development-with-database', 'Database tables, relationships, and queries', 'جداول قاعدة البيانات والعلاقات والاستعلامات', 20),
    ('backend-api-development-with-database', 'Authentication, roles, and policies', 'المصادقة والأدوار والسياسات', 30),
    ('backend-api-development-with-database', 'Storage, uploads, and production checks', 'التخزين والرفع وفحوصات الإنتاج', 40),
    ('applied-ai-for-business-and-productivity', 'AI tools and workplace use cases', 'أدوات الذكاء الاصطناعي وحالات استخدامها في العمل', 10),
    ('applied-ai-for-business-and-productivity', 'Prompting for research, writing, and planning', 'الأوامر للبحث والكتابة والتخطيط', 20),
    ('applied-ai-for-business-and-productivity', 'Automation ideas for small teams', 'أفكار الأتمتة للفرق الصغيرة', 30),
    ('applied-ai-for-business-and-productivity', 'Responsible AI and verification habits', 'الذكاء الاصطناعي المسؤول وعادات التحقق', 40),
    ('cyber-security-foundations-for-junior-roles', 'Security mindset and threat basics', 'العقلية الأمنية وأساسيات التهديدات', 10),
    ('cyber-security-foundations-for-junior-roles', 'Accounts, passwords, and access control', 'الحسابات وكلمات المرور والتحكم في الوصول', 20),
    ('cyber-security-foundations-for-junior-roles', 'Network and web security foundations', 'أساسيات أمن الشبكات والويب', 30),
    ('cyber-security-foundations-for-junior-roles', 'Junior security role preparation', 'الاستعداد لوظائف الأمن المبتدئة', 40),
    ('data-analytics-with-excel-sql-and-dashboards', 'Spreadsheet cleaning and formulas', 'تنظيف الجداول والمعادلات', 10),
    ('data-analytics-with-excel-sql-and-dashboards', 'SQL filtering, grouping, and joins', 'التصفية والتجميع والربط في SQL', 20),
    ('data-analytics-with-excel-sql-and-dashboards', 'Dashboard design for decisions', 'تصميم لوحات البيانات للقرارات', 30),
    ('data-analytics-with-excel-sql-and-dashboards', 'Final reporting project', 'مشروع تقرير نهائي', 40),
    ('graduate-tech-job-readiness', 'CV and LinkedIn foundations', 'أساسيات السيرة الذاتية وLinkedIn', 10),
    ('graduate-tech-job-readiness', 'Portfolio and project storytelling', 'عرض ملف الأعمال وقصة المشاريع', 20),
    ('graduate-tech-job-readiness', 'Interview practice for junior roles', 'تدريب مقابلات الوظائف المبتدئة', 30),
    ('graduate-tech-job-readiness', 'Job search workflow in Oman', 'خطة البحث الوظيفي في عمان', 40)
) as module_data (course_slug, title_en, title_ar, sort_order)
  on learning_courses.slug = module_data.course_slug;
