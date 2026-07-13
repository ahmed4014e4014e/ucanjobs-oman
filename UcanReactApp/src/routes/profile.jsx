import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath, getUserRole } from "../lib/authRouting";

const profileSections = [
  "Profile",
  "Photo",
  "Account Security",
  "Subscriptions",
  "Payment methods",
  "Privacy",
  "Notification Preferences",
  "API clients",
  "Close account",
];

function getProfilePhotoUrl(profile, user) {
  return (
    profile?.avatar_url ||
    profile?.profile_photo_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    ""
  );
}

function getProfileInitials(name, email) {
  const displayName = name || email || "U";
  const parts = displayName.split(/[\s@._-]+/).filter(Boolean);

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
}

function formatRole(role) {
  if (role === "learner" || role === "student") return "Job Seeker";
  if (role === "instructor" || role === "tutor") return "Instructor";
  if (role === "admin") return "Admin";

  return "Member";
}

export default function Profile() {
  const { user, profile } = useAuth();
  const role = getUserRole(profile, user);
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "Ucan Member";
  const photoUrl = getProfilePhotoUrl(profile, user);
  const initials = getProfileInitials(displayName, user?.email);

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[1.75rem] oman-card lg:grid-cols-[18rem_1fr]">
          <aside className="border-b border-[rgba(111,49,29,0.12)] bg-white lg:border-b-0 lg:border-r">
            <div className="px-5 pb-5 pt-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(111,49,29,0.12)] bg-[rgba(244,232,214,0.62)] text-3xl font-bold text-[var(--oman-terracotta-dark)] shadow-sm">
                {photoUrl ? (
                  <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <h1 className="mx-auto mt-5 max-w-56 text-xl font-bold leading-snug text-[var(--oman-ink)]">
                {displayName}
              </h1>
              <Link
                to={role ? getDashboardPath(role) : "/home/"}
                className="mt-8 inline-flex text-base font-medium text-[var(--oman-ink)] transition hover:text-[var(--oman-terracotta)]"
              >
                View public profile
              </Link>
            </div>

            <nav aria-label="Profile settings" className="pb-5">
              {profileSections.map((section) => (
                <button
                  key={section}
                  type="button"
                  className={[
                    "block w-full px-5 py-3 text-left text-base transition",
                    section === "Profile"
                      ? "bg-[#9699b4] font-semibold text-white"
                      : "text-[var(--oman-ink)] hover:bg-[rgba(244,232,214,0.48)]",
                  ].join(" ")}
                >
                  {section}
                </button>
              ))}
            </nav>
          </aside>

          <section className="p-6 sm:p-8">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Account Profile
            </p>
            <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
              Profile details
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-[var(--oman-ink)]/75">
              This page gives each Ucan member a dedicated profile area. The profile photo shortcut
              in the website header opens this page.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl oman-outline-panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                  Full name
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">{displayName}</p>
              </div>
              <div className="rounded-3xl oman-outline-panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                  Email
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
                  {user?.email || profile?.email || "Not set"}
                </p>
              </div>
              <div className="rounded-3xl oman-outline-panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                  Role
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
                  {formatRole(role)}
                </p>
              </div>
              <div className="rounded-3xl oman-outline-panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                  Institute
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
                  {profile?.institute || user?.user_metadata?.institute || "Not set"}
                </p>
              </div>
              <div className="rounded-3xl oman-outline-panel p-5 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                  Target job role
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
                  {profile?.target_job_role || user?.user_metadata?.target_job_role || "Not set"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
