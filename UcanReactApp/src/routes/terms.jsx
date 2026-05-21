import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";

function PolicyList({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className="mt-3 space-y-2 text-sm leading-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function PolicySection({ section }) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
        {section.title}
      </p>
      {section.text && <p className="mt-3 leading-7">{section.text}</p>}
      <PolicyList items={section.items} />
    </div>
  );
}

export default function Terms() {
  const { t } = useLanguage();
  const policies = t("terms.policies");

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
                {t("terms.heroKicker")}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {t("terms.heroTitle")}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {t("terms.heroText")}
              </p>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={themeImages.policiesCampus}
                  alt="University campus walkway for the Ucan policies page"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                {t("terms.heroCardText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {t("terms.documentKicker")}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            {t("terms.documentTitle")}
          </h2>
          <div className="mt-8 space-y-8 text-[var(--oman-ink)]/85">
            {policies.map((policy) => (
              <section key={policy.title} className="rounded-3xl oman-outline-panel p-5 sm:p-6">
                <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                  {policy.title}
                </h3>
                <p className="mt-4 leading-7">{policy.body}</p>

                {policy.columns && (
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    {policy.columns.map((column) => (
                      <div key={column.title}>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                          {column.title}
                        </p>
                        <PolicyList items={column.items} />
                      </div>
                    ))}
                  </div>
                )}

                {policy.sections?.map((section) => (
                  <PolicySection key={section.title} section={section} />
                ))}

                {policy.closing && <p className="mt-5 leading-7">{policy.closing}</p>}
              </section>
            ))}

            <section className="rounded-3xl oman-outline-panel p-5">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                {t("terms.requiredTitle")}
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                {t("terms.requiredItems").map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
