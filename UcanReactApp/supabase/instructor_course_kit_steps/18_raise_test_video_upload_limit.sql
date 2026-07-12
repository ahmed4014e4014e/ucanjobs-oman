update storage.buckets
set file_size_limit = 524288000
where id = 'course-content';

select
  id,
  name,
  public,
  file_size_limit
from storage.buckets
where id = 'course-content';
