import { Button, Card } from "../components/ui";
import { Page, PageHeader, Section, SiteFooter } from "../components/layout";

/**
 * Entry point for Udemy-style course experience UI mocks.
 * No database required — static interactive prototypes.
 */
export default function MockCourseExperienceHub() {
  return (
    <Page>
      <Section spacing="md" className="pt-24 sm:pt-28">
        <Card variant="default" padding="xl" rounded="xl">
          <PageHeader
            kicker="UI mock · Phase A"
            title="Udemy-style course experience"
            description="Interactive prototypes for instructor curriculum building and the job seeker learning player. Data is local/demo only — Schema and API come next."
            className="max-w-3xl"
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card as="article" variant="outline" padding="lg" rounded="lg">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Instructor
              </p>
              <h2 className="mt-3 text-xl font-semibold text-[var(--oman-ink)]">
                Course creation kit
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--oman-ink)]/75">
                <li>Sections and lectures (curriculum tree)</li>
                <li>Lecture types: video, article, quiz, resources</li>
                <li>Multiple downloads per lecture</li>
                <li>Preview as student</li>
              </ul>
              <Button to="/mock/instructor-course-kit/" variant="primary" className="mt-6">
                Open instructor kit mock
              </Button>
            </Card>

            <Card as="article" variant="outline" padding="lg" rounded="lg">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Job seeker
              </p>
              <h2 className="mt-3 text-xl font-semibold text-[var(--oman-ink)]">
                Learning player
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--oman-ink)]/75">
                <li>Sidebar curriculum with section progress</li>
                <li>Video stage + lesson content</li>
                <li>Multi-file downloads</li>
                <li>Quiz panel + mark complete + prev/next</li>
              </ul>
              <Button to="/mock/learn-player/" variant="primary" className="mt-6">
                Open learner player mock
              </Button>
            </Card>
          </div>

          <Card variant="soft" padding="md" rounded="lg" className="mt-8">
            <p className="text-sm leading-6 text-[var(--oman-ink)]/80">
              <strong>Next step after you approve these mocks:</strong> database schema
              (<code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">course_sections</code>,
              multi resources, lecture types) and APIs that power these same screens with real
              instructor and enrollment data.
            </p>
          </Card>
        </Card>
      </Section>
      <SiteFooter />
    </Page>
  );
}
