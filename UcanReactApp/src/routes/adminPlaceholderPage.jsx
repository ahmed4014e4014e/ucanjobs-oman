import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function AdminPlaceholderPage({ pageKey }) {
  const { t } = useLanguage();
  const copy = t("adminPlaceholderPages");
  const page = copy[pageKey];

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[1.75rem] oman-card p-6 shadow-xl sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {page.kicker}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-[var(--oman-ink)] sm:text-4xl">
                {page.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--oman-ink)]/75">
                {page.text}
              </p>
            </div>
            <Link
              to="/admin-dashboard/"
              className="oman-button-secondary inline-flex shrink-0 items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              {copy.back}
            </Link>
          </div>

          <div className="mt-8 rounded-3xl oman-outline-panel p-5">
            <h2 className="text-lg font-semibold text-[var(--oman-ink)]">
              {copy.comingSoon}
            </h2>
            <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
              {copy.comingSoonText}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
