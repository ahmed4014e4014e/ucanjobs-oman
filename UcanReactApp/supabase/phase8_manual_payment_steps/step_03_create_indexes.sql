-- Phase 8 manual payments - Step 03
-- Creates indexes for admin and learner payment/order views.

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
