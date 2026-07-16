-- Profile / account settings foundation for UcanJobs (/profile)
-- Extends profiles, adds preferences, API clients, deletion requests, avatars bucket.

create extension if not exists pgcrypto;

-- 1) Extend profiles
alter table public.profiles
  add column if not exists target_job_role text,
  add column if not exists avatar_url text,
  add column if not exists headline text,
  add column if not exists bio text,
  add column if not exists phone text,
  add column if not exists website_url text,
  add column if not exists deletion_requested_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

-- 2) Preferences (privacy + notifications + payment contact defaults)
create table if not exists public.profile_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  show_public_profile boolean not null default false,
  show_email_on_profile boolean not null default false,
  show_institute_on_profile boolean not null default true,
  email_course_updates boolean not null default true,
  email_payment_updates boolean not null default true,
  email_marketing boolean not null default false,
  email_product_announcements boolean not null default true,
  preferred_language text not null default 'en'
    check (preferred_language in ('en', 'ar')),
  preferred_payer_name text,
  preferred_payer_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_profile_preferences_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_preferences_set_updated_at on public.profile_preferences;
create trigger profile_preferences_set_updated_at
before update on public.profile_preferences
for each row
execute function public.set_profile_preferences_updated_at();

alter table public.profile_preferences enable row level security;

drop policy if exists "Users read own profile preferences" on public.profile_preferences;
create policy "Users read own profile preferences"
on public.profile_preferences
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own profile preferences" on public.profile_preferences;
create policy "Users insert own profile preferences"
on public.profile_preferences
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own profile preferences" on public.profile_preferences;
create policy "Users update own profile preferences"
on public.profile_preferences
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 3) API clients (store hash only; plaintext returned once from RPC)
create table if not exists public.profile_api_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists profile_api_clients_user_created_idx
  on public.profile_api_clients (user_id, created_at desc);

alter table public.profile_api_clients enable row level security;

drop policy if exists "Users read own api clients" on public.profile_api_clients;
create policy "Users read own api clients"
on public.profile_api_clients
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users revoke own api clients" on public.profile_api_clients;
create policy "Users revoke own api clients"
on public.profile_api_clients
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.create_profile_api_client(p_name text)
returns table (
  id uuid,
  name text,
  key_prefix text,
  api_key text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_raw text;
  v_prefix text;
  v_hash text;
  v_id uuid;
  v_created timestamptz;
  v_name text := trim(coalesce(p_name, ''));
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if length(v_name) < 2 then
    raise exception 'Client name must be at least 2 characters';
  end if;

  if length(v_name) > 80 then
    raise exception 'Client name must be 80 characters or fewer';
  end if;

  v_raw := 'ucan_' || encode(gen_random_bytes(24), 'hex');
  v_prefix := left(v_raw, 12);
  v_hash := encode(digest(v_raw, 'sha256'), 'hex');

  insert into public.profile_api_clients (user_id, name, key_prefix, key_hash)
  values (v_user_id, v_name, v_prefix, v_hash)
  returning profile_api_clients.id, profile_api_clients.created_at
  into v_id, v_created;

  return query
  select v_id, v_name, v_prefix, v_raw, v_created;
end;
$$;

revoke all on function public.create_profile_api_client(text) from public;
grant execute on function public.create_profile_api_client(text) to authenticated;

-- 4) Account deletion requests
create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  status text not null default 'pending'
    check (status in ('pending', 'cancelled', 'completed')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists account_deletion_requests_user_idx
  on public.account_deletion_requests (user_id, requested_at desc);

alter table public.account_deletion_requests enable row level security;

drop policy if exists "Users read own deletion requests" on public.account_deletion_requests;
create policy "Users read own deletion requests"
on public.account_deletion_requests
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users create own deletion requests" on public.account_deletion_requests;
create policy "Users create own deletion requests"
on public.account_deletion_requests
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users cancel own pending deletion requests" on public.account_deletion_requests;
create policy "Users cancel own pending deletion requests"
on public.account_deletion_requests
for update to authenticated
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id);

-- 5) Avatars storage bucket (public read for nav avatars)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar public read" on storage.objects;
create policy "Avatar public read"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar"
on storage.objects
for update to authenticated
using (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);
