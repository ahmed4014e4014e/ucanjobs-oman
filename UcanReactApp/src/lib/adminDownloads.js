import { supabase } from "./supabase";

export async function downloadStorageAttachment({ bucket, path, fileName }) {
  if (!supabase || !bucket || !path) {
    throw new Error("Attachment download is not available right now.");
  }

  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) {
    throw error;
  }

  const objectUrl = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName || path.split("/").pop() || "attachment";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}
