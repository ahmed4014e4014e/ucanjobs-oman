-- Phase 8 manual payments - Step 07
-- Verification query.

select
  table_schema,
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('orders', 'payments')
order by table_name;

select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('orders', 'payments')
order by tablename, policyname;
