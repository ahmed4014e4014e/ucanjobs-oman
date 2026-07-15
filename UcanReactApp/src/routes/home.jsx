import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";
import { Button, Card } from "../components/ui";
import { Hero, Page, PageHeader, Section, SiteFooter } from "../components/layout";

export default function Home() {
  const { t } = useLanguage();
  const features = t("home.features");
  const stats = t("home.stats");
  const steps = t("home.steps");

  return (
    <Page>
      <Hero backgroundImage={themeImages.heroFort}>
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
              <Button to="/courses/" variant="primary" size="lg" fullWidth className="sm:w-auto">
                {t("home.exploreServices")}
              </Button>
            </div>
          </div>

          <Card variant="default" padding="sm" rounded="xl" className="text-[var(--oman-ink)]">
            <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/11]">
              <img src={themeImages.brandWordmark} alt="UcanJobs brand identity" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--oman-terracotta)] sm:text-sm">
              {t("home.cardKicker")}
            </p>
            <h2 className="mt-3 text-xl font-semibold leading-8 sm:text-2xl sm:leading-9">
              {t("home.cardTitle")}
            </h2>
          </Card>
        </div>
      </Hero>

      <Section spacing="md">
        <Card variant="default" padding="md" rounded="xl" className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {stats.map((item) => (
            <Card
              key={item.label}
              as="div"
              variant="outline"
              padding="md"
              rounded="md"
              className="text-center"
            >
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </Card>
          ))}
        </Card>
      </Section>

      <Section spacing="sm">
        <PageHeader kicker={t("home.featuresKicker")} title={t("home.featuresTitle")} />
        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} as="article" variant="default" padding="lg" rounded="lg">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{feature.title}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{feature.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        spacing="lg"
        className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10"
      >
        <div className="text-center lg:text-left">
          <PageHeader kicker={t("home.howKicker")} title={t("home.howTitle")} className="max-w-none" />
          <div className="oman-photo-frame oman-photo-frame--top mt-8 aspect-[5/6]">
            <img
              src={themeImages.brandJourney}
              alt="Job Seekers collaborating on digital skills in a modern learning space"
            />
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {steps.map((step, index) => (
            <Card key={step.title} variant="default" padding="lg" rounded="lg">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(197,154,68,0.16)] text-sm font-bold text-[var(--oman-terracotta-dark)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        <Card variant="default" padding="xl" rounded="xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <PageHeader
              kicker={t("home.tutorKicker")}
              title={t("home.tutorTitle")}
              description={t("home.tutorText")}
              className="max-w-none"
            />
            <Card variant="dark" padding="lg" rounded="lg">
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("home.tutorAccess")}
              </p>
              <h3 className="mt-4 text-xl font-semibold sm:text-2xl">{t("home.tutorCardTitle")}</h3>
              <p className="mt-4 leading-7 text-[#eadfcf]">{t("home.tutorCardText")}</p>
              <Button
                to="/instructor-access/"
                variant="primary"
                size="lg"
                className="mt-8 w-full sm:w-auto"
              >
                {t("home.tutorButton")}
              </Button>
            </Card>
          </div>
        </Card>
      </Section>

      <Section spacing="sm">
        <Card variant="default" padding="xl" rounded="xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <PageHeader
              kicker={t("home.studentKicker")}
              title={t("home.studentTitle")}
              description={t("home.studentText")}
              className="max-w-none"
            />
            <Card variant="dark" padding="lg" rounded="lg">
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("home.studentKicker")}
              </p>
              <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                {t("home.studentCardTitle")}
              </h3>
              <p className="mt-4 leading-7 text-[#eadfcf]">{t("home.studentCardText")}</p>
              <Button
                to="/learner-access/"
                variant="primary"
                size="lg"
                className="mt-8 w-full sm:w-auto"
              >
                {t("home.studentButton")}
              </Button>
            </Card>
          </div>
        </Card>
      </Section>

      <Section spacing="tightBottom">
        <Card variant="dark" padding="xl" rounded="xl" className="text-center">
          <PageHeader
            kicker={t("home.ctaKicker")}
            title={t("home.ctaTitle")}
            description={t("home.ctaText")}
            align="center"
            tone="onDark"
            titleAs="h2"
            className="mx-auto max-w-3xl"
            actions={
              <Button to="/courses/" variant="primary" size="lg">
                {t("home.ctaButton")}
              </Button>
            }
          />
        </Card>
      </Section>

      <SiteFooter />
    </Page>
  );
}
