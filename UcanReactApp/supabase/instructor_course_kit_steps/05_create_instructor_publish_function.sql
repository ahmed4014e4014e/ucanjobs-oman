create or replace function public.instructor_confirm_course_publication(
  p_course_id uuid
)
returns public.learning_courses
language plpgsql
security definer
set search_path = public
as $$
declare
  published_course public.learning_courses%rowtype;
begin
  if not exists (
    select 1
    from public.learning_courses
    join public.instructor_course_proposals
      on instructor_course_proposals.id = learning_courses.proposal_id
    where learning_courses.id = p_course_id
      and learning_courses.instructor_id = auth.uid()
      and instructor_course_proposals.status = 'approved'
  ) then
    raise exception 'This approved instructor course was not found.';
  end if;

  if not exists (
    select 1
    from public.course_lessons
    where course_lessons.course_id = p_course_id
      and course_lessons.is_published = true
  ) then
    raise exception 'Add at least one published lesson before publishing the course.';
  end if;

  update public.learning_courses
  set
    is_published = true,
    publication_status = 'published',
    instructor_confirmed_at = now(),
    updated_at = now()
  where id = p_course_id
  returning * into published_course;

  return published_course;
end;
$$;

revoke all on function public.instructor_confirm_course_publication(uuid) from public;
grant execute on function public.instructor_confirm_course_publication(uuid) to authenticated;
