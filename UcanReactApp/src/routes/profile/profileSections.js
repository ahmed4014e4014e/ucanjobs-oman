export const PROFILE_SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    title: "Profile details",
    description: "Update the name and details shown on your UcanJobs account.",
  },
  {
    id: "photo",
    label: "Photo",
    title: "Profile photo",
    description: "Add a clear photo so instructors and admins can recognize you.",
  },
  {
    id: "security",
    label: "Account Security",
    title: "Account security",
    description: "Change your password or email. Confirmation may be required for email changes.",
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    title: "Course access",
    description: "Your enrolled courses and access status.",
  },
  {
    id: "payment-methods",
    label: "Payment methods",
    title: "Payment methods",
    description: "Bank transfer details for Oman payments and your preferred payer contact info.",
  },
  {
    id: "privacy",
    label: "Privacy",
    title: "Privacy",
    description: "Control what others can see when a public profile is enabled.",
  },
  {
    id: "notifications",
    label: "Notification Preferences",
    title: "Notification preferences",
    description: "Choose which email updates you want from UcanJobs.",
  },
  {
    id: "api-clients",
    label: "API clients",
    title: "API clients",
    description: "Create personal API keys for integrations. Secrets are shown only once.",
  },
  {
    id: "close-account",
    label: "Close account",
    title: "Close account",
    description: "Request permanent closure of your UcanJobs account.",
  },
];

export const DEFAULT_SECTION_ID = "profile";

export function getSectionById(sectionId) {
  return PROFILE_SECTIONS.find((section) => section.id === sectionId) || PROFILE_SECTIONS[0];
}

export function isValidSectionId(sectionId) {
  return PROFILE_SECTIONS.some((section) => section.id === sectionId);
}
