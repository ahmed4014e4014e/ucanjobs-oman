drop policy if exists "Admins can manage course lessons"
on public.course_lessons;

create policy "Admins can manage course lessons"
on public.course_lessons
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);
