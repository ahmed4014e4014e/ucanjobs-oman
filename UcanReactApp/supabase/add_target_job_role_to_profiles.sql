-- Add target job role to job seeker profiles.
-- Run this once in Supabase SQL Editor before testing the updated dashboard form.

alter table public.profiles
  add column if not exists target_job_role text;
