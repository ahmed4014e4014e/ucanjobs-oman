import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  buildTutorCards,
  fetchTutorDirectory,
} from "../lib/tutoringApi";
import { themeImages } from "../lib/themeImages";
import { isSupabaseConfigured } from "../lib/supabase";

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.user_metadata?.full_name || "Admin";
  const institute = profile?.institute || user?.user_metadata?.institute || "Not set yet";
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState("");
  const [directoryDiagnostics, setDirectoryDiagnostics] = useState({
    rawOfferingCount: 0,
    privateTutorCards: 0,
    groupTutorCards: 0,
    visibleInstitutes: 0,
  });
  const noDirectoryData =
    !directoryLoading &&
    !directoryError &&
    directoryDiagnostics.rawOfferingCount === 0 &&
    directoryDiagnostics.privateTutorCards === 0 &&
    directoryDiagnostics.groupTutorCards === 0;

  useEffect(() => {
    let ignore = false;

    const loadDirectoryDiagnostics = async () => {
      if (!isSupabaseConfigured) {
        setDirectoryDiagnostics({
          rawOfferingCount: 0,
          privateTutorCards: 0,
          groupTutorCards: 0,
          visibleInstitutes: 0,
        });
        setDirectoryError("Supabase is not configured.");
        setDirectoryLoading(false);
        return;
      }

      setDirectoryLoading(true);
      setDirectoryError("");

      try {
        const offerings = await fetchTutorDirectory();
        const privateCards = buildTutorCards(offerings, "private");
        const groupCards = buildTutorCards(offerings, "group");
        const instituteCodes = new Set();

        [...privateCards, ...groupCards].forEach((card) => {
          card.institutes.forEach((instituteCode) => instituteCodes.add(instituteCode));
        });

        if (!ignore) {
          setDirectoryDiagnostics({
            rawOfferingCount: offerings.length,
            privateTutorCards: privateCards.length,
            groupTutorCards: groupCards.length,
            visibleInstitutes: instituteCodes.size,
          });
        }
      } catch (fetchError) {
        if (!ignore) {
          setDirectoryDiagnostics({
            rawOfferingCount: 0,
            privateTutorCards: 0,
            groupTutorCards: 0,
            visibleInstitutes: 0,
          });
          setDirectoryError(fetchError.message || "Unable to load tutor directory diagnostics right now.");
        }
      } finally {
        if (!ignore) {
          setDirectoryLoading(false);
        }
      }
    };

    loadDirectoryDiagnostics();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{ backgroundImage: `url(${themeImages.mountainFort})` }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                Admin Dashboard
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Welcome, {name}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
                This protected dashboard gives you a clean place to review contact form submissions,
                tutoring requests, and the next stage of platform administration.
              </p>
            </div>
            <div className="oman-card rounded-3xl p-4 text-[var(--oman-ink)]">
              <div className="oman-photo-frame aspect-[4/3]">
                <img src={themeImages.studentsStudyHall} alt="Students collaborating in a study space" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="space-y-8">
          <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Profile
            </p>
            <div className="mt-6 space-y-4 text-[var(--oman-ink)]/80">
              <p>
                <span className="font-semibold">Full name:</span> {name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user?.email || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Institute:</span> {institute}
              </p>
              <p>
                <span className="font-semibold">Role:</span> Admin
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Admin Tools
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <article className="rounded-3xl oman-outline-panel p-5">
                <h2 className="text-lg font-semibold text-[var(--oman-ink)]">Submitted Contact Messages</h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                  Open a separate admin page to review contact submissions and download any attached files.
                </p>
                <Link
                  to="/admin-contact-messages/"
                  className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                >
                  View Contact Messages
                </Link>
              </article>

              <article className="rounded-3xl oman-outline-panel p-5">
                <h2 className="text-lg font-semibold text-[var(--oman-ink)]">Submitted Tutoring Requests</h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                  Open a separate admin page to review tutoring requests and download any submitted attachments.
                </p>
                <Link
                  to="/admin-tutoring-requests/"
                  className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                >
                  View Tutoring Requests
                </Link>
              </article>

              <article className="rounded-3xl oman-outline-panel p-5 lg:col-span-2">
                <h2 className="text-lg font-semibold text-[var(--oman-ink)]">Tutor Directory Diagnostics</h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                  Internal status for the Services directory so you can troubleshoot offerings without showing debug data to public users.
                </p>
                {noDirectoryData && (
                  <div className="mt-5 rounded-2xl border border-[rgba(197,154,68,0.24)] bg-[rgba(255,244,222,0.78)] px-4 py-4 text-sm leading-6 text-[var(--oman-terracotta-dark)]">
                    <p className="font-semibold">No tutor directory data yet</p>
                    <p className="mt-1">
                      Supabase is connected, but no active tutor offerings are available to report yet.
                    </p>
                  </div>
                )}
                <div className="mt-5 grid gap-2 text-sm leading-6 text-[var(--oman-ink)]/80 sm:grid-cols-2 lg:grid-cols-3">
                  <p>
                    <span className="font-semibold">Supabase configured:</span>{" "}
                    {isSupabaseConfigured ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Loading:</span>{" "}
                    {directoryLoading ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Raw offerings:</span>{" "}
                    {directoryDiagnostics.rawOfferingCount}
                  </p>
                  <p>
                    <span className="font-semibold">Private tutor cards:</span>{" "}
                    {directoryDiagnostics.privateTutorCards}
                  </p>
                  <p>
                    <span className="font-semibold">Group tutor cards:</span>{" "}
                    {directoryDiagnostics.groupTutorCards}
                  </p>
                  <p>
                    <span className="font-semibold">Visible institutes:</span>{" "}
                    {directoryDiagnostics.visibleInstitutes}
                  </p>
                  <p className="sm:col-span-2 lg:col-span-3">
                    <span className="font-semibold">Directory error:</span>{" "}
                    {directoryError || "None"}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
