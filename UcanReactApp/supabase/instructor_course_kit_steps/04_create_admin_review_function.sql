create or replace function public.review_instructor_course_proposal(
  p_proposal_id uuid,
  p_status text,
  p_admin_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  proposal_record public.instructor_course_proposals%rowtype;
  course_id uuid;
  category_id_value uuid;
  generated_slug text;
begin
  if not (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
    or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
    or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  ) then
    raise exception 'Only administrators can review course proposals.';
  end if;

  if p_status not in ('approved', 'changes_requested', 'rejected') then
    raise exception 'Unsupported proposal review status.';
  end if;

  select *
  into proposal_record
  from public.instructor_course_proposals
  where id = p_proposal_id
  for update;

  if not found then
    raise exception 'Course proposal was not found.';
  end if;

  course_id := proposal_record.approved_course_id;

  if p_status = 'approved' and course_id is null then
    select id
    into category_id_value
    from public.course_categories
    where lower(name_en) = lower(proposal_record.course_category)
    order by is_active desc, sort_order asc
    limit 1;

    generated_slug :=
      trim(both '-' from regexp_replace(lower(proposal_record.course_title), '[^a-z0-9]+', '-', 'g'))
      || '-' || left(proposal_record.id::text, 8);

    insert into public.learning_courses (
      category_id,
      slug,
      title_en,
      subtitle_en,
      summary_en,
      level,
      duration,
      language,
      price_omr,
      is_published,
      publication_status,
      instructor_id,
      proposal_id
    )
    values (
      category_id_value,
      generated_slug,
      proposal_record.course_title,
      proposal_record.career_outcome,
      proposal_record.course_summary,
      proposal_record.target_level,
      coalesce(nullif(proposal_record.suggested_duration, ''), 'Self-paced'),
      'English',
      least(15, greatest(8, coalesce(proposal_record.suggested_price_omr, 8))),
      false,
      'draft',
      proposal_record.instructor_id,
      proposal_record.id
    )
    returning id into course_id;
  end if;

  update public.instructor_course_proposals
  set
    status = p_status,
    admin_notes = nullif(trim(p_admin_notes), ''),
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    approved_course_id = case when p_status = 'approved' then course_id else approved_course_id end
  where id = p_proposal_id;

  return course_id;
end;
$$;

revoke all on function public.review_instructor_course_proposal(uuid, text, text) from public;
grant execute on function public.review_instructor_course_proposal(uuid, text, text) to authenticated;
