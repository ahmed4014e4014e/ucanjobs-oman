-- Phase 8 manual payments - Step 05
-- RLS policies for orders.

alter table public.orders enable row level security;

drop policy if exists "Learners can create own manual orders"
on public.orders;

create policy "Learners can create own manual orders"
on public.orders
for insert
to authenticated
with check (
  auth.uid() = learner_id
  and payment_method in ('manual', 'bank_transfer', 'local_payment')
);

drop policy if exists "Learners can read own orders"
on public.orders;

create policy "Learners can read own orders"
on public.orders
for select
to authenticated
using (auth.uid() = learner_id);

drop policy if exists "Admins can manage orders"
on public.orders;

create policy "Admins can manage orders"
on public.orders
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());
