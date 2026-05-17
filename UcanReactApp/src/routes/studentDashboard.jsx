import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { themeImages } from "../lib/themeImages";

const quickLinkTargets = [
  {
    to: "/courses/",
  },
  {
    to: "/contact/",
  },
];

export default function StudentDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const copy = t("studentDashboard");
  const quickLinks = copy.quickLinks.map((item, index) => ({
    ...item,
    to: quickLinkTargets[index]?.to || "/",
  }));
  const [fullName, setFullName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "idle",
    message: "",
  });
  const name = profile?.full_name || copy.fallbackName;
  const profileComplete = Boolean(profile?.full_name?.trim() && profile?.institute?.trim());

  useEffect(() => {
    setFullName(profile?.full_name || "");
    setUniversityName(profile?.institute || "");
  }, [profile?.full_name, profile?.institute]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id || !isSupabaseConfigured || !supabase) {
      setFeedback({
        type: "error",
        message: copy.messages.notConfigured,
      });
      return;
    }

    if (!fullName.trim() || !universityName.trim()) {
      setFeedback({
        type: "error",
        message: copy.messages.required,
      });
      return;
    }

    setSavingProfile(true);
    setFeedback({
      type: "idle",
      message: "",
    });

    try {
      const profilePayload = {
        id: user.id,
        full_name: fullName.trim(),
        institute: universityName.trim(),
        email: user.email || profile?.email || null,
        role: "student",
      };

      const { error } = await supabase.from("profiles").upsert(profilePayload);

      if (error) {
        throw error;
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profilePayload.full_name,
          institute: profilePayload.institute,
          role: "student",
        },
      });

      if (metadataError) {
        throw metadataError;
      }

      await refreshProfile();
      setFeedback({
        type: "success",
        message: copy.messages.success,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || copy.messages.error,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{ backgroundImage: `url(${themeImages.studentsGroup})` }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {copy.heroKicker}
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {copy.welcome.replace("{name}", name)}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
                {copy.heroText}
              </p>
            </div>
            <div className="oman-card rounded-3xl p-4 text-[var(--oman-ink)]">
              <div className="oman-photo-frame aspect-[4/3]">
                <img src={themeImages.studentsStudyHall} alt="Students studying in a library" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {copy.profileKicker}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            {profileComplete ? copy.profileComplete : copy.completeProfile}
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            {copy.profileText}
          </p>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title={copy.feedbackTitle}
            className="mt-5"
          />

          <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                {copy.studentName} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder={copy.studentNamePlaceholder}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                {copy.universityName} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
              </span>
              <input
                type="text"
                value={universityName}
                onChange={(event) => setUniversityName(event.target.value)}
                placeholder={copy.universityPlaceholder}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <div className="rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]/80">
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.email}</span>{" "}
                {user?.email || copy.notSet}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-[var(--oman-ink)]">{copy.role}</span>{" "}
                {copy.roleStudent}
              </p>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="oman-button-primary inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingProfile ? copy.saving : copy.save}
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {copy.actionsKicker}
          </p>
          {!profileComplete ? (
            <div className="mt-6 rounded-3xl oman-outline-panel p-6 text-center">
              <h2 className="text-lg font-semibold text-[var(--oman-ink)]">
                {copy.lockedTitle}
              </h2>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                {copy.lockedText}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {quickLinks.map((item) => (
                <article key={item.title} className="rounded-3xl oman-outline-panel p-5">
                  <h2 className="text-lg font-semibold text-[var(--oman-ink)]">{item.title}</h2>
                  <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{item.description}</p>
                  <Link
                    to={item.to}
                    className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                  >
                    {item.action}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
