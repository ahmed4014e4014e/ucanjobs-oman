import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { courseCatalog } from "../lib/courseCatalog";
import { fetchPublishedCourses } from "../lib/courseApi";
import { themeImages } from "../lib/themeImages";
import { Alert, Button, Card, Field } from "../components/ui";
import { Hero, Page, PageHeader, Section, SiteFooter } from "../components/layout";

const FILTER_ALL = "All";
const UCAN_COURSE_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "AI and Machine Learning",
  "Cyber Security",
  "Data Analytics",
  "Cloud and DevOps",
  "Job Readiness",
];

const initialFilters = {
  category: FILTER_ALL,
  level: FILTER_ALL,
  price: FILTER_ALL,
  language: FILTER_ALL,
};

function getCoursePriceBand(course) {
  const amount = Number.parseFloat(String(course.price).replace(/[^\d.]/g, ""));

  if (!Number.isFinite(amount) || amount <= 10) {
    return "8-10 OMR";
  }

  if (amount <= 13) {
    return "11-13 OMR";
  }

  return "14-15 OMR";
}

function getCourseCareerPath(course) {
  const slug = course.slug || "";
  const category = course.category || "";

  if (slug.includes("frontend")) return "Frontend Development";
  if (slug.includes("backend")) return "Backend Development";
  if (slug.includes("ai") || category.includes("Artificial Intelligence")) return "AI and Automation";
  if (slug.includes("cyber") || category.includes("Cyber")) return "Cyber Security";
  if (slug.includes("data") || category.includes("Data")) return "Data Analytics";
  if (slug.includes("job") || category.includes("Career") || category.includes("Job")) return "Job Readiness";
  if (slug.includes("test")) return "Testing";

  return "General Tech Skills";
}

function getCourseCategory(course) {
  const slug = course.slug || "";
  const category = course.category || "";
  const title = course.en?.title || "";
  const searchableText = `${slug} ${category} ${title}`.toLowerCase();

  if (searchableText.includes("frontend")) return "Frontend Development";
  if (searchableText.includes("backend")) return "Backend Development";
  if (searchableText.includes("full stack") || searchableText.includes("full-stack")) {
    return "Full Stack Development";
  }
  if (
    searchableText.includes("machine learning") ||
    searchableText.includes("artificial intelligence") ||
    searchableText.includes("applied-ai") ||
    searchableText.includes(" ai ")
  ) {
    return "AI and Machine Learning";
  }
  if (searchableText.includes("cyber")) return "Cyber Security";
  if (searchableText.includes("data")) return "Data Analytics";
  if (searchableText.includes("cloud") || searchableText.includes("devops")) return "Cloud and DevOps";
  if (
    searchableText.includes("job") ||
    searchableText.includes("career") ||
    searchableText.includes("readiness")
  ) {
    return "Job Readiness";
  }

  return category || "General Tech Skills";
}

function getCourseRelevance(course) {
  const careerPath = getCourseCareerPath(course);

  if (careerPath === "Job Readiness") {
    return "Graduate job search";
  }

  if (careerPath === "Testing") {
    return "Enrollment testing";
  }

  return "Graduate employability";
}

function buildCourseFilterMeta(course) {
  return {
    category: getCourseCategory(course),
    level: course.level,
    relevance: getCourseRelevance(course),
    careerPath: getCourseCareerPath(course),
    price: getCoursePriceBand(course),
    language: course.language,
  };
}

function getFilterOptions(courses, filterKey) {
  const values = courses.map((course) => buildCourseFilterMeta(course)[filterKey]).filter(Boolean);
  const baseOptions = filterKey === "category" ? UCAN_COURSE_CATEGORIES : [];

  return [
    FILTER_ALL,
    ...Array.from(new Set([...baseOptions, ...values])).sort((left, right) =>
      left.localeCompare(right)
    ),
  ];
}

export default function Courses() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState(courseCatalog);
  const [filters, setFilters] = useState(initialFilters);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseLoadMessage, setCourseLoadMessage] = useState("");
  const categories = useMemo(() => {
    const labels = courses.map((course) => getCourseCategory(course));
    const uniqueLabels = Array.from(new Set(labels.filter(Boolean)));

    return Array.from(new Set([...UCAN_COURSE_CATEGORIES, ...uniqueLabels]));
  }, [courses]);
  const filterOptions = useMemo(
    () => ({
      category: getFilterOptions(courses, "category"),
      level: getFilterOptions(courses, "level"),
      price: getFilterOptions(courses, "price"),
      language: getFilterOptions(courses, "language"),
    }),
    [courses]
  );
  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const meta = buildCourseFilterMeta(course);

        return Object.entries(filters).every(
          ([key, value]) => value === FILTER_ALL || meta[key] === value
        );
      }),
    [courses, filters]
  );

  const updateFilter = (key, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      setLoadingCourses(true);
      setCourseLoadMessage("");

      try {
        const nextCourses = await fetchPublishedCourses();

        if (!active) {
          return;
        }

        setCourses(nextCourses);
        setCourseLoadMessage(
          nextCourses.some((course) => course.source === "database")
            ? ""
            : "Showing the starter catalog for now."
        );
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Course catalog load failed:", error);
        setCourses(courseCatalog);
        setCourseLoadMessage("Showing the starter catalog until live course data is available.");
      } finally {
        if (active) {
          setLoadingCourses(false);
        }
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Page>
      <Hero backgroundImage={themeImages.brandWorkers}>
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
              {t("servicesPage.heroKicker")}
            </p>
            <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
              {t("servicesPage.heroTitle")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
              {t("servicesPage.heroText")}
            </p>
          </div>

          <Card variant="default" padding="sm" rounded="xl" className="text-[var(--oman-ink)]">
            <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
              <img src={themeImages.brandWordmark} alt="UcanJobs" />
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
              {t("servicesPage.heroCardText")}
            </p>
          </Card>
        </div>
      </Hero>

      <Section spacing="md">
        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
          {categories.map((category) => (
            <span
              key={category}
              className="oman-chip rounded-full px-4 py-2 text-sm font-semibold"
            >
              {category}
            </span>
          ))}
        </div>

        <Card variant="default" padding="md" rounded="xl" className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <PageHeader
              kicker="Course filters"
              title="Find the right course faster"
              className="max-w-none"
            />
            <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["category", "Category"],
              ["level", "Level"],
              ["price", "Price"],
              ["language", "Language"],
            ].map(([key, label]) => (
              <Field
                key={key}
                as="select"
                label={label}
                name={key}
                value={filters[key]}
                onChange={(event) => updateFilter(key, event.target.value)}
                controlClassName="min-h-12"
              >
                {filterOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
            ))}
          </div>

          <p className="mt-5 text-sm font-semibold text-[var(--oman-ink)]/70">
            Showing {filteredCourses.length} of {courses.length} courses.
          </p>
        </Card>

        {(loadingCourses || courseLoadMessage) && (
          <Alert
            type="info"
            title={loadingCourses ? "Loading" : "Catalog note"}
            message={loadingCourses ? "Loading courses..." : courseLoadMessage}
            className="mt-6"
          />
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {filteredCourses.map((course) => {
            const content = course.en;
            const meta = buildCourseFilterMeta(course);

            return (
              <Card key={course.slug} as="article" variant="default" padding="lg" rounded="xl">
                <div className="flex flex-wrap gap-2">
                  <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                    {meta.category}
                  </span>
                  <span className="rounded-full bg-[rgba(255,252,247,0.95)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)]">
                    {course.level}
                  </span>
                </div>

                <h2 className="oman-title-accent mt-5 text-2xl font-semibold">{content.title}</h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{content.subtitle}</p>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  {[course.price, course.duration, course.language].map((item) => (
                    <p
                      key={item}
                      className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3 font-semibold text-[var(--oman-ink)]"
                    >
                      {item}
                    </p>
                  ))}
                </div>

                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--oman-ink)]/75">
                  {content.outcomes.slice(0, 2).map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>

                <Button to={`/courses/${course.slug}/`} variant="primary" className="mt-6 w-full sm:w-auto">
                  View Course Details
                </Button>
              </Card>
            );
          })}
        </div>

        {!loadingCourses && filteredCourses.length === 0 ? (
          <Card variant="default" padding="lg" rounded="xl" className="mt-10 text-center">
            <h2 className="text-xl font-semibold text-[var(--oman-ink)]">
              No courses match these filters
            </h2>
            <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
              Reset the filters or choose a broader option to see more courses.
            </p>
            <Button type="button" variant="secondary" className="mt-6" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Card>
        ) : null}
      </Section>

      <SiteFooter />
    </Page>
  );
}
