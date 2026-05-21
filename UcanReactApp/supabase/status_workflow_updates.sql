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

update public.contact_messages
set status = 'pending'
where status is null
   or status = 'new';

alter table public.contact_messages
  alter column status set default 'pending';

alter table public.contact_messages
  drop constraint if exists contact_messages_status_check;

alter table public.contact_messages
  add constraint contact_messages_status_check
  check (status in ('pending', 'reviewed', 'scheduled', 'completed', 'cancelled'));

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
on public.contact_messages
for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can update tutoring requests" on public.tutoring_requests;
create policy "Admins can update tutoring requests"
on public.tutoring_requests
for update
using (public.is_admin_user())
with check (public.is_admin_user());
