import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { courseCatalog } from "../lib/courseCatalog";
import { fetchPublishedCourses } from "../lib/courseApi";
import { themeImages } from "../lib/themeImages";

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
  if (course.price === "Free") {
    return "Free";
  }

  const amount = Number.parseFloat(String(course.price).replace(/[^\d.]/g, ""));

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free";
  }

  if (amount <= 20) {
    return "20 OMR or less";
  }

  if (amount <= 30) {
    return "21-30 OMR";
  }

  return "31 OMR or more";
}

function getCourseCareerPath(course) {
  const slug = course.slug || "";
  const category = course.category || "";

  if (slug.includes("frontend")) return "Frontend Development";
  if (slug.includes("backend")) return "Backend Development";
  if (slug.includes("ai") || category.includes("Artificial Intelligence")) return "AI and Automation";
  if (slug.includes("cyber") || category.includes("Cyber")) return "Cyber Security";
  if (slug.includes("data") || category.includes("Data")) return "Data Analytics";
  if (slug.includes("job") || category.includes("Career")) return "Career Readiness";
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

  if (careerPath === "Career Readiness") {
    return "Graduate job search";
  }

  if (careerPath === "Testing") {
    return "Enrollment testing";
  }

  return "Graduate employability";
}

function buildCourseFilterMeta(course, isArabic) {
  return {
    category: getCourseCategory(course),
    level: course.level,
    relevance: getCourseRelevance(course),
    careerPath: getCourseCareerPath(course),
    price: getCoursePriceBand(course),
    language: course.language,
  };
}

function getFilterOptions(courses, filterKey, isArabic) {
  const values = courses
    .map((course) => buildCourseFilterMeta(course, isArabic)[filterKey])
    .filter(Boolean);
  const baseOptions = filterKey === "category" ? UCAN_COURSE_CATEGORIES : [];

  return [
    FILTER_ALL,
    ...Array.from(new Set([...baseOptions, ...values])).sort((left, right) =>
      left.localeCompare(right)
    ),
  ];
}

export default function Courses() {
  const { isArabic, t } = useLanguage();
  const locale = isArabic ? "ar" : "en";
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
      category: getFilterOptions(courses, "category", isArabic),
      level: getFilterOptions(courses, "level", isArabic),
      price: getFilterOptions(courses, "price", isArabic),
      language: getFilterOptions(courses, "language", isArabic),
    }),
    [courses, isArabic]
  );
  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const meta = buildCourseFilterMeta(course, isArabic);

        return Object.entries(filters).every(
          ([key, value]) => value === FILTER_ALL || meta[key] === value
        );
      }),
    [courses, filters, isArabic]
  );
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

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
            : isArabic
              ? "يتم عرض كتالوج البداية حالياً."
              : "Showing the starter catalog for now."
        );
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Course catalog load failed:", error);
        setCourses(courseCatalog);
        setCourseLoadMessage(
          isArabic
            ? "يتم عرض كتالوج البداية حالياً إلى أن تتوفر بيانات الدورات."
            : "Showing the starter catalog until live course data is available."
        );
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
  }, [isArabic]);

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.studentsGroup})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                {isArabic ? "كتالوج الدورات" : "Course Catalog"}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {isArabic
                  ? "دورات عملية مبنية حول مهارات التوظيف التقني في عُمان."
                  : "Practical courses built around Oman’s technology employment needs."}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {isArabic
                  ? "هذه هي البنية الأولى لسوق دورات يوكان. في المراحل القادمة ستأتي هذه الدورات من database مع التسجيل والدفع وتتبع التقدم."
                  : "This is the first structure for the Ucan course marketplace. In later phases, these courses will come from database with enrollment, payments, and progress tracking."}
              </p>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img src={themeImages.studentsStudyHall} alt="Learners studying online" />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                {isArabic
                  ? "ابدأ بفئات تقنية مطلوبة، ثم وسعها لاحقاً باستخدام بيانات السوق والذكاء الاصطناعي."
                  : "Start with high-demand tech categories, then expand them later using market data and AI."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-[rgba(197,154,68,0.12)] px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)]"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] oman-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Course Filters
              </p>
              <h2 className="oman-title-accent mt-3 text-2xl font-semibold">
                Find the right course faster
              </h2>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition"
            >
              Reset Filters
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["category", "Category"],
              ["level", "Level"],
              ["price", "Price"],
              ["language", "Language"],
            ].map(([key, label]) => (
              <label key={key} className="flex min-w-0 flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                  {label}
                </span>
                <select
                  value={filters[key]}
                  onChange={(event) => updateFilter(key, event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                >
                  {filterOptions[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <p className="mt-5 text-sm font-semibold text-[var(--oman-ink)]/70">
            Showing {filteredCourses.length} of {courses.length} courses.
          </p>
        </div>

        {(loadingCourses || courseLoadMessage) && (
          <div className="mt-6 rounded-2xl bg-[rgba(255,252,247,0.9)] px-4 py-3 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]">
            {loadingCourses
              ? isArabic
                ? "جاري تحميل الدورات..."
                : "Loading courses..."
              : courseLoadMessage}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {filteredCourses.map((course) => {
            const content = course[locale] || course.en;
            const meta = buildCourseFilterMeta(course, isArabic);

            return (
              <article key={course.slug} className="rounded-[1.75rem] oman-card p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                    {meta.category}
                  </span>
                  <span className="rounded-full bg-[rgba(255,252,247,0.95)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)]">
                    {course.level}
                  </span>
                </div>

                <h2 className="oman-title-accent mt-5 text-2xl font-semibold">
                  {content.title}
                </h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{content.subtitle}</p>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  <p className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3 font-semibold text-[var(--oman-ink)]">
                    {course.price}
                  </p>
                  <p className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3 font-semibold text-[var(--oman-ink)]">
                    {course.duration}
                  </p>
                  <p className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3 font-semibold text-[var(--oman-ink)]">
                    {course.language}
                  </p>
                </div>

                <ul className="mt-5 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                  {content.outcomes.slice(0, 2).map((outcome) => (
                    <li key={outcome}>- {outcome}</li>
                  ))}
                </ul>

                <Link
                  to={`/courses/${course.slug}/`}
                  className="oman-button-primary mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition sm:w-auto"
                >
                  {isArabic ? "عرض تفاصيل الدورة" : "View Course Details"}
                </Link>
              </article>
            );
          })}
        </div>

        {!loadingCourses && filteredCourses.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--oman-ink)]">
              No courses match these filters
            </h2>
            <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
              Reset the filters or choose a broader option to see more courses.
            </p>
          </div>
        )}
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
