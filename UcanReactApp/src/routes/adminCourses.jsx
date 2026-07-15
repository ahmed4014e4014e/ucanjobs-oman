import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import {
  fetchAdminCourseCategories,
  fetchAdminCourses,
  saveAdminCourse,
  updateAdminCoursePublishStatus,
} from "../lib/adminCourseApi";
import { COURSE_PRICE_MAX_OMR, COURSE_PRICE_MIN_OMR } from "../lib/coursePricing";

const blankCourse = {
  id: "",
  category_id: "",
  slug: "",
  title_en: "",
  subtitle_en: "",
  summary_en: "",
  level: "Beginner",
  duration: "Self-paced",
  language: "English",
  price_omr: COURSE_PRICE_MIN_OMR,
  is_published: false,
  sort_order: 0,
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function rowsToText(rows, key) {
  return rows.map((row) => row[key] || "").filter(Boolean).join("\n");
}

function textToRows(englishText) {
  const englishLines = englishText.split("\n");

  return englishLines.map((line) => ({
    en: line || "",
  })).filter((row) => row.en.trim());
}

function courseToForm(course) {
  return {
    course: {
      id: course.id,
      category_id: course.category_id || "",
      slug: course.slug || "",
      title_en: course.title_en || "",
      subtitle_en: course.subtitle_en || "",
      summary_en: course.summary_en || "",
      level: course.level || "Beginner",
      duration: course.duration || "Self-paced",
      language: course.language || "English",
      price_omr: course.price_omr ?? 0,
      is_published: Boolean(course.is_published),
      sort_order: course.sort_order ?? 0,
    },
    outcomes_en: rowsToText(course.outcomes || [], "outcome_en"),
    modules_en: rowsToText(course.modules || [], "title_en"),
  };
}

function createBlankForm() {
  return {
    course: { ...blankCourse },
    outcomes_en: "",
    modules_en: "",
  };
}

function formatUpdatedAt(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString("en-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState("");
  const [form, setForm] = useState(createBlankForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const activeCourse = useMemo(
    () => courses.find((course) => course.id === activeCourseId) || null,
    [activeCourseId, courses]
  );

  const stats = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((course) => course.is_published).length,
      drafts: courses.filter((course) => !course.is_published).length,
    }),
    [courses]
  );

  useEffect(() => {
    let ignore = false;

    const loadCourseAdmin = async () => {
      setLoading(true);
      setError("");

      try {
        const [categoryResults, courseResults] = await Promise.all([
          fetchAdminCourseCategories(),
          fetchAdminCourses(),
        ]);

        if (!ignore) {
          setCategories(categoryResults);
          setCourses(courseResults);
          if (courseResults[0]) {
            setActiveCourseId(courseResults[0].id);
            setForm(courseToForm(courseResults[0]));
          }
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to load courses from database.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCourseAdmin();

    return () => {
      ignore = true;
    };
  }, []);

  const updateCourseField = (field, value) => {
    setForm((current) => ({
      ...current,
      course: {
        ...current.course,
        [field]: value,
      },
    }));
  };

  const handleTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      course: {
        ...current.course,
        title_en: value,
        slug: current.course.id || current.course.slug ? current.course.slug : slugify(value),
      },
    }));
  };

  const handleSelectCourse = (course) => {
    setActiveCourseId(course.id);
    setForm(courseToForm(course));
    setFeedback({ type: "idle", message: "" });
  };

  const handleNewCourse = () => {
    setActiveCourseId("");
    setForm(createBlankForm());
    setFeedback({ type: "idle", message: "" });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const priceOmr = Number(form.course.price_omr);

    if (
      !Number.isFinite(priceOmr) ||
      priceOmr < COURSE_PRICE_MIN_OMR ||
      priceOmr > COURSE_PRICE_MAX_OMR
    ) {
      setFeedback({
        type: "error",
        message: `Please enter a course price between ${COURSE_PRICE_MIN_OMR} OMR and ${COURSE_PRICE_MAX_OMR} OMR.`,
      });
      return;
    }

    setSaving(true);
    setFeedback({ type: "idle", message: "" });

    try {
      const savedCourse = await saveAdminCourse({
        course: form.course,
        outcomes: textToRows(form.outcomes_en),
        modules: textToRows(form.modules_en),
      });

      setCourses((current) => {
        const exists = current.some((course) => course.id === savedCourse.id);
        const nextCourses = exists
          ? current.map((course) => (course.id === savedCourse.id ? savedCourse : course))
          : [savedCourse, ...current];

        return nextCourses.sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0));
      });
      setActiveCourseId(savedCourse.id);
      setForm(courseToForm(savedCourse));
      setFeedback({
        type: "success",
        message: `${savedCourse.title_en} was saved successfully.`,
      });
    } catch (saveError) {
      setFeedback({
        type: "error",
        message: saveError.message || "Unable to save this course right now.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async (course) => {
    setFeedback({ type: "idle", message: "" });

    try {
      const updatedCourse = await updateAdminCoursePublishStatus({
        courseId: course.id,
        isPublished: !course.is_published,
      });

      setCourses((current) =>
        current.map((item) => (item.id === updatedCourse.id ? updatedCourse : item))
      );
      if (activeCourseId === updatedCourse.id) {
        setForm(courseToForm(updatedCourse));
      }
      setFeedback({
        type: "success",
        message: `${updatedCourse.title_en} is now ${
          updatedCourse.is_published ? "published" : "unpublished"
        }.`,
      });
    } catch (publishError) {
      setFeedback({
        type: "error",
        message: publishError.message || "Unable to update the publish status right now.",
      });
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Admin Courses
              </p>
              <h1 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                Course Management
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                Create, edit, publish, and unpublish UcanJobs courses directly from the admin dashboard.
              </p>
            </div>
            <Link
              to="/admin-dashboard/"
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Back to Admin Dashboard
            </Link>
          </div>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title="Course management update"
            className="mt-6"
          />

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                Total
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.total}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                Published
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.published}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                Drafts
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.drafts}</p>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">Loading courses...</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Fetching course records from database.
              </p>
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] p-6 text-[var(--oman-terracotta-dark)]">
              <h3 className="text-xl font-semibold">Unable to load course admin</h3>
              <p className="mt-4 leading-7">{error}</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
              <section className="rounded-3xl oman-outline-panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[var(--oman-ink)]">Course List</h2>
                  <button
                    type="button"
                    onClick={handleNewCourse}
                    className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition"
                  >
                    New Course
                  </button>
                </div>

                {courses.length === 0 ? (
                  <div className="mt-5 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]/75">
                    No database courses found yet. Create your first course using the form.
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {courses.map((course) => (
                      <article
                        key={course.id}
                        className={`rounded-2xl p-4 ring-1 transition ${
                          activeCourseId === course.id
                            ? "bg-[rgba(197,154,68,0.14)] ring-[rgba(197,154,68,0.35)]"
                            : "bg-[rgba(255,252,247,0.92)] ring-[rgba(111,49,29,0.1)]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectCourse(course)}
                          className="w-full text-left"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-[var(--oman-ink)]">
                                {course.title_en}
                              </h3>
                              <p className="mt-1 text-sm text-[var(--oman-ink)]/70">
                                {course.category?.name_en || "No category"} - {course.level}
                              </p>
                            </div>
                            <span
                              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                                course.is_published
                                  ? "bg-[rgba(70,125,89,0.14)] text-[#2f6f45]"
                                  : "bg-[rgba(155,77,49,0.12)] text-[var(--oman-terracotta-dark)]"
                              }`}
                            >
                              {course.is_published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-[var(--oman-ink)]/60">
                            Updated {formatUpdatedAt(course.updated_at)}
                          </p>
                        </button>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handlePublishToggle(course)}
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-[rgba(244,232,214,0.4)]"
                          >
                            {course.is_published ? "Unpublish" : "Publish"}
                          </button>
                          <Link
                            to={`/admin-course-lessons/${course.id}/`}
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-[rgba(244,232,214,0.4)]"
                          >
                            Edit Lessons
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <form onSubmit={handleSave} className="rounded-3xl oman-outline-panel p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--oman-ink)]">
                      {activeCourse ? "Edit Course" : "Create Course"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/70">
                      Fields marked with * are required. Outcome and module textareas use one line per item.
                    </p>
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-3 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]">
                    <input
                      type="checkbox"
                      checked={form.course.is_published}
                      onChange={(event) => updateCourseField("is_published", event.target.checked)}
                      className="h-4 w-4 accent-[var(--oman-terracotta)]"
                    />
                    Published
                  </label>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Course title *
                    </span>
                    <input
                      type="text"
                      value={form.course.title_en}
                      onChange={(event) => handleTitleChange(event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                      required
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Slug *
                    </span>
                    <input
                      type="text"
                      value={form.course.slug}
                      onChange={(event) => updateCourseField("slug", slugify(event.target.value))}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                      required
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Category *
                    </span>
                    <select
                      value={form.course.category_id}
                      onChange={(event) => updateCourseField("category_id", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_en}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Subtitle
                    </span>
                    <input
                      type="text"
                      value={form.course.subtitle_en}
                      onChange={(event) => updateCourseField("subtitle_en", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Summary
                    </span>
                    <textarea
                      value={form.course.summary_en}
                      onChange={(event) => updateCourseField("summary_en", event.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Level
                    </span>
                    <input
                      type="text"
                      value={form.course.level}
                      onChange={(event) => updateCourseField("level", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Duration
                    </span>
                    <input
                      type="text"
                      value={form.course.duration}
                      onChange={(event) => updateCourseField("duration", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Language
                    </span>
                    <input
                      type="text"
                      value={form.course.language}
                      onChange={(event) => updateCourseField("language", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Price OMR ({COURSE_PRICE_MIN_OMR}-{COURSE_PRICE_MAX_OMR})
                    </span>
                    <input
                      type="number"
                      min={COURSE_PRICE_MIN_OMR}
                      max={COURSE_PRICE_MAX_OMR}
                      step="0.001"
                      value={form.course.price_omr}
                      onChange={(event) => updateCourseField("price_omr", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                      required
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Sort order
                    </span>
                    <input
                      type="number"
                      value={form.course.sort_order}
                      onChange={(event) => updateCourseField("sort_order", event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Outcomes, English
                    </span>
                    <textarea
                      value={form.outcomes_en}
                      onChange={(event) => setForm((current) => ({ ...current, outcomes_en: event.target.value }))}
                      rows={5}
                      className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                      Modules, English
                    </span>
                    <textarea
                      value={form.modules_en}
                      onChange={(event) => setForm((current) => ({ ...current, modules_en: event.target.value }))}
                      rows={5}
                      className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                    />
                  </label>

                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleNewCourse}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-[rgba(244,232,214,0.4)]"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Saving..." : "Save Course"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

