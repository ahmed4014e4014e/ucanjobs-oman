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

drop policy if exists "Admins can read tutoring attachments" on storage.objects;
create policy "Admins can read tutoring attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'tutoring-attachments'
  and public.is_admin_user()
);

drop policy if exists "Admins can read contact attachments" on storage.objects;
create policy "Admins can read contact attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'contact-attachments'
  and public.is_admin_user()
);
