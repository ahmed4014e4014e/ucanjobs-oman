import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, isSupabaseConfigured } = useAuth();

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
    return <Navigate to="/student-access/" replace />;
  }

  return children;
}
