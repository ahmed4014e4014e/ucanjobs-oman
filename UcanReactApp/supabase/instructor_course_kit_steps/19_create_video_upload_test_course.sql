do $$
declare
  instructor_user_id uuid;
  proposal_record_id uuid;
  course_record_id uuid;
  category_record_id uuid;
begin
  select id
  into instructor_user_id
  from auth.users
  where lower(email) = lower('ahmed4014e@gmail.com')
  limit 1;

  if instructor_user_id is null then
    raise exception 'The requested instructor account was not found.';
  end if;

  select id
  into course_record_id
  from public.learning_courses
  where instructor_id = instructor_user_id
    and title_en = 'Video Upload Test Course'
  limit 1;

  if course_record_id is null then
    select id
    into category_record_id
    from public.course_categories
    where lower(name_en) = lower('Software Engineering')
    order by is_active desc, sort_order
    limit 1;

    proposal_record_id := gen_random_uuid();
    course_record_id := gen_random_uuid();

    insert into public.instructor_course_proposals (
      id,
      instructor_id,
      instructor_email,
      instructor_name,
      course_title,
      course_category,
      target_level,
      career_outcome,
      course_summary,
      learning_outcomes,
      module_outline,
      suggested_duration,
      suggested_price_omr,
      status,
      reviewed_at
    )
    values (
      proposal_record_id,
      instructor_user_id,
      'ahmed4014e@gmail.com',
      'Ahmed',
      'Video Upload Test Course',
      'Software Engineering',
      'Beginner',
      'Test instructor video uploads and learner playback',
      'A temporary unpublished course containing three test video lessons.',
      'Verify three uploaded videos can be saved and loaded.',
      'Lesson one, lesson two, and lesson three.',
      'Self-paced',
      0,
      'approved',
      now()
    );

    insert into public.learning_courses (
      id,
      category_id,
      proposal_id,
      instructor_id,
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
      sort_order
    )
    values (
      course_record_id,
      category_record_id,
      proposal_record_id,
      instructor_user_id,
      'video-upload-test-course',
      'Video Upload Test Course',
      'Three-video instructor upload test',
      'A temporary unpublished course containing three test video lessons.',
      'Beginner',
      'Self-paced',
      'English',
      0,
      false,
      'draft',
      999
    );

    update public.instructor_course_proposals
    set approved_course_id = course_record_id
    where id = proposal_record_id;
  end if;

  if not exists (
    select 1
    from public.course_lessons
    where course_id = course_record_id
  ) then
    insert into public.course_lessons (
      course_id,
      title_en,
      body_en,
      sort_order,
      is_preview,
      is_published
    )
    values
      (
        course_record_id,
        'Test Video Lesson One',
        'Testing the first uploaded instructor recording.',
        1,
        false,
        true
      ),
      (
        course_record_id,
        'Test Video Lesson Two',
        'Testing the second uploaded instructor recording.',
        2,
        false,
        true
      ),
      (
        course_record_id,
        'Test Video Lesson Three',
        'Testing the third uploaded instructor recording.',
        3,
        false,
        true
      );
  end if;
end;
$$;

select
  learning_courses.id as course_id,
  learning_courses.title_en,
  learning_courses.publication_status,
  count(course_lessons.id) as lesson_count
from public.learning_courses
join public.course_lessons
  on course_lessons.course_id = learning_courses.id
where learning_courses.title_en = 'Video Upload Test Course'
group by
  learning_courses.id,
  learning_courses.title_en,
  learning_courses.publication_status;
