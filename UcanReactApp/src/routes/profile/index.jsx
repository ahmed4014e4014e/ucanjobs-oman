import { Link } from "react-router-dom";
import { Button } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath, getUserRole } from "../../lib/authRouting";
import ProfileShell from "./components/ProfileShell";
import ApiClientsSection from "./components/sections/ApiClientsSection";
import CloseAccountSection from "./components/sections/CloseAccountSection";
import NotificationsSection from "./components/sections/NotificationsSection";
import PaymentMethodsSection from "./components/sections/PaymentMethodsSection";
import PhotoSection from "./components/sections/PhotoSection";
import PrivacySection from "./components/sections/PrivacySection";
import ProfileDetailsSection from "./components/sections/ProfileDetailsSection";
import SecuritySection from "./components/sections/SecuritySection";
import SubscriptionsSection from "./components/sections/SubscriptionsSection";
import { useProfileSection } from "./hooks/useProfileSection";
import { getDisplayName, getProfilePhotoUrl } from "./profileDisplay";

export default function Profile() {
  const {
    user,
    profile,
    profileLoading,
    profileError,
    refreshProfile,
    signOut,
  } = useAuth();
  const { activeSectionId, activeSection, setSection } = useProfileSection();

  const role = getUserRole(profile, user);
  const displayName = getDisplayName(profile, user);
  const photoUrl = getProfilePhotoUrl(profile, user);
  const dashboardPath = role ? getDashboardPath(role) : "/home/";

  if (profileLoading && !profile) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] oman-card p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-[var(--oman-ink)]">
            Loading your profile…
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Your session is active. We are loading account settings.
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (profileError && !profile) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] oman-card p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-[var(--oman-ink)]">
            Profile could not be loaded
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{profileError}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => refreshProfile()}>
              Retry
            </Button>
            <Button to="/home/" variant="secondary">
              Go home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  let sectionNode = null;

  switch (activeSectionId) {
    case "photo":
      sectionNode = (
        <PhotoSection
          user={user}
          profile={profile}
          refreshProfile={refreshProfile}
          displayName={displayName}
          meta={activeSection}
        />
      );
      break;
    case "security":
      sectionNode = (
        <SecuritySection
          user={user}
          refreshProfile={refreshProfile}
          meta={activeSection}
        />
      );
      break;
    case "subscriptions":
      sectionNode = <SubscriptionsSection user={user} meta={activeSection} />;
      break;
    case "payment-methods":
      sectionNode = <PaymentMethodsSection user={user} meta={activeSection} />;
      break;
    case "privacy":
      sectionNode = <PrivacySection user={user} meta={activeSection} />;
      break;
    case "notifications":
      sectionNode = <NotificationsSection user={user} meta={activeSection} />;
      break;
    case "api-clients":
      sectionNode = <ApiClientsSection user={user} meta={activeSection} />;
      break;
    case "close-account":
      sectionNode = (
        <CloseAccountSection user={user} signOut={signOut} meta={activeSection} />
      );
      break;
    case "profile":
    default:
      sectionNode = (
        <ProfileDetailsSection
          user={user}
          profile={profile}
          refreshProfile={refreshProfile}
          meta={activeSection}
        />
      );
      break;
  }

  return (
    <ProfileShell
      displayName={displayName}
      email={user?.email}
      photoUrl={photoUrl}
      dashboardPath={dashboardPath}
      activeSectionId={activeSectionId}
      onSelectSection={setSection}
    >
      {profileError ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {profileError}{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => refreshProfile()}
          >
            Retry
          </button>
        </div>
      ) : null}
      {sectionNode}
      <p className="mt-10 text-sm text-[var(--oman-ink)]/60">
        Need help?{" "}
        <Link to="/contact/" className="font-semibold text-[var(--oman-terracotta-dark)] hover:underline">
          Contact support
        </Link>
      </p>
    </ProfileShell>
  );
}
