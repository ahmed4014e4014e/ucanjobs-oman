export const CONTACT_STATUS_OPTIONS = ["pending", "reviewed", "scheduled", "completed"];

export const TUTOR_APPLICATION_STATUS_OPTIONS = [
  "pending",
  "reviewed",
  "approved",
  "rejected",
  "completed",
];

export const TUTORING_STATUS_OPTIONS = [
  "pending",
  "reviewed",
  "scheduled",
  "completed",
  "cancelled",
];

export function normalizeStatus(value, fallback = "pending") {
  if (!value) {
    return fallback;
  }

  if (value === "new") {
    return "pending";
  }

  return value;
}

export function formatStatusLabel(value) {
  return normalizeStatus(value)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isDashboardArchivedStatus(value) {
  return normalizeStatus(value) === "completed";
}
