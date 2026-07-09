import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import LessonQuiz from "../components/LessonQuiz";
import { useAuth } from "../context/AuthContext";
import {
  fetchLearningCourse,
  fetchLessonQuiz,
  submitLessonQuiz,
  updateLessonCompletion,
} from "../lib/learningContentApi";
import { themeImages } from "../lib/themeImages";

export default function LearnCourse() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingLessonId, setUpdatingLessonId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0] || null,
    [activeLessonId, lessons]
  );

  const completedCount = useMemo(
    () => lessons.filter((lesson) => lesson.isComplete).length,
    [lessons]
  );

  useEffect(() => {
    let ignore = false;

    const loadLearningCourse = async () => {
      if (!user?.id) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await fetchLearningCourse({
          slug,
          learnerId: user.id,
        });

        if (!ignore) {
          setCourse(result.course);
          setEnrollment(result.enrollment);
          setLessons(result.lessons);
          setActiveLessonId(result.lessons[0]?.id || "");
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to open this learning page right now.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadLearningCourse();

    return () => {
      ignore = true;
    };
  }, [slug, user?.id]);

  useEffect(() => {
    let ignore = false;

    const loadQuiz = async () => {
      if (!activeLesson?.id) {
        setQuiz(null);
        return;
      }

      setQuizLoading(true);
      setQuizResult(null);
      try {
        const lessonQuiz = await fetchLessonQuiz(activeLesson.id);
        if (!ignore) setQuiz(lessonQuiz);
      } catch (quizError) {
        if (!ignore) {
          setQuiz(null);
          setFeedback({
            type: "error",
            message: quizError.message || "Unable to load this lesson quiz.",
          });
        }
      } finally {
        if (!ignore) setQuizLoading(false);
      }
    };

    loadQuiz();
    return () => {
      ignore = true;
    };
  }, [activeLesson?.id]);

  const handleLessonCompletion = async (lesson) => {
    if (!user?.id || !course?.id || !enrollment?.id) {
      return;
    }

    setUpdatingLessonId(lesson.id);
    setFeedback({ type: "idle", message: "" });

    try {
      const nextEnrollment = await updateLessonCompletion({
        learnerId: user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        isComplete: !lesson.isComplete,
      });

      const nextLessons = lessons.map((item) =>
        item.id === lesson.id ? { ...item, isComplete: !lesson.isComplete } : item
      );

      setLessons(nextLessons);
      setEnrollment({
        ...nextEnrollment,
        progressPercent: nextEnrollment.progressPercent,
      });
      setFeedback({
        type: "success",
        message: !lesson.isComplete ? "Lesson marked complete." : "Lesson marked incomplete.",
      });
    } catch (updateError) {
      setFeedback({
        type: "error",
        message: updateError.message || "Unable to update lesson progress right now.",
      });
    } finally {
      setUpdatingLessonId("");
    }
  };

  const handleQuizSubmit = async (answers) => {
    if (!quiz?.id) return;

    setQuizSubmitting(true);
    setFeedback({ type: "idle", message: "" });
    try {
      const result = await submitLessonQuiz({ quizId: quiz.id, answers });
      setQuizResult(result);
      setQuiz((current) => ({ ...current, latestAttempt: result }));
      setFeedback({
        type: result.passed ? "success" : "error",
        message: result.passed
          ? "Quiz passed. You can complete this lesson."
          : `Your score was ${result.scorePercent}%. Review the lesson and try again.`,
      });
    } catch (quizError) {
      setFeedback({
        type: "error",
        message: quizError.message || "Unable to submit this quiz.",
      });
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Learning Page
          </p>
          <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
            Loading your course...
          </h1>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Course Access
          </p>
          <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
            We could not open this course.
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{error}</p>
          <Link
            to={`/courses/${slug}/`}
            className="oman-button-primary mt-6 inline-flex rounded-2xl px-6 py-3 font-semibold transition"
          >
            Back to Course
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.mountainFort})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28">
          <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
            Learning Workspace
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {course?.en?.title || "Course"}
          </h1>
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[#f4e8d6]">
              <span>{completedCount} of {lessons.length} lessons complete</span>
              <span>{enrollment?.progressPercent ?? 0}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[var(--oman-brass)] transition-all"
                style={{ width: `${enrollment?.progressPercent ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[1.75rem] oman-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Lessons
              </p>
              <h2 className="oman-title-accent mt-3 text-xl font-semibold">
                Course Path
              </h2>
            </div>
            <Link
              to="/learner-dashboard/"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-[rgba(244,232,214,0.4)]"
            >
              Dashboard
            </Link>
          </div>

          {lessons.length === 0 ? (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-center">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                No lessons published yet
              </h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                The admin team can add lesson content from the admin course lesson editor.
              </p>
            </div>
          ) : (
            <ol className="mt-6 space-y-3">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full rounded-2xl px-4 py-4 text-left ring-1 transition ${
                      activeLesson?.id === lesson.id
                        ? "bg-[rgba(197,154,68,0.14)] ring-[rgba(197,154,68,0.35)]"
                        : "bg-[rgba(255,252,247,0.92)] ring-[rgba(111,49,29,0.1)] hover:bg-white"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                      Lesson {index + 1}
                    </span>
                    <span className="mt-2 block font-semibold text-[var(--oman-ink)]">
                      {lesson.title}
                    </span>
                    <span className="mt-2 block text-sm text-[var(--oman-ink)]/65">
                      {lesson.isComplete ? "Complete" : "Not complete"}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </aside>

        <section className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          {activeLesson ? (
            <>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Lesson
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {activeLesson.title}
              </h2>

              <div className="mt-6 rounded-3xl oman-outline-panel p-5">
                <p className="whitespace-pre-wrap text-base leading-8 text-[var(--oman-ink)]/80">
                  {activeLesson.body || "Lesson content is being prepared."}
                </p>
              </div>

              {activeLesson.videoIsUpload && activeLesson.videoUrl ? (
                <video
                  controls
                  preload="metadata"
                  className="mt-5 aspect-video w-full rounded-2xl bg-black"
                  src={activeLesson.videoUrl}
                >
                  Your browser does not support video playback.
                </video>
              ) : null}

              {(activeLesson.videoUrl || activeLesson.resourceUrl) && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {activeLesson.videoUrl && !activeLesson.videoIsUpload && (
                    <a
                      href={activeLesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                    >
                      Open Video
                    </a>
                  )}
                  {activeLesson.resourceUrl && (
                    <a
                      href={activeLesson.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                    >
                      Open Resource
                    </a>
                  )}
                </div>
              )}

              {quizLoading ? (
                <p className="mt-6 text-sm text-[var(--oman-ink)]/65">Loading lesson quiz...</p>
              ) : (
                <LessonQuiz
                  key={quiz?.id || activeLesson.id}
                  quiz={quiz}
                  submitting={quizSubmitting}
                  result={quizResult}
                  onSubmit={handleQuizSubmit}
                />
              )}

              <ActionFeedback
                type={feedback.type}
                message={feedback.message}
                title="Lesson progress"
                className="mt-6"
              />

              <button
                type="button"
                onClick={() => handleLessonCompletion(activeLesson)}
                disabled={
                  updatingLessonId === activeLesson.id ||
                  (Boolean(quiz) && !(quizResult?.passed || quiz?.latestAttempt?.passed))
                }
                className="oman-button-primary mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {updatingLessonId === activeLesson.id
                  ? "Updating..."
                  : activeLesson.isComplete
                    ? "Mark Lesson Incomplete"
                    : "Mark Lesson Complete"}
              </button>
            </>
          ) : (
            <div className="rounded-3xl oman-outline-panel p-6 text-center">
              <h2 className="text-xl font-semibold text-[var(--oman-ink)]">
                Choose a lesson
              </h2>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Select a lesson from the course path to begin learning.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
