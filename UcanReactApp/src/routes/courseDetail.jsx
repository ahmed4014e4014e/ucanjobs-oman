import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { findCourseBySlug } from "../lib/courseCatalog";
import { themeImages } from "../lib/themeImages";

export default function CourseDetail() {
  const { slug } = useParams();
  const { isArabic, t } = useLanguage();
  const locale = isArabic ? "ar" : "en";
  const course = findCourseBySlug(slug);
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

  if (!course) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {isArabic ? "الدورة غير موجودة" : "Course Not Found"}
          </p>
          <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
            {isArabic ? "لم نتمكن من العثور على هذه الدورة." : "We could not find this course."}
          </h1>
          <Link
            to="/courses/"
            className="oman-button-primary mt-6 inline-flex rounded-2xl px-6 py-3 font-semibold transition"
          >
            {isArabic ? "العودة إلى الدورات" : "Back to Courses"}
          </Link>
        </section>
      </main>
    );
  }

  const content = course[locale];

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.mountainFort})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="max-w-4xl text-center lg:text-left">
            <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
              {course.category}
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
              {content.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {[course.price, course.duration, course.level, course.language].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[rgba(255,252,247,0.16)] px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {isArabic ? "نظرة عامة" : "Overview"}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            {isArabic ? "ما الذي ستتعلمه؟" : "What Will You Learn?"}
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
            {content.summary}
          </p>

          <div className="mt-8 grid gap-4">
            {content.outcomes.map((outcome) => (
              <div key={outcome} className="rounded-2xl oman-outline-panel px-4 py-4">
                <p className="font-semibold text-[var(--oman-ink)]">{outcome}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {isArabic ? "محتوى الدورة" : "Course Content"}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            {isArabic ? "الوحدات المقترحة" : "Proposed Modules"}
          </h2>
          <ol className="mt-6 space-y-3">
            {content.modules.map((module, index) => (
              <li
                key={module}
                className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-4 text-[var(--oman-ink)]"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                  {isArabic ? `الوحدة ${index + 1}` : `Module ${index + 1}`}
                </span>
                <p className="mt-2 font-semibold">{module}</p>
              </li>
            ))}
          </ol>

          <Link
            to="/student-access/"
            className="oman-button-primary mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
          >
            {isArabic ? "انضم كمتعلم" : "Join As A Learner"}
          </Link>
          <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
            {isArabic
              ? "التسجيل والدفع وتتبع التقدم ستضاف في مراحل لاحقة."
              : "Enrollment, payment, and progress tracking will be added in later phases."}
          </p>
        </aside>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
