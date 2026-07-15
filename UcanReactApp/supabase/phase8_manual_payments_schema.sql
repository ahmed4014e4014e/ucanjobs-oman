-- Phase 8: Manual payment foundation for UcanJobs
-- Run this only after the course catalog and learner enrollments are working.
--
-- This creates the tables needed for a manual payment workflow:
-- 1) orders   - one learner purchase intent for a course/enrollment
-- 2) payments - manual bank/local payment confirmation records
--
-- No Stripe, card gateway, webhook, or automatic payment integration is added here.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.learning_courses(id) on delete restrict,
  enrollment_id uuid references public.course_enrollments(id) on delete set null,
  order_number text not null unique default ('UCAN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'payment_submitted', 'paid', 'cancelled', 'refunded')),
  currency text not null default 'OMR',
  subtotal_omr numeric(10, 3) not null default 0,
  discount_omr numeric(10, 3) not null default 0,
  total_omr numeric(10, 3) not null default 0,
  payment_method text not null default 'manual'
    check (payment_method in ('manual', 'bank_transfer', 'local_payment', 'stripe', 'other')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  cancelled_at timestamptz,
  unique (learner_id, course_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  amount_omr numeric(10, 3) not null default 0,
  currency text not null default 'OMR',
  method text not null default 'manual'
    check (method in ('manual', 'bank_transfer', 'local_payment', 'stripe', 'other')),
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'confirmed', 'rejected', 'refunded')),
  reference_number text,
  payer_name text,
  payer_email text,
  proof_url text,
  submitted_at timestamptz not null default now(),
  confirmed_at timestamptz,
  rejected_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_learner_created_idx
  on public.orders (learner_id, created_at desc);

create index if not exists orders_course_status_idx
  on public.orders (course_id, status);

create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

create index if not exists payments_order_submitted_idx
  on public.payments (order_id, submitted_at desc);

create index if not exists payments_learner_submitted_idx
  on public.payments (learner_id, submitted_at desc);

create index if not exists payments_status_submitted_idx
  on public.payments (status, submitted_at desc);

drop trigger if exists set_orders_updated_at
on public.orders;

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_payments_updated_at
on public.payments;

create trigger set_payments_updated_at
before update on public.payments
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.orders enable row level security;
alter table public.payments enable row level security;

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

commit;

select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('orders', 'payments')
order by tablename, policyname;
