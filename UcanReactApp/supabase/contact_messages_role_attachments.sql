alter table public.contact_messages
add column if not exists role text check (role in ('student', 'tutor'));

alter table public.contact_messages
add column if not exists attachment_notes text;

alter table public.contact_messages
add column if not exists attachment_files jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('contact-attachments', 'contact-attachments', false)
on conflict (id) do nothing;

drop policy if exists "Anyone can upload contact attachments" on storage.objects;
create policy "Anyone can upload contact attachments"
on storage.objects
for insert
to public
with check (
  bucket_id = 'contact-attachments'
  and (storage.foldername(name))[1] = 'public'
);
