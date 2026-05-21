import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { enrollInCourse, fetchPublishedCourseBySlug } from "../lib/courseApi";
import { findCourseBySlug } from "../lib/courseCatalog";
import { themeImages } from "../lib/themeImages";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isArabic, t } = useLanguage();
  const locale = isArabic ? "ar" : "en";
  const [course, setCourse] = useState(() => findCourseBySlug(slug));
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [courseLoadMessage, setCourseLoadMessage] = useState("");
  const [enrollmentFeedback, setEnrollmentFeedback] = useState({
    type: "idle",
    message: "",
  });
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      setLoadingCourse(true);
      setCourseLoadMessage("");

      try {
        const nextCourse = await fetchPublishedCourseBySlug(slug);

        if (!active) {
          return;
        }

        setCourse(nextCourse);
        setCourseLoadMessage(
          nextCourse?.source === "database"
            ? ""
            : "Showing this course from the starter catalog for now."
        );
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Course detail load failed:", error);
        setCourse(findCourseBySlug(slug));
        setCourseLoadMessage(
          "Showing this course from the starter catalog until live course data is available."
        );
      } finally {
        if (active) {
          setLoadingCourse(false);
        }
      }
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [slug]);

  const handleEnrollment = async () => {
    if (!user?.id) {
      navigate("/learner-access/");
      return;
    }

    if (course?.source !== "database" || !course?.id) {
      setEnrollmentFeedback({
        type: "error",
        message: "Enrollment will be available after live course data is connected.",
      });
      return;
    }

    setEnrolling(true);
    setEnrollmentFeedback({ type: "idle", message: "" });

    try {
      await enrollInCourse({
        learnerId: user.id,
        courseId: course.id,
      });

      setEnrollmentFeedback({
        type: "success",
        message: "You are enrolled. You can now view this course from your learner dashboard.",
      });
    } catch (error) {
      setEnrollmentFeedback({
        type: "error",
        message: error?.message || "We could not enroll you in this course right now.",
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (!course && loadingCourse) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Loading Course
          </p>
          <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
            Fetching course details...
          </h1>
        </section>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Course Not Found
          </p>
          <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
            We could not find this course.
          </h1>
          <Link
            to="/courses/"
            className="oman-button-primary mt-6 inline-flex rounded-2xl px-6 py-3 font-semibold transition"
          >
            Back to Courses
          </Link>
        </section>
      </main>
    );
  }

  const content = course[locale] || course.en;

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.mountainFort})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="max-w-4xl text-center lg:text-left">
            <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
              {isArabic ? course.categoryAr || course.category : course.category}
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
            {(loadingCourse || courseLoadMessage) && (
              <div className="mt-6 inline-flex rounded-2xl bg-[rgba(255,252,247,0.14)] px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
                {loadingCourse ? "Loading course details..." : courseLoadMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Overview
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            What Will You Learn?
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
            Course Content
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Proposed Modules
          </h2>
          <ol className="mt-6 space-y-3">
            {content.modules.map((module, index) => (
              <li
                key={module}
                className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-4 text-[var(--oman-ink)]"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                  Module {index + 1}
                </span>
                <p className="mt-2 font-semibold">{module}</p>
              </li>
            ))}
          </ol>

          <ActionFeedback
            type={enrollmentFeedback.type}
            message={enrollmentFeedback.message}
            title="Enrollment Update"
            className="mt-8"
          />

          <button
            type="button"
            onClick={handleEnrollment}
            disabled={enrolling}
            className="oman-button-primary mt-5 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {enrolling ? "Enrolling..." : user ? "Enroll In This Course" : "Sign In To Enroll"}
          </button>
          <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
            Payments and detailed progress tracking will be added in later phases.
          </p>
        </aside>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
