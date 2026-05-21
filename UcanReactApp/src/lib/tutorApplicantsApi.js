import { isSupabaseConfigured, supabase } from "./supabase";

const TUTOR_APPLICANT_BUCKET = "tutor-applicant-attachments";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export async function createTutorApplicant(payload) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("tutor_applicants")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchTutorApplicants() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("tutor_applicants")
    .select("*")
    .order("submitted_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateTutorApplicantStatus(applicantId, status) {
  ensureSupabase();

  const nextValues = {
    status,
    reviewed_at:
      status === "pending"
        ? null
        : new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("tutor_applicants")
    .update(nextValues)
    .eq("id", applicantId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadTutorApplicantAttachments(files) {
  ensureSupabase();

  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePath = `tutor-applicants/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from(TUTOR_APPLICANT_BUCKET)
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

export { TUTOR_APPLICANT_BUCKET };
