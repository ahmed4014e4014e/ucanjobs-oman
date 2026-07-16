import { Link } from "react-router-dom";
import { PROFILE_SECTIONS } from "../profileSections";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileSidebar({
  displayName,
  email,
  photoUrl,
  dashboardPath,
  activeSectionId,
  onSelectSection,
}) {
  return (
    <aside className="border-b border-[rgba(111,49,29,0.12)] bg-white lg:border-b-0 lg:border-r">
      <div className="px-5 pb-5 pt-8 text-center">
        <ProfileAvatar
          photoUrl={photoUrl}
          displayName={displayName}
          email={email}
        />
        <h1 className="mx-auto mt-5 max-w-56 text-xl font-bold leading-snug text-[var(--oman-ink)]">
          {displayName}
        </h1>
        <Link
          to={dashboardPath}
          className="mt-6 inline-flex text-base font-medium text-[var(--oman-ink)] transition hover:text-[var(--oman-terracotta)]"
        >
          Go to dashboard
        </Link>
      </div>

      {/* Mobile section picker */}
      <div className="border-t border-[rgba(111,49,29,0.08)] px-5 py-4 lg:hidden">
        <label className="block text-sm font-semibold text-[var(--oman-ink)]" htmlFor="profile-section-select">
          Settings section
        </label>
        <select
          id="profile-section-select"
          value={activeSectionId}
          onChange={(event) => onSelectSection(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.16)] bg-[rgba(255,252,247,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none focus:border-[var(--oman-brass)] focus:ring-2 focus:ring-[rgba(197,154,68,0.28)]"
        >
          {PROFILE_SECTIONS.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      <nav aria-label="Profile settings" className="hidden pb-5 lg:block">
        {PROFILE_SECTIONS.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "block w-full px-5 py-3 text-left text-base transition",
                isActive
                  ? "bg-[#9699b4] font-semibold text-white"
                  : "text-[var(--oman-ink)] hover:bg-[rgba(244,232,214,0.48)]",
              ].join(" ")}
            >
              {section.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
