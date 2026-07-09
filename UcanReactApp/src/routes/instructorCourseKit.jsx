import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import InstructorLessonEditor from "../components/InstructorLessonEditor";
import { useAuth } from "../context/AuthContext";
import { uploadCourseMedia } from "../lib/courseMediaApi";
import {
  confirmInstructorCoursePublication,
  fetchInstructorCourseKit,
  saveInstructorCourseKit,
} from "../lib/instructorCourseApi";

function blankLesson() {
  const lessonId = crypto.randomUUID();
  return {
    id: lessonId,
    clientId: lessonId,
    title_en: "",
    body_en: "",
    video_url: "",
    resource_url: "",
    is_preview: false,
    is_published: true,
    quiz: null,
  };
}

function lessonForm(lesson) {
  return {
    ...lesson,
    clientId: lesson.id || crypto.randomUUID(),
    title_en: lesson.title_en || "",
    body_en: lesson.body_en || "",
    video_url: lesson.video_url || "",
    resource_url: lesson.resource_url || "",
    is_preview: Boolean(lesson.is_preview),
    is_published: Boolean(lesson.is_published),
    quiz: lesson.quiz || null,
  };
}

export default function InstructorCourseKit() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState({ lessonId: "", field: "" });
  const [publicationConfirmed, setPublicationConfirmed] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const publishedLessonCount = useMemo(
    () => lessons.filter((lesson) => lesson.is_published && lesson.title_en.trim()).length,
    [lessons]
  );
  const isPublished = course?.publication_status === "published";

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const result = await fetchInstructorCourseKit({
          courseId,
          instructorId: user?.id,
        });
        if (!ignore) {
          setCourse(result.course);
          setLessons(result.lessons.length ? result.lessons.map(lessonForm) : [blankLesson()]);
        }
      } catch (error) {
        if (!ignore) {
          setFeedback({
            type: "error",
            message: error.message || "Unable to load this course kit.",
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (courseId && user?.id) load();
    return () => {
      ignore = true;
    };
  }, [courseId, user?.id]);

  const updateCourse = (field, value) => {
    setCourse((current) => ({ ...current, [field]: value }));
  };

  const updateLesson = (clientId, field, value) => {
    setLessons((current) =>
      current.map((lesson) =>
        lesson.clientId === clientId ? { ...lesson, [field]: value } : lesson
      )
    );
  };

  const removeLesson = (clientId) => {
    setLessons((current) => {
      const remaining = current.filter((lesson) => lesson.clientId !== clientId);
      return remaining.length ? remaining : [blankLesson()];
    });
  };

  const uploadMedia = async (lesson, field, file) => {
    if (!file || !user?.id) return;

    setUploading({ lessonId: lesson.id, field });
    setFeedback({ type: "idle", message: "" });
    try {
      const storedValue = await uploadCourseMedia({
        file,
        instructorId: user.id,
        courseId: course.id,
        mediaType: field === "video_url" ? "video" : "attachment",
      });
      updateLesson(lesson.clientId, field, storedValue);
      setFeedback({
        type: "success",
        message: `${file.name} was uploaded. Save the draft to attach it to this lesson.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to upload this course file.",
      });
    } finally {
      setUploading({ lessonId: "", field: "" });
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback({ type: "idle", message: "" });

    try {
      const result = await saveInstructorCourseKit({ course, lessons });
      setCourse(result.course);
      setLessons(result.lessons.length ? result.lessons.map(lessonForm) : [blankLesson()]);
      setFeedback({ type: "success", message: "Your course draft was saved." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to save this course draft.",
      });
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!publicationConfirmed) return;
    setPublishing(true);
    setFeedback({ type: "idle", message: "" });

    try {
      const publishedCourse = await confirmInstructorCoursePublication(course.id);
      setCourse(publishedCourse);
      setFeedback({
        type: "success",
        message: "The course is published and available through the learner course flow.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to publish this course.",
      });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <main className="oman-page min-h-screen px-4 pt-28 text-center">Loading course kit...</main>;
  }

  if (!course) {
    return (
      <main className="oman-page min-h-screen px-4 pt-28 text-center">
        <ActionFeedback {...feedback} title="Course kit unavailable" />
      </main>
    );
  }

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <header className="oman-card rounded-[1.75rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase">Course Creation Kit</p>
              <h1 className="oman-title-accent mt-3 text-3xl font-semibold">{course.title_en}</h1>
              <p className="mt-3 text-sm font-semibold uppercase text-[var(--oman-terracotta)]">
                {course.publication_status}
              </p>
            </div>
            <Link to="/instructor-courses/" className="rounded-2xl bg-white px-5 py-3 font-semibold ring-1 ring-[rgba(111,49,29,0.14)]">
              Back to My Courses
            </Link>
          </div>
          <ActionFeedback {...feedback} title="Course kit update" className="mt-6" />
        </header>

        <form onSubmit={save} className="mt-8 space-y-6">
          <section className="oman-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Course details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold">Course subtitle</span>
                <input
                  value={course.subtitle_en || ""}
                  onChange={(event) => updateCourse("subtitle_en", event.target.value)}
                  disabled={isPublished}
                  className="mt-2 min-h-12 w-full rounded-2xl border bg-white px-4 py-3 disabled:opacity-60"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold">Course summary</span>
                <textarea
                  value={course.summary_en || ""}
                  onChange={(event) => updateCourse("summary_en", event.target.value)}
                  disabled={isPublished}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 disabled:opacity-60"
                />
              </label>
              <label>
                <span className="text-sm font-semibold">Duration</span>
                <input
                  value={course.duration || ""}
                  onChange={(event) => updateCourse("duration", event.target.value)}
                  disabled={isPublished}
                  className="mt-2 min-h-12 w-full rounded-2xl border bg-white px-4 py-3 disabled:opacity-60"
                />
              </label>
              <label>
                <span className="text-sm font-semibold">Language</span>
                <input
                  value={course.language || ""}
                  onChange={(event) => updateCourse("language", event.target.value)}
                  disabled={isPublished}
                  className="mt-2 min-h-12 w-full rounded-2xl border bg-white px-4 py-3 disabled:opacity-60"
                />
              </label>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Curriculum</h2>
              <span className="text-sm text-[var(--oman-ink)]/65">
                {publishedLessonCount} publishable lessons
              </span>
            </div>
            {lessons.map((lesson, index) => (
              <InstructorLessonEditor
                key={lesson.clientId}
                lesson={lesson}
                index={index}
                disabled={isPublished}
                uploadingField={uploading.lessonId === lesson.id ? uploading.field : ""}
                onChange={(field, value) => updateLesson(lesson.clientId, field, value)}
                onRemove={() => removeLesson(lesson.clientId)}
                onUpload={(field, file) => uploadMedia(lesson, field, file)}
              />
            ))}
          </section>

          {!isPublished ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setLessons((current) => [...current, blankLesson()])}
                className="rounded-2xl bg-white px-5 py-3 font-semibold ring-1 ring-[rgba(111,49,29,0.14)]"
              >
                Add Lesson
              </button>
              <button
                type="submit"
                disabled={saving}
                className="oman-button-secondary rounded-2xl px-5 py-3 font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>
            </div>
          ) : null}
        </form>

        {!isPublished ? (
          <section className="oman-card mt-8 rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Publication confirmation</h2>
            <label className="mt-5 flex items-start gap-3">
              <input
                type="checkbox"
                checked={publicationConfirmed}
                onChange={(event) => setPublicationConfirmed(event.target.checked)}
                className="mt-1"
              />
              <span className="text-sm leading-6">
                I confirm that the course content is complete, accurate, and ready for learners.
              </span>
            </label>
            <button
              type="button"
              onClick={publish}
              disabled={!publicationConfirmed || publishing || publishedLessonCount === 0}
              className="oman-button-secondary mt-5 rounded-2xl px-5 py-3 font-semibold disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Confirm and Publish Course"}
            </button>
          </section>
        ) : (
          <section className="oman-card mt-8 rounded-[1.75rem] p-6">
            <Link to={`/courses/${course.slug}/`} className="oman-button-secondary inline-flex rounded-2xl px-5 py-3 font-semibold">
              View Published Course
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
