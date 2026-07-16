export function getProfilePhotoUrl(profile, user) {
  return (
    profile?.avatar_url ||
    profile?.profile_photo_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    ""
  );
}

export function getProfileInitials(name, email) {
  const displayName = name || email || "U";
  const parts = displayName.split(/[\s@._-]+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export function formatRoleLabel(role) {
  if (role === "learner" || role === "student") return "Job Seeker";
  if (role === "instructor" || role === "tutor") return "Instructor";
  if (role === "admin") return "Admin";
  return "Member";
}

export function getDisplayName(profile, user) {
  return (
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "UcanJobs Member"
  );
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatStatusLabel(value) {
  return String(value || "unknown").replaceAll("_", " ");
}
