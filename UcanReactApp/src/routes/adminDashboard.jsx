import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";

const adminToolTargets = [
  "/admin-contact-messages/",
  "/admin-instructor-applications/",
  "/admin-courses/",
  "/admin-enrollments/",
  "/admin-learner-accounts/",
  "/admin-market-insights/",
  "/admin-seo-performance/",
];

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const copy = t("adminDashboard");
  const name = profile?.full_name || user?.user_metadata?.full_name || copy.fallbackName;
  const institute = profile?.institute || user?.user_metadata?.institute || copy.notSet;
  const adminTools = copy.tools.map((item, index) => ({
    ...item,
    to: adminToolTargets[index],
  }));

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{ backgroundImage: `url(${themeImages.brandWorkers})` }}
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
              <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
                <img src={themeImages.brandMark} alt="UcanJobs core brand mark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="space-y-8">
          <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              {copy.profileKicker}
            </p>
            <div className="mt-6 space-y-4 text-[var(--oman-ink)]/80">
              <p>
                <span className="font-semibold">{copy.labels.fullName}</span> {name}
              </p>
              <p>
                <span className="font-semibold">{copy.labels.email}</span> {user?.email || copy.notSet}
              </p>
              <p>
                <span className="font-semibold">{copy.labels.institute}</span> {institute}
              </p>
              <p>
                <span className="font-semibold">{copy.labels.role}</span> {copy.role}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              {copy.toolsKicker}
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {adminTools.map((tool) => (
                <article key={tool.title} className="rounded-3xl oman-outline-panel p-5">
                  <h2 className="text-lg font-semibold text-[var(--oman-ink)]">{tool.title}</h2>
                  <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                    {tool.description}
                  </p>
                  <Link
                    to={tool.to}
                    className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                  >
                    {tool.action}
                  </Link>
                </article>
              ))}

              <article className="rounded-3xl oman-outline-panel p-5 lg:col-span-2">
                <h2 className="text-lg font-semibold text-[var(--oman-ink)]">{copy.workflowTitle}</h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                  {copy.workflowText}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 ring-1 ring-[rgba(111,49,29,0.1)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                      {copy.contactWorkflowTitle}
                    </p>
                    <ol className="mt-3 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/80">
                      {copy.contactWorkflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 ring-1 ring-[rgba(111,49,29,0.1)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                      {copy.platformWorkflowTitle}
                    </p>
                    <ol className="mt-3 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/80">
                      {copy.platformWorkflow.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {copy.statusTags.map((status) => (
                    <span
                      key={status}
                      className="rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta-dark)]"
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
