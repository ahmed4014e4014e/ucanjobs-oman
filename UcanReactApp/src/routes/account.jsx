import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath, getUserRole } from "../lib/authRouting";

export default function Account() {
  const { user, profile, signOut, profileLoading, profileError, refreshProfile } = useAuth();
  const role = getUserRole(profile, user);

  if (profileLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-[var(--oman-ink)]">
            Loading your account profile...
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Your session is active. We are still checking your role so we can send you to the right dashboard.
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
            Your account profile is still loading
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            {profileError ||
              "We could not determine your account role yet, so we cannot send you to the correct dashboard safely."}
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
              Log Out and Re-Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <Navigate to={getDashboardPath(role)} replace />;
}
