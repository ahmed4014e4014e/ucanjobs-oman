import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";
import { Card } from "../components/ui";
import { Hero, Page, PageHeader, Section, SiteFooter } from "../components/layout";

function PolicyList({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
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
      {section.text ? <p className="mt-3 leading-7">{section.text}</p> : null}
      <PolicyList items={section.items} />
    </div>
  );
}

export default function Terms() {
  const { t } = useLanguage();
  const policies = t("terms.policies");

  return (
    <Page>
      <Hero backgroundImage={themeImages.brandBridge}>
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

          <Card variant="default" padding="sm" rounded="xl" className="text-[var(--oman-ink)]">
            <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
              <img
                src={themeImages.policiesCampus}
                alt="UcanJobs policies and job seeker protection visual"
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
              {t("terms.heroCardText")}
            </p>
          </Card>
        </div>
      </Hero>

      <Section spacing="md" className="max-w-5xl">
        <Card variant="default" padding="lg" rounded="xl">
          <PageHeader
            kicker={t("terms.documentKicker")}
            title={t("terms.documentTitle")}
            className="max-w-none"
          />
          <div className="mt-8 space-y-8 text-[var(--oman-ink)]/85">
            {policies.map((policy) => (
              <Card
                key={policy.title}
                as="section"
                variant="outline"
                padding="md"
                rounded="lg"
              >
                <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{policy.title}</h3>
                <p className="mt-4 leading-7">{policy.body}</p>

                {policy.columns ? (
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
                ) : null}

                {policy.sections?.map((section) => (
                  <PolicySection key={section.title} section={section} />
                ))}

                {policy.closing ? <p className="mt-5 leading-7">{policy.closing}</p> : null}
              </Card>
            ))}

            <Card as="section" variant="outline" padding="md" rounded="lg">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                {t("terms.requiredTitle")}
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--oman-ink)]/75">
                {t("terms.requiredItems").map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Card>
      </Section>

      <SiteFooter />
    </Page>
  );
}
