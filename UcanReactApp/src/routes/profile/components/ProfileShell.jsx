import ProfileSidebar from "./ProfileSidebar";

export default function ProfileShell({
  displayName,
  email,
  photoUrl,
  dashboardPath,
  activeSectionId,
  onSelectSection,
  children,
}) {
  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[1.75rem] oman-card lg:grid-cols-[18rem_1fr]">
          <ProfileSidebar
            displayName={displayName}
            email={email}
            photoUrl={photoUrl}
            dashboardPath={dashboardPath}
            activeSectionId={activeSectionId}
            onSelectSection={onSelectSection}
          />
          <section className="p-6 sm:p-8">{children}</section>
        </div>
      </section>
    </main>
  );
}
