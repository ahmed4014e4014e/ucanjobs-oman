drop policy if exists "Tutors can read student profiles for assigned requests" on public.profiles;
create policy "Tutors can read student profiles for assigned requests"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.tutoring_requests
    where tutoring_requests.student_id = profiles.id
      and tutoring_requests.tutor_id = auth.uid()
  )
);
