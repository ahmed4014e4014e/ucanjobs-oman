import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import {
  fetchAdminCourseLessons,
  fetchAdminCourses,
  saveAdminCourseLessons,
} from "../lib/adminCourseApi";

function createBlankLesson() {
  return {
    title_en: "",
    body_en: "",
    video_url: "",
    resource_url: "",
    is_preview: false,
    is_published: true,
  };
}

function mapLessonToForm(lesson) {
  return {
    title_en: lesson.title_en || "",
    body_en: lesson.body_en || "",
    video_url: lesson.video_url || "",
    resource_url: lesson.resource_url || "",
    is_preview: Boolean(lesson.is_preview),
    is_published: Boolean(lesson.is_published),
  };
}

export default function AdminCourseLessons() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const publishedLessonCount = useMemo(
    () => lessons.filter((lesson) => lesson.is_published).length,
    [lessons]
  );

  useEffect(() => {
    let ignore = false;

    const loadLessonEditor = async () => {
      setLoading(true);
      setError("");

      try {
        const [courseResults, lessonResults] = await Promise.all([
          fetchAdminCourses(),
          fetchAdminCourseLessons(courseId),
        ]);
        const selectedCourse = courseResults.find((item) => item.id === courseId) || null;

        if (!ignore) {
          setCourse(selectedCourse);
          setLessons(lessonResults.length ? lessonResults.map(mapLessonToForm) : [createBlankLesson()]);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to load lesson content from database.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadLessonEditor();

    return () => {
      ignore = true;
    };
  }, [courseId]);

  const updateLesson = (index, field, value) => {
    setLessons((current) =>
      current.map((lesson, lessonIndex) =>
        lessonIndex === index ? { ...lesson, [field]: value } : lesson
      )
    );
  };

  const addLesson = () => {
    setLessons((current) => [...current, createBlankLesson()]);
  };

  const removeLesson = (index) => {
    setLessons((current) => {
      const nextLessons = current.filter((_, lessonIndex) => lessonIndex !== index);
      return nextLessons.length ? nextLessons : [createBlankLesson()];
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback({ type: "idle", message: "" });

    try {
      const savedLessons = await saveAdminCourseLessons({
        courseId,
        lessons,
      });

      setLessons(savedLessons.length ? savedLessons.map(mapLessonToForm) : [createBlankLesson()]);
      setFeedback({
        type: "success",
        message: "Course lessons were saved successfully.",
      });
    } catch (saveError) {
      setFeedback({
        type: "error",
        message: saveError.message || "Unable to save course lessons right now.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Admin Course Lessons
              </p>
              <h1 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {course?.title_en || "Lesson Content"}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                Build the actual learning content job seekers see after enrolling in this course.
              </p>
            </div>
            <Link
              to="/admin-courses/"
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Back to Courses
            </Link>
          </div>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title="Lesson content update"
            className="mt-6"
          />

          {loading ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">Loading lessons...</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Fetching lesson content from database.
              </p>
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] p-6 text-[var(--oman-terracotta-dark)]">
              <h3 className="text-xl font-semibold">Unable to load lessons</h3>
              <p className="mt-4 leading-7">{error}</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-8 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
                <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                    Lessons
                  </p>
                  <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{lessons.length}</p>
                </div>
                <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                    Published
                  </p>
                  <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">
                    {publishedLessonCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3 sm:col-span-1 col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                    Course
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--oman-ink)]">
                    {course?.slug || "Not found"}
                  </p>
                </div>
              </div>

              {lessons.map((lesson, index) => (
                <article key={`${index}-${lesson.title_en}`} className="rounded-3xl oman-outline-panel p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                        Lesson {index + 1}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-[var(--oman-ink)]">
                        {lesson.title_en || "Untitled lesson"}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-[rgba(244,232,214,0.4)]"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label>
                      <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                        Lesson title *
                      </span>
                      <input
                        type="text"
                        value={lesson.title_en}
                        onChange={(event) => updateLesson(index, "title_en", event.target.value)}
                        className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                        required
                      />
                    </label>

                    <label>
                      <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                        Lesson body
                      </span>
                      <textarea
                        value={lesson.body_en}
                        onChange={(event) => updateLesson(index, "body_en", event.target.value)}
                        rows={7}
                        className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                          Video URL
                        </span>
                        <input
                          type="url"
                          value={lesson.video_url}
                          onChange={(event) => updateLesson(index, "video_url", event.target.value)}
                          className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                        />
                      </label>

                      <label>
                        <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                          Resource URL
                        </span>
                        <input
                          type="url"
                          value={lesson.resource_url}
                          onChange={(event) => updateLesson(index, "resource_url", event.target.value)}
                          className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                        />
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-3 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-3 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]">
                        <input
                          type="checkbox"
                          checked={lesson.is_preview}
                          onChange={(event) => updateLesson(index, "is_preview", event.target.checked)}
                          className="h-4 w-4 accent-[var(--oman-terracotta)]"
                        />
                        Preview lesson
                      </label>
                      <label className="flex items-center gap-3 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-3 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]">
                        <input
                          type="checkbox"
                          checked={lesson.is_published}
                          onChange={(event) => updateLesson(index, "is_published", event.target.checked)}
                          className="h-4 w-4 accent-[var(--oman-terracotta)]"
                        />
                        Published
                      </label>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={addLesson}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-[rgba(244,232,214,0.4)]"
                >
                  Add Lesson
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving Lessons..." : "Save Lessons"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
