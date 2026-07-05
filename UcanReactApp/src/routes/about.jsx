import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";
import founderCasualPhoto from "../assets/founder/founder-casual.jpg";
import founderEventPhoto from "../assets/founder/founder-event.jpg";

export default function About() {
  const { t } = useLanguage();
  const values = t("about.values");
  const highlights = t("about.highlights");
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.brandHero})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                {t("about.heroKicker")}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {t("about.heroTitle")}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {t("about.heroText")}
              </p>
            </div>

            <div className="oman-card rounded-3xl p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
                <img
                  src={themeImages.brandWordmark}
                  alt="UcanJobs visual identity"
                />
              </div>
              <p className="mt-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta-dark)]">
                UcanJobs Identity
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                A unified visual system centered on employability, graduates, practical skills, and career transition in one recognizable UcanJobs style.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-8 rounded-[1.75rem] oman-card p-6 sm:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="oman-photo-frame aspect-[4/5]">
              <img
                src={founderCasualPhoto}
                alt="Ahmed R in a casual portrait"
              />
            </div>
            <div className="oman-photo-frame aspect-[4/5]">
              <img
                src={founderEventPhoto}
                alt="Ahmed R at a university event"
              />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              {t("about.founderKicker")}
            </p>
            <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
              Ahmed R
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--oman-ink)]/80 sm:text-lg sm:leading-8">
              This platform was built by Ahmed R - a college student from Muscat focused on
              solving the international problem with the big gab between fresh college graduates
              and entry market requirements to be accepted in a job
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 rounded-[1.75rem] oman-card p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl oman-outline-panel p-5 text-center sm:p-6">
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {t("about.missionKicker")}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            {t("about.missionTitle")}
          </h2>
        </div>

        <div className="space-y-5 rounded-[1.75rem] oman-card p-6 text-base leading-7 text-[var(--oman-ink)]/80 sm:p-8 sm:text-lg sm:leading-8">
          <p>
            {t("about.missionTextOne")}
          </p>
          <p>
            {t("about.missionTextTwo")}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              {t("about.valuesKicker")}
            </p>
            <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
              {t("about.valuesTitle")}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="rounded-3xl oman-card p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{value.title}</h3>
                <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-6 rounded-[1.75rem] oman-dark-panel px-6 py-10 text-white sm:px-8 sm:py-12 lg:grid-cols-[1fr_0.82fr]">
          <div className="text-center lg:text-left">
            <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
              {t("about.communityKicker")}
            </p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              {t("about.communityTitle")}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
              {t("about.communityText")}
            </p>
          </div>
          <div className="oman-photo-frame aspect-[5/4]">
            <img
              src={themeImages.brandWorkers}
              alt="Students collaborating in a modern university study environment"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
