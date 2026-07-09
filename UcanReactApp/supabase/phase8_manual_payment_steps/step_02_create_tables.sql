-- Phase 8 manual payments - Step 02
-- Creates manual-payment tables. No payment gateway integration is added.

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
