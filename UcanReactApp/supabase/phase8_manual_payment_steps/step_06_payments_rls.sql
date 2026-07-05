-- Phase 8 manual payments - Step 06
-- RLS policies for manual payment submissions.

alter table public.payments enable row level security;

drop policy if exists "Learners can submit own manual payments"
on public.payments;

create policy "Learners can submit own manual payments"
on public.payments
for insert
to authenticated
with check (
  auth.uid() = learner_id
  and method in ('manual', 'bank_transfer', 'local_payment')
  and exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
      and orders.learner_id = auth.uid()
  )
);

drop policy if exists "Learners can read own payments"
on public.payments;

create policy "Learners can read own payments"
on public.payments
for select
to authenticated
using (auth.uid() = learner_id);

drop policy if exists "Admins can manage payments"
on public.payments;

create policy "Admins can manage payments"
on public.payments
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());
