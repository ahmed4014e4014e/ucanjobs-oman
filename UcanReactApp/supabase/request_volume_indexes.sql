create index if not exists tutoring_requests_status_idx
  on public.tutoring_requests (status);

create index if not exists tutoring_requests_created_at_idx
  on public.tutoring_requests (created_at desc);

create index if not exists tutoring_requests_tutor_status_created_at_idx
  on public.tutoring_requests (tutor_id, status, created_at desc);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_created_at_idx
  on public.contact_messages (status, created_at desc);
