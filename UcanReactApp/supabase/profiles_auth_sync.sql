create or replace function public.handle_auth_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    role,
    institute,
    email
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    new.raw_user_meta_data ->> 'institute',
    new.email
  )
  on conflict (id) do update
  set
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    institute = coalesce(public.profiles.institute, excluded.institute),
    email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_profile_sync on auth.users;
create trigger on_auth_user_profile_sync
after insert or update on auth.users
for each row
execute function public.handle_auth_user_profile_sync();

insert into public.profiles (
  id,
  full_name,
  role,
  institute,
  email
)
select
  auth.users.id,
  auth.users.raw_user_meta_data ->> 'full_name',
  coalesce(auth.users.raw_user_meta_data ->> 'role', 'student'),
  auth.users.raw_user_meta_data ->> 'institute',
  auth.users.email
from auth.users
on conflict (id) do update
set
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  institute = coalesce(public.profiles.institute, excluded.institute),
  email = excluded.email;
