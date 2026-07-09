create unique index if not exists learning_courses_proposal_unique_idx
  on public.learning_courses (proposal_id)
  where proposal_id is not null;

create index if not exists learning_courses_instructor_status_idx
  on public.learning_courses (instructor_id, publication_status, updated_at desc);

create index if not exists instructor_course_proposals_review_idx
  on public.instructor_course_proposals (status, submitted_at desc);
