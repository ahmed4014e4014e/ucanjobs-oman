-- Phase 9: payment proof uploads and access request status updates.
-- Run this in the Supabase SQL editor before testing paid-course access requests.

begin;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- Learners can upload payment proof files only under their own user-id folder.
drop policy if exists "Learners can upload own payment proofs" on storage.objects;
create policy "Learners can upload own payment proofs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Learners can read their own uploaded payment proof files.
drop policy if exists "Learners can read own payment proofs" on storage.objects;
create policy "Learners can read own payment proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can read payment proof files for review.
drop policy if exists "Admins can read payment proofs" on storage.objects;
create policy "Admins can read payment proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_admin_user()
);

-- Let a learner mark only their own pending/manual order as payment_submitted.
drop policy if exists "Learners can mark own order payment submitted" on public.orders;
create policy "Learners can mark own order payment submitted"
on public.orders
for update
to authenticated
using (
  auth.uid() = learner_id
  and status in ('pending_payment', 'payment_submitted')
)
with check (
  auth.uid() = learner_id
  and status = 'payment_submitted'
  and payment_method in ('manual', 'bank_transfer', 'local_payment')
);

commit;
