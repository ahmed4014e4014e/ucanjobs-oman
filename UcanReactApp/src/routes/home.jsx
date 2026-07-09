import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";
export default function Home() {
  const { t } = useLanguage();
  const features = t("home.features");
  const stats = t("home.stats");
  const steps = t("home.steps");
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.heroFort})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                {t("home.heroKicker")}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {t("home.heroTitle")}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {t("home.heroText")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                <Link
                  to="/courses/"
                  className="oman-button-primary w-full rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
                >
                  {t("home.exploreServices")}
                </Link>
              </div>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/11]">
                <img
                  src={themeImages.brandWordmark}
                  alt="UcanJobs brand identity"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--oman-terracotta)] sm:text-sm">
                {t("home.cardKicker")}
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-8 sm:text-2xl sm:leading-9">
                {t("home.cardTitle")}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 rounded-[1.75rem] oman-card p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl oman-outline-panel p-5 text-center sm:p-6">
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {t("home.featuresKicker")}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            {t("home.featuresTitle")}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl oman-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{feature.title}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {t("home.howKicker")}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            {t("home.howTitle")}
          </h2>
          <div className="oman-photo-frame oman-photo-frame--top mt-8 aspect-[5/6]">
            <img
              src={themeImages.brandJourney}
              alt="Omani graduates collaborating on digital skills in a modern learning space"
            />
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {steps.map((step) => (
            <div key={step.title} className="rounded-3xl oman-card p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{step.title}</h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="rounded-[1.75rem] oman-card px-6 py-10 sm:px-8 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("home.tutorKicker")}
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {t("home.tutorTitle")}
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                {t("home.tutorText")}
              </p>
            </div>

            <div className="rounded-3xl oman-dark-panel p-6 text-white sm:p-8">
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("home.tutorAccess")}
              </p>
              <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                {t("home.tutorCardTitle")}
              </h3>
              <p className="mt-4 leading-7 text-[#eadfcf]">
                {t("home.tutorCardText")}
              </p>
              <Link
                to="/instructor-access/"
                className="oman-button-primary mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
              >
                {t("home.tutorButton")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="rounded-[1.75rem] oman-card px-6 py-10 sm:px-8 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("home.studentKicker")}
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {t("home.studentTitle")}
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                {t("home.studentText")}
              </p>
            </div>

            <div className="rounded-3xl oman-dark-panel p-6 text-white sm:p-8">
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("home.studentKicker")}
              </p>
              <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                {t("home.studentCardTitle")}
              </h3>
              <p className="mt-4 leading-7 text-[#eadfcf]">
                {t("home.studentCardText")}
              </p>
              <Link
                to="/learner-access/"
                className="oman-button-primary mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
              >
                {t("home.studentButton")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[1.75rem] oman-dark-panel px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
            {t("home.ctaKicker")}
          </p>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            {t("home.ctaTitle")}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
            {t("home.ctaText")}
          </p>
          <Link
            to="/courses/"
            className="oman-button-primary mt-8 inline-flex rounded-2xl px-8 py-3 text-center font-semibold transition"
          >
            {t("home.ctaButton")}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
