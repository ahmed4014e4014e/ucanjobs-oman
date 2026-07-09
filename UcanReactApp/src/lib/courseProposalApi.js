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

export async function fetchInstructorCourseProposals(instructorId) {
  ensureSupabase();

  if (!instructorId) {
    return [];
  }

  const { data, error } = await supabase
    .from("instructor_course_proposals")
    .select(
      "id, course_title, course_category, target_level, status, admin_notes, approved_course_id, submitted_at, reviewed_at"
    )
    .eq("instructor_id", instructorId)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchAdminCourseProposals() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("instructor_course_proposals")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function reviewInstructorCourseProposal({
  proposalId,
  status,
  adminNotes,
}) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("review_instructor_course_proposal", {
    p_proposal_id: proposalId,
    p_status: status,
    p_admin_notes: adminNotes || null,
  });

  if (error) {
    throw error;
  }

  return data;
}
