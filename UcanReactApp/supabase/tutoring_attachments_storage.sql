alter table public.tutoring_requests
add column if not exists attachment_files jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('tutoring-attachments', 'tutoring-attachments', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own tutoring attachments" on storage.objects;
create policy "Users can upload own tutoring attachments"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'tutoring-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can read own tutoring attachments" on storage.objects;
create policy "Users can read own tutoring attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'tutoring-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Tutors can read assigned tutoring attachments" on storage.objects;
create policy "Tutors can read assigned tutoring attachments"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'tutoring-attachments'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "Users can update own tutoring attachments" on storage.objects;
create policy "Users can update own tutoring attachments"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'tutoring-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'tutoring-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own tutoring attachments" on storage.objects;
create policy "Users can delete own tutoring attachments"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'tutoring-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);
