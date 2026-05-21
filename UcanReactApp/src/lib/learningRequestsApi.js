import { isSupabaseConfigured, supabase } from "./supabase";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export async function fetchInstructorDirectory() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("instructor_course_offerings")
    .select(
      `
        id,
        session_type,
        is_active,
        instructor:instructor_profiles (
          id,
          display_name,
          institute_code,
          bio,
          is_active
        ),
        course:courses (
          id,
          code,
          title,
          institute:institutes (
            id,
            code,
            name
          )
        )
      `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? [])
    .filter((entry) => entry.instructor?.is_active)
    .filter((entry) => entry.instructor?.display_name)
    .filter((entry) => entry.course?.institute?.code);
}

export function buildInstructorCards(offerings, sessionType) {
  const grouped = new Map();

  offerings
    .filter((entry) => entry.session_type === sessionType)
    .forEach((entry) => {
      const instructorId = entry.instructor.id;
      const key = `${instructorId}:${sessionType}`;
      const instructorName = entry.instructor.display_name;
      const instituteCode = entry.course.institute.code;
      const courseLabel = `${instituteCode} ${entry.course.code}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          instructorId,
          name: instructorName,
          institute: entry.instructor.institute_code || instituteCode,
          institutes: new Set(),
          courses: [],
          courseIds: [],
          bio:
            entry.instructor.bio ||
            `Offers free ${sessionType === "private" ? "one-on-one" : "group"} tutoring sessions.`,
          availability:
            sessionType === "private"
              ? "Available for private tutoring"
              : "Available for group tutoring",
          sessionType,
        });
      }

      const instructorCard = grouped.get(key);
      instructorCard.institutes.add(instituteCode);
      instructorCard.courses.push({
        id: entry.course.id,
        label: courseLabel,
        title: entry.course.title,
      });
      instructorCard.courseIds.push(entry.course.id);
    });

  return Array.from(grouped.values())
    .map((card) => ({
      ...card,
      institutes: Array.from(card.institutes).sort(),
      courses: card.courses.sort((left, right) => left.label.localeCompare(right.label)),
      courseIds: Array.from(new Set(card.courseIds)),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function createLearningRequest(payload) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("learning_requests")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadLearningAttachments({ files, userId, instructorId, sessionType }) {
  ensureSupabase();

  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePath = `${userId}/${instructorId}/${sessionType}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from("learning-attachments")
      .upload(uniquePath, file, { upsert: false });

    if (error) {
      throw error;
    }

    uploads.push({
      name: file.name,
      path: uniquePath,
      size: file.size,
      type: file.type || "application/octet-stream",
    });
  }

  return uploads;
}

export async function fetchAdminLearningRequests() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("learning_requests")
    .select(
      `
        id,
        session_type,
        institute_name_snapshot,
        topics_needed_help_with,
        attachment_notes,
        attachment_files,
        status,
        created_at,
        learner:profiles!learning_requests_learner_id_fkey (
          id,
          full_name,
          email,
          institute
        ),
        instructor:instructor_profiles!learning_requests_instructor_id_fkey (
          id,
          display_name,
          institute_code
        ),
        course:courses!learning_requests_course_id_fkey (
          id,
          code,
          title
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchInstructorLearningRequests(instructorId) {
  ensureSupabase();

  if (!instructorId) {
    return [];
  }

  const { data, error } = await supabase
    .from("learning_requests")
    .select(
      `
        id,
        session_type,
        institute_name_snapshot,
        topics_needed_help_with,
        attachment_notes,
        attachment_files,
        status,
        created_at,
        learner:profiles!learning_requests_learner_id_fkey (
          id,
          full_name,
          email,
          institute
        ),
        course:courses!learning_requests_course_id_fkey (
          id,
          code,
          title
        )
      `
    )
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateLearningRequestStatus(requestId, status) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("learning_requests")
    .update({ status })
    .eq("id", requestId)
    .select(
      `
        id,
        session_type,
        institute_name_snapshot,
        topics_needed_help_with,
        attachment_notes,
        attachment_files,
        status,
        created_at
      `
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}
