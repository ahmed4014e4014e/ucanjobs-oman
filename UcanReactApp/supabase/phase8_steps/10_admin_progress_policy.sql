drop policy if exists "Admins can manage lesson progress"
on public.lesson_progress;

create policy "Admins can manage lesson progress"
on public.lesson_progress
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
