import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";
import founderCasualPhoto from "../assets/founder/founder-casual.jpg";
import founderEventPhoto from "../assets/founder/founder-wa0014.jpg";
import { Card } from "../components/ui";
import { Hero, Page, PageHeader, Section, SiteFooter } from "../components/layout";

export default function About() {
  const { t } = useLanguage();
  const values = t("about.values");
  const highlights = t("about.highlights");

  return (
    <Page>
      <Hero backgroundImage={themeImages.brandHero}>
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

          <Card variant="default" padding="sm" rounded="xl" className="text-[var(--oman-ink)]">
            <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
              <img src={themeImages.brandWordmark} alt="UcanJobs visual identity" />
            </div>
            <p className="mt-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta-dark)]">
              UcanJobs
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
              AI-Powered Employability Training for graduates entering tech roles.
            </p>
          </Card>
        </div>
      </Hero>

      <Section spacing="md">
        <Card variant="default" padding="md" rounded="xl" className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.label} variant="outline" padding="md" rounded="md" className="text-center">
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </Card>
          ))}
        </Card>
      </Section>

      <Section
        spacing="sm"
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10"
      >
        <PageHeader
          kicker={t("about.missionKicker")}
          title={t("about.missionTitle")}
          className="max-w-none"
        />
        <Card
          variant="default"
          padding="lg"
          rounded="xl"
          className="space-y-5 text-base leading-7 text-[var(--oman-ink)]/80 sm:text-lg sm:leading-8"
        >
          <p>{t("about.missionTextOne")}</p>
          <p>{t("about.missionTextTwo")}</p>
        </Card>
      </Section>

      <Section spacing="lg">
        <PageHeader kicker={t("about.valuesKicker")} title={t("about.valuesTitle")} />
        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} as="article" variant="default" padding="lg" rounded="lg">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{value.title}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section spacing="lg">
        <Card
          variant="dark"
          padding="xl"
          rounded="xl"
          className="grid items-center gap-6 lg:grid-cols-[1fr_0.82fr]"
        >
          <div className="text-center lg:text-left">
            <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
              {t("about.communityKicker")}
            </p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">{t("about.communityTitle")}</h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
              {t("about.communityText")}
            </p>
          </div>
          <div className="oman-photo-frame aspect-[5/4]">
            <img
              src={themeImages.brandWorkers}
              alt="Learners collaborating in a modern workspace"
            />
          </div>
        </Card>
      </Section>

      <Section spacing="md">
        <Card
          variant="default"
          padding="lg"
          rounded="xl"
          className="grid items-center gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="oman-photo-frame aspect-[4/5]">
              <img src={founderCasualPhoto} alt="Ahmed R in a casual portrait" />
            </div>
            <div className="oman-photo-frame aspect-[4/5]">
              <img src={founderEventPhoto} alt="Ahmed R at an entrepreneurship event" />
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="oman-title-accent text-2xl font-semibold sm:text-3xl">Ahmed R</h2>
            <p className="mt-5 text-base leading-7 text-[var(--oman-ink)]/80 sm:text-lg sm:leading-8">
              Built in Muscat by Ahmed R as AI-Powered Employability Training for graduates entering
              junior tech roles.
            </p>
          </div>
        </Card>
      </Section>

      <SiteFooter />
    </Page>
  );
}
