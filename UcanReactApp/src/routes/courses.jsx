import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { courseCatalog, courseCategories } from "../lib/courseCatalog";
import { themeImages } from "../lib/themeImages";

export default function Courses() {
  const { isArabic, t } = useLanguage();
  const locale = isArabic ? "ar" : "en";
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

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
                  ? "هذه هي البنية الأولى لسوق دورات يوكان. في المراحل القادمة ستأتي هذه الدورات من Supabase مع التسجيل والدفع وتتبع التقدم."
                  : "This is the first structure for the Ucan course marketplace. In later phases, these courses will come from Supabase with enrollment, payments, and progress tracking."}
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
          {courseCategories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-[rgba(197,154,68,0.12)] px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)]"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {courseCatalog.map((course) => {
            const content = course[locale];

            return (
              <article key={course.slug} className="rounded-[1.75rem] oman-card p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                    {course.category}
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
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
