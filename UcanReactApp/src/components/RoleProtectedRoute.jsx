import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath, getUserRole } from "../lib/authRouting";

export default function RoleProtectedRoute({ allowedRole, children }) {
  const {
    user,
    profile,
    loading,
    profileLoading,
    profileError,
    isSupabaseConfigured,
    signOut,
    refreshProfile,
  } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-amber-900">
          database is not configured yet. Add your environment variables before
          using protected pages.
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200">
          Checking your session...
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/learner-access/" replace />;
  }

  const role = getUserRole(profile, user);

  if (profileLoading && !role) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-[var(--oman-ink)]">
            Loading your account profile...
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Your session is active. We are still verifying your role so we can open the correct dashboard safely.
          </p>
        </div>
      </main>
    );
  }

  if (!role) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-[var(--oman-ink)]">
            We found your session, but your profile is not ready yet
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            {profileError ||
              "Your account session exists, but the platform could not load your role from the profile table. This can happen if the profile row did not sync correctly or is still missing."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => refreshProfile()}
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Retry Profile Load
            </button>
            <Link
              to="/home/"
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Go to Home
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="oman-button-primary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Log Out and Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (role !== allowedRole) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}
