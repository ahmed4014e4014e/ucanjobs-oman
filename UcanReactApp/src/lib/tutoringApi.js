import { isSupabaseConfigured, supabase } from "./supabase";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured yet.");
  }
}

export async function fetchTutorDirectory() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("tutor_course_offerings")
    .select(
      `
        id,
        session_type,
        is_active,
        tutor:tutor_profiles (
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
    .filter((entry) => entry.tutor?.is_active)
    .filter((entry) => entry.tutor?.display_name)
    .filter((entry) => entry.course?.institute?.code);
}

export function buildTutorCards(offerings, sessionType) {
  const grouped = new Map();

  offerings
    .filter((entry) => entry.session_type === sessionType)
    .forEach((entry) => {
      const tutorId = entry.tutor.id;
      const key = `${tutorId}:${sessionType}`;
      const tutorName = entry.tutor.display_name;
      const instituteCode = entry.course.institute.code;
      const courseLabel = `${instituteCode} ${entry.course.code}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          tutorId,
          name: tutorName,
          institute: entry.tutor.institute_code || instituteCode,
          institutes: new Set(),
          courses: [],
          courseIds: [],
          bio:
            entry.tutor.bio ||
            `Offers free ${sessionType === "private" ? "one-on-one" : "group"} tutoring sessions.`,
          availability:
            sessionType === "private"
              ? "Available for private tutoring"
              : "Available for group tutoring",
          sessionType,
        });
      }

      const tutorCard = grouped.get(key);
      tutorCard.institutes.add(instituteCode);
      tutorCard.courses.push({
        id: entry.course.id,
        label: courseLabel,
        title: entry.course.title,
      });
      tutorCard.courseIds.push(entry.course.id);
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

export async function createTutoringRequest(payload) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("tutoring_requests")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadTutoringAttachments({ files, userId, tutorId, sessionType }) {
  ensureSupabase();

  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePath = `${userId}/${tutorId}/${sessionType}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from("tutoring-attachments")
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

export async function fetchAdminTutoringRequests() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("tutoring_requests")
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
        student:profiles!tutoring_requests_student_id_fkey (
          id,
          full_name,
          email,
          institute
        ),
        tutor:tutor_profiles!tutoring_requests_tutor_id_fkey (
          id,
          display_name,
          institute_code
        ),
        course:courses!tutoring_requests_course_id_fkey (
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

export async function fetchTutorTutoringRequests(tutorId) {
  ensureSupabase();

  if (!tutorId) {
    return [];
  }

  const { data, error } = await supabase
    .from("tutoring_requests")
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
        student:profiles!tutoring_requests_student_id_fkey (
          id,
          full_name,
          email,
          institute
        ),
        course:courses!tutoring_requests_course_id_fkey (
          id,
          code,
          title
        )
      `
    )
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateTutoringRequestStatus(requestId, status) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("tutoring_requests")
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
