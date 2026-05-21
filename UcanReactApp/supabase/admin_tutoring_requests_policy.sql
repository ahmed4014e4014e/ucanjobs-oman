create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

revoke all on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to authenticated;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
using (public.is_admin_user());

drop policy if exists "Admins can read tutoring requests" on public.tutoring_requests;
create policy "Admins can read tutoring requests"
on public.tutoring_requests
for select
using (public.is_admin_user());

drop policy if exists "Admins can update tutoring requests" on public.tutoring_requests;
create policy "Admins can update tutoring requests"
on public.tutoring_requests
for update
using (public.is_admin_user())
with check (public.is_admin_user());
