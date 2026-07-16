import { isSupabaseConfigured, supabase } from "./supabase.js";

export const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function requireDatabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Database is not configured yet.");
  }
}

function sanitizeFileName(name) {
  return String(name || "avatar")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const defaultPreferences = {
  show_public_profile: false,
  show_email_on_profile: false,
  show_institute_on_profile: true,
  email_course_updates: true,
  email_payment_updates: true,
  email_marketing: false,
  email_product_announcements: true,
  preferred_language: "en",
  preferred_payer_name: "",
  preferred_payer_phone: "",
};

/**
 * Update core profile fields and mirror selected values into auth user metadata.
 */
export async function updateProfileBasics({
  userId,
  email,
  role,
  fullName,
  institute,
  targetJobRole,
  headline,
  bio,
  phone,
  websiteUrl,
}) {
  requireDatabase();

  if (!userId) {
    throw new Error("You must be signed in to update your profile.");
  }

  const payload = {
    id: userId,
    full_name: fullName?.trim() || null,
    institute: institute?.trim() || null,
    target_job_role: targetJobRole?.trim() || null,
    headline: headline?.trim() || null,
    bio: bio?.trim() || null,
    phone: phone?.trim() || null,
    website_url: websiteUrl?.trim() || null,
    email: email || null,
  };

  if (role) {
    payload.role = role;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      full_name: payload.full_name,
      institute: payload.institute,
      target_job_role: payload.target_job_role,
      headline: payload.headline,
      phone: payload.phone,
    },
  });

  if (metadataError) {
    throw metadataError;
  }

  return data;
}

export async function uploadAvatar({ userId, file }) {
  requireDatabase();

  if (!userId || !file) {
    throw new Error("A signed-in user and image file are required.");
  }

  if (!AVATAR_MIME.has(file.type)) {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Avatar images must be 5 MB or smaller.");
  }

  const extension = sanitizeFileName(file.name).split(".").pop() || "jpg";
  const path = `${userId}/avatar.${extension === file.name ? "jpg" : extension}`;

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const avatarUrl = `${publicData.publicUrl}?v=${Date.now()}`;

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  return data;
}

export async function removeAvatar({ userId, currentUrl }) {
  requireDatabase();

  if (!userId) {
    throw new Error("You must be signed in to remove your photo.");
  }

  if (currentUrl && currentUrl.includes(`/${AVATAR_BUCKET}/`)) {
    try {
      const marker = `/${AVATAR_BUCKET}/`;
      const pathWithQuery = currentUrl.split(marker)[1] || "";
      const path = pathWithQuery.split("?")[0];
      if (path) {
        await supabase.storage.from(AVATAR_BUCKET).remove([path]);
      }
    } catch (_error) {
      // Continue clearing the profile field even if storage delete fails.
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await supabase.auth.updateUser({
    data: { avatar_url: null },
  });

  return data;
}

export async function updatePassword(newPassword) {
  requireDatabase();

  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw error;
  }
}

export async function updateEmail(newEmail) {
  requireDatabase();

  const email = String(newEmail || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }

  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    throw error;
  }

  return email;
}

export async function fetchProfilePreferences(userId) {
  requireDatabase();

  if (!userId) {
    return { ...defaultPreferences };
  }

  const { data, error } = await supabase
    .from("profile_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return { ...defaultPreferences, user_id: userId };
  }

  return {
    ...defaultPreferences,
    ...data,
    preferred_payer_name: data.preferred_payer_name || "",
    preferred_payer_phone: data.preferred_payer_phone || "",
  };
}

export async function upsertProfilePreferences(userId, values) {
  requireDatabase();

  if (!userId) {
    throw new Error("You must be signed in to save preferences.");
  }

  const payload = {
    user_id: userId,
    show_public_profile: Boolean(values.show_public_profile),
    show_email_on_profile: Boolean(values.show_email_on_profile),
    show_institute_on_profile: Boolean(values.show_institute_on_profile),
    email_course_updates: Boolean(values.email_course_updates),
    email_payment_updates: Boolean(values.email_payment_updates),
    email_marketing: Boolean(values.email_marketing),
    email_product_announcements: Boolean(values.email_product_announcements),
    preferred_language: values.preferred_language === "ar" ? "ar" : "en",
    preferred_payer_name: values.preferred_payer_name?.trim() || null,
    preferred_payer_phone: values.preferred_payer_phone?.trim() || null,
  };

  const { data, error } = await supabase
    .from("profile_preferences")
    .upsert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listApiClients(userId) {
  requireDatabase();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("profile_api_clients")
    .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createApiClient(name) {
  requireDatabase();

  const { data, error } = await supabase.rpc("create_profile_api_client", {
    p_name: name,
  });

  if (error) {
    throw error;
  }

  // RPC returns setof rows — client may receive array or single object
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    throw new Error("API client was not created.");
  }

  return row;
}

export async function revokeApiClient(clientId) {
  requireDatabase();

  const { data, error } = await supabase
    .from("profile_api_clients")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", clientId)
    .is("revoked_at", null)
    .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function requestAccountDeletion({ userId, reason }) {
  requireDatabase();

  if (!userId) {
    throw new Error("You must be signed in to close your account.");
  }

  const { data: request, error } = await supabase
    .from("account_deletion_requests")
    .insert({
      user_id: userId,
      reason: reason?.trim() || null,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await supabase
    .from("profiles")
    .update({ deletion_requested_at: new Date().toISOString() })
    .eq("id", userId);

  return request;
}
