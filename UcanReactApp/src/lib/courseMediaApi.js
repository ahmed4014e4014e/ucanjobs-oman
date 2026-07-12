import { isSupabaseConfigured, supabase } from "./supabase";

const BUCKET = "course-content";
const STORAGE_PREFIX = `storage://${BUCKET}/`;

function requireDatabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isStoredCourseMedia(value) {
  return typeof value === "string" && value.startsWith(STORAGE_PREFIX);
}

export function getStoredCourseMediaName(value) {
  if (!isStoredCourseMedia(value)) return "";
  const parts = value.slice(STORAGE_PREFIX.length).split("/");
  return parts.at(-1)?.replace(/^[a-f0-9-]+-/, "") || "Uploaded file";
}

export async function uploadCourseMedia({
  file,
  instructorId,
  courseId,
  mediaType,
}) {
  requireDatabase();

  if (!file || !instructorId || !courseId) {
    throw new Error("A file, instructor, and course are required.");
  }

  const maximumBytes = mediaType === "video" ? 500 * 1024 * 1024 : 20 * 1024 * 1024;
  if (file.size > maximumBytes) {
    throw new Error(
      mediaType === "video"
        ? "Video files must be 500 MB or smaller."
        : "Attachment files must be 20 MB or smaller."
    );
  }

  if (mediaType === "video" && !file.type.startsWith("video/")) {
    throw new Error("Please select a video file.");
  }

  const safeName = sanitizeFileName(file.name) || "course-file";
  const path = `${instructorId}/${courseId}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw error;
  }

  return `${STORAGE_PREFIX}${path}`;
}

export async function resolveCourseMediaUrl(value, expiresIn = 3600) {
  requireDatabase();

  if (!isStoredCourseMedia(value)) {
    return value || "";
  }

  const path = value.slice(STORAGE_PREFIX.length);
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);

  if (error) {
    throw error;
  }

  return data?.signedUrl || "";
}
