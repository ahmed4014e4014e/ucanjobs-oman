import { isSupabaseConfigured, supabase } from "./supabase";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export async function submitInstructorCourseProposal(payload) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("instructor_course_proposals")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
