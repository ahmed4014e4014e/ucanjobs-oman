drop trigger if exists set_course_lessons_updated_at
on public.course_lessons;

create trigger set_course_lessons_updated_at
before update on public.course_lessons
for each row
execute function public.set_current_timestamp_updated_at();
