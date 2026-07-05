import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  enrollInCourse,
  fetchCourseEnrollment,
  fetchPublishedCourseBySlug,
  updateCourseProgress,
} from "../lib/courseApi";
import { findCourseBySlug } from "../lib/courseCatalog";
import { getCoursePriceOmr } from "../lib/paymentApi";
import { BUY_ME_A_COFFEE_URL } from "../lib/paymentConfig";
import { themeImages } from "../lib/themeImages";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [course, setCourse] = useState(() => findCourseBySlug(slug));
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);
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

  useEffect(() => {
    let active = true;

    async function loadEnrollment() {
      if (!user?.id || course?.source !== "database" || !course?.id) {
        setEnrollment(null);
        return;
      }

      setLoadingEnrollment(true);

      try {
        const nextEnrollment = await fetchCourseEnrollment({
          learnerId: user.id,
          courseId: course.id,
        });

        if (active) {
          setEnrollment(nextEnrollment);
        }
      } catch (error) {
        if (active) {
          setEnrollmentFeedback({
            type: "error",
            message: error?.message || "We could not load your enrollment or payment status.",
          });
        }
      } finally {
        if (active) {
          setLoadingEnrollment(false);
        }
      }
    }

    loadEnrollment();

    return () => {
      active = false;
    };
  }, [course?.id, course?.source, user?.id]);

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
      const priceOmr = getCoursePriceOmr(course);

      if (priceOmr > 0) {
        window.open(BUY_ME_A_COFFEE_URL, "_blank", "noopener,noreferrer");
        setEnrollmentFeedback({
          type: "success",
          message:
            "Buy Me a Coffee opened in a new tab so you can complete support payment there.",
        });
        return;
      }

      const nextEnrollment = await enrollInCourse({
        learnerId: user.id,
        courseId: course.id,
      });

      setEnrollment(nextEnrollment);

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

  const handleProgressUpdate = async (progressPercent) => {
    if (!user?.id || !course?.id) {
      return;
    }

    setUpdatingProgress(true);
    setEnrollmentFeedback({ type: "idle", message: "" });

    try {
      const nextEnrollment = await updateCourseProgress({
        learnerId: user.id,
        courseId: course.id,
        progressPercent,
      });

      setEnrollment(nextEnrollment);
      setEnrollmentFeedback({
        type: "success",
        message: `Progress updated to ${nextEnrollment.progressPercent}%.`,
      });
    } catch (error) {
      setEnrollmentFeedback({
        type: "error",
        message: error?.message || "We could not update your course progress right now.",
      });
    } finally {
      setUpdatingProgress(false);
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

  const content = course.en;
  const priceOmr = getCoursePriceOmr(course);
  const isPaidCourse = priceOmr > 0;

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

          {loadingEnrollment && (
            <div className="mt-8 rounded-2xl oman-outline-panel px-4 py-4 text-sm font-semibold text-[var(--oman-ink)]/75">
              Loading your enrollment status...
            </div>
          )}

          {enrollment && (
            <div className="mt-8 rounded-3xl oman-outline-panel p-5">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Your Progress
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold capitalize text-[var(--oman-ink)]">
                  {enrollment.status.replaceAll("_", " ")}
                </p>
                <p className="text-lg font-bold text-[var(--oman-terracotta)]">
                  {enrollment.progressPercent}%
                </p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(111,49,29,0.12)]">
                <div
                  className="h-full rounded-full bg-[var(--oman-terracotta)] transition-all"
                  style={{ width: `${enrollment.progressPercent}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[0, 25, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleProgressUpdate(value)}
                    disabled={updatingProgress}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.9)] px-3 py-2 text-sm font-semibold text-[var(--oman-ink)] transition hover:border-[var(--oman-brass)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {isPaidCourse && !enrollment && (
            <div className="mt-8 rounded-3xl oman-outline-panel p-5">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Buy Me a Coffee
              </p>
              <div className="mt-4 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/80">
                <p>
                  <span className="font-semibold text-[var(--oman-ink)]">Amount:</span>{" "}
                  {course.price}
                </p>
                <p>
                  Use the button below to open Buy Me a Coffee in a new tab and complete your support payment there.
                </p>
              </div>
              <a
                href={BUY_ME_A_COFFEE_URL}
                target="_blank"
                rel="noreferrer"
                className="oman-button-secondary mt-5 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
              >
                Pay With Buy Me a Coffee
              </a>
            </div>
          )}

          <ActionFeedback
            type={enrollmentFeedback.type}
            message={enrollmentFeedback.message}
            title="Enrollment Update"
            className="mt-8"
          />

          <button
            type="button"
            onClick={handleEnrollment}
            disabled={enrolling || Boolean(enrollment)}
            className="oman-button-primary mt-5 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {enrollment
              ? "Already Enrolled"
              : enrolling
                ? "Enrolling..."
                : user
                  ? isPaidCourse
                    ? "Open Buy Me a Coffee"
                    : "Enroll For Free"
                  : "Sign In To Enroll"}
          </button>
          <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
            {isPaidCourse
              ? "Paid courses now use a direct Buy Me a Coffee support link instead of manual payment references."
              : "Free courses enroll instantly. Paid checkout will remain manual for this phase."}
          </p>
        </aside>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
