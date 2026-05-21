import { isSupabaseConfigured, supabase } from "./supabase";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export async function createContactMessage(payload) {
  ensureSupabase();

  const { error } = await supabase.from("contact_messages").insert(payload);

  if (error) {
    throw error;
  }
}

export async function fetchContactMessages() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .not("subject", "ilike", "Tutor Application - %")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchTutorApplications() {
  ensureSupabase();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .ilike("subject", "Tutor Application - %")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateContactMessageStatus(messageId, status) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", messageId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadContactAttachments(files) {
  ensureSupabase();

  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePath = `public/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from("contact-attachments")
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
