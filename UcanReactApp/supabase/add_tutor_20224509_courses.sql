insert into public.tutor_course_offerings (
  tutor_id,
  course_id,
  session_type,
  is_active
)
select
  tutor_profiles.id,
  courses.id,
  session_data.session_type,
  true
from public.tutor_profiles
join public.profiles
  on profiles.id = tutor_profiles.id
join (
  values
    ('MAT 255', 'private'),
    ('MAT 255', 'group'),
    ('COSC 1301', 'private'),
    ('COSC 1301', 'group')
) as session_data (course_code, session_type)
  on true
join public.courses
  on courses.code = session_data.course_code
where profiles.email = '20224509@mcbs.edu.om'
  and profiles.role = 'tutor'
on conflict (tutor_id, course_id, session_type) do update
set is_active = excluded.is_active;
