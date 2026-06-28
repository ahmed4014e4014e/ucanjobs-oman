import { isSupabaseConfigured, supabase } from "./supabase";

const INSTRUCTOR_APPLICANT_BUCKET = "instructor-applicant-attachments";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export async function createInstructorApplicant(payload) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("instructor_applicants")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchInstructorApplicants() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("instructor_applicants")
    .select("*")
    .order("submitted_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateInstructorApplicantStatus(applicantId, status) {
  ensureSupabase();

  const nextValues = {
    status,
    reviewed_at:
      status === "pending"
        ? null
        : new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("instructor_applicants")
    .update(nextValues)
    .eq("id", applicantId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadInstructorApplicantAttachments(files) {
  ensureSupabase();

  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePath = `instructor-applicants/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from(INSTRUCTOR_APPLICANT_BUCKET)
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

export { INSTRUCTOR_APPLICANT_BUCKET };
