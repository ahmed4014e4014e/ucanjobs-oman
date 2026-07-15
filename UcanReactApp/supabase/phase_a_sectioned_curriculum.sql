-- Phase A: Sectioned curriculum + multi resources + lecture types
-- Safe additive migration. Existing flat lessons get a default "Main" section.
-- Apply in Supabase SQL Editor (or CLI) before relying on the new instructor kit / learner player.

-- ---------------------------------------------------------------------------
-- 1. Sections
-- ---------------------------------------------------------------------------
create table if not exists public.course_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.learning_courses(id) on delete cascade,
  title_en text not null default 'Main',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists course_sections_course_sort_idx
  on public.course_sections (course_id, sort_order);

drop trigger if exists set_course_sections_updated_at on public.course_sections;
create trigger set_course_sections_updated_at
before update on public.course_sections
for each row
execute function public.set_current_timestamp_updated_at();

-- ---------------------------------------------------------------------------
-- 2. Lesson columns: section, type, duration label
-- ---------------------------------------------------------------------------
alter table public.course_lessons
  add column if not exists section_id uuid references public.course_sections(id) on delete set null;

alter table public.course_lessons
  add column if not exists lecture_type text not null default 'video';

alter table public.course_lessons
  add column if not exists duration_label text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'course_lessons_lecture_type_check'
  ) then
    alter table public.course_lessons
      add constraint course_lessons_lecture_type_check
      check (lecture_type in ('video', 'article', 'quiz', 'resources'));
  end if;
end $$;

create index if not exists course_lessons_section_sort_idx
  on public.course_lessons (section_id, sort_order);

-- ---------------------------------------------------------------------------
-- 3. Multi resources per lecture
-- ---------------------------------------------------------------------------
create table if not exists public.lecture_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  name text not null,
  file_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lecture_resources_lesson_sort_idx
  on public.lecture_resources (lesson_id, sort_order);

-- ---------------------------------------------------------------------------
-- 4. Default section backfill for existing lessons without a section
-- ---------------------------------------------------------------------------
insert into public.course_sections (course_id, title_en, sort_order)
select distinct cl.course_id, 'Main', 1
from public.course_lessons cl
where cl.section_id is null
  and not exists (
    select 1 from public.course_sections cs where cs.course_id = cl.course_id
  );

update public.course_lessons cl
set section_id = cs.id
from public.course_sections cs
where cl.section_id is null
  and cs.course_id = cl.course_id
  and cs.title_en = 'Main';

-- Prefer the lowest sort_order section if multiple exist
update public.course_lessons cl
set section_id = sub.section_id
from (
  select distinct on (cs.course_id) cs.course_id, cs.id as section_id
  from public.course_sections cs
  order by cs.course_id, cs.sort_order asc, cs.created_at asc
) sub
where cl.section_id is null
  and cl.course_id = sub.course_id;

-- Infer lecture_type from content when still default video
update public.course_lessons
set lecture_type = 'article'
where lecture_type = 'video'
  and coalesce(video_url, '') = ''
  and coalesce(body_en, '') <> ''
  and coalesce(resource_url, '') = '';

update public.course_lessons
set lecture_type = 'resources'
where lecture_type = 'video'
  and coalesce(video_url, '') = ''
  and coalesce(resource_url, '') <> ''
  and coalesce(body_en, '') = '';

-- Migrate legacy single resource_url into lecture_resources (idempotent by URL)
insert into public.lecture_resources (lesson_id, name, file_url, sort_order)
select
  cl.id,
  coalesce(nullif(split_part(cl.resource_url, '/', -1), ''), 'Resource'),
  cl.resource_url,
  1
from public.course_lessons cl
where coalesce(cl.resource_url, '') <> ''
  and not exists (
    select 1
    from public.lecture_resources lr
    where lr.lesson_id = cl.id
      and lr.file_url = cl.resource_url
  );

-- ---------------------------------------------------------------------------
-- 5. RLS — sections
-- ---------------------------------------------------------------------------
alter table public.course_sections enable row level security;

drop policy if exists "Public can read sections of published courses" on public.course_sections;
create policy "Public can read sections of published courses"
on public.course_sections
for select
using (
  exists (
    select 1 from public.learning_courses lc
    where lc.id = course_sections.course_id
      and lc.is_published = true
  )
);

drop policy if exists "Instructors can manage own course sections" on public.course_sections;
create policy "Instructors can manage own course sections"
on public.course_sections
for all
to authenticated
using (
  exists (
    select 1 from public.learning_courses lc
    where lc.id = course_sections.course_id
      and lc.instructor_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.learning_courses lc
    where lc.id = course_sections.course_id
      and lc.instructor_id = auth.uid()
      and lc.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Admins can manage course sections" on public.course_sections;
create policy "Admins can manage course sections"
on public.course_sections
for all
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- ---------------------------------------------------------------------------
-- 6. RLS — lecture_resources
-- ---------------------------------------------------------------------------
alter table public.lecture_resources enable row level security;

drop policy if exists "Public can read resources for preview lessons" on public.lecture_resources;
create policy "Public can read resources for preview lessons"
on public.lecture_resources
for select
using (
  exists (
    select 1
    from public.course_lessons cl
    join public.learning_courses lc on lc.id = cl.course_id
    where cl.id = lecture_resources.lesson_id
      and cl.is_preview = true
      and cl.is_published = true
      and lc.is_published = true
  )
);

drop policy if exists "Learners can read resources for enrolled lessons" on public.lecture_resources;
create policy "Learners can read resources for enrolled lessons"
on public.lecture_resources
for select
to authenticated
using (
  exists (
    select 1
    from public.course_lessons cl
    join public.course_enrollments ce on ce.course_id = cl.course_id
    where cl.id = lecture_resources.lesson_id
      and cl.is_published = true
      and ce.learner_id = auth.uid()
      and ce.status in ('enrolled', 'in_progress', 'completed')
  )
);

drop policy if exists "Instructors can manage own lecture resources" on public.lecture_resources;
create policy "Instructors can manage own lecture resources"
on public.lecture_resources
for all
to authenticated
using (
  exists (
    select 1
    from public.course_lessons cl
    join public.learning_courses lc on lc.id = cl.course_id
    where cl.id = lecture_resources.lesson_id
      and lc.instructor_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.course_lessons cl
    join public.learning_courses lc on lc.id = cl.course_id
    where cl.id = lecture_resources.lesson_id
      and lc.instructor_id = auth.uid()
      and lc.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Admins can manage lecture resources" on public.lecture_resources;
create policy "Admins can manage lecture resources"
on public.lecture_resources
for all
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
