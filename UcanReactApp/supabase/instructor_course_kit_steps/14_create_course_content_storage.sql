insert into storage.buckets (id, name, public, file_size_limit)
values ('course-content', 'course-content', false, 104857600)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Instructors can upload own course content" on storage.objects;
create policy "Instructors can upload own course content"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'course-content'
  and split_part(name, '/', 1) = auth.uid()::text
  and exists (
    select 1
    from public.learning_courses
    where learning_courses.id::text = split_part(name, '/', 2)
      and learning_courses.instructor_id = auth.uid()
      and learning_courses.publication_status in ('draft', 'ready', 'unpublished')
  )
);

drop policy if exists "Instructors can manage own uploaded course content" on storage.objects;
drop policy if exists "Instructors can read own uploaded course content" on storage.objects;
create policy "Instructors can read own uploaded course content"
on storage.objects
for select to authenticated
using (
  bucket_id = 'course-content'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Instructors can update own uploaded course content" on storage.objects;
create policy "Instructors can update own uploaded course content"
on storage.objects
for update to authenticated
using (
  bucket_id = 'course-content'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'course-content'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Instructors can delete own uploaded course content" on storage.objects;
create policy "Instructors can delete own uploaded course content"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'course-content'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Enrolled learners can read course content" on storage.objects;
create policy "Enrolled learners can read course content"
on storage.objects
for select to authenticated
using (
  bucket_id = 'course-content'
  and exists (
    select 1
    from public.course_enrollments
    where course_enrollments.course_id::text = split_part(name, '/', 2)
      and course_enrollments.learner_id = auth.uid()
      and course_enrollments.status in ('enrolled', 'in_progress', 'completed')
  )
);
