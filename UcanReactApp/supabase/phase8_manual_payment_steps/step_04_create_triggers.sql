-- Phase 8 manual payments - Step 04
-- Keeps updated_at current on order/payment updates.

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
