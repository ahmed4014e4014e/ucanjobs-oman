import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CurriculumSidebar from "../components/domain/CurriculumSidebar";
import LecturePlayerPanel from "../components/domain/LecturePlayerPanel";
import { Alert, Button, Card } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import {
  collectCurriculumResources,
  fetchLearningCourse,
  fetchLessonQuiz,
  submitLessonQuiz,
  updateLessonCompletion,
} from "../lib/learningContentApi";
import { flattenCurriculum } from "../lib/curriculumModel";

export default function LearnCourse() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const previewMode = searchParams.get("preview") === "1";
  const role = profile?.role || user?.user_metadata?.role;
  const isInstructorRole = role === "instructor" || role === "tutor";

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeLectureId, setActiveLectureId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });
  const [updatingLessonId, setUpdatingLessonId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [isInstructorPreview, setIsInstructorPreview] = useState(false);

  const flat = useMemo(() => flattenCurriculum(sections), [sections]);
  const activeIndex = flat.findIndex((item) => item.id === activeLectureId);
  const activeLecture = activeIndex >= 0 ? flat[activeIndex] : flat[0] || null;
  const progressPercent = enrollment?.progressPercent ?? 0;
  const completedCount = flat.filter((item) => item.isComplete).length;
  const allResources = useMemo(() => collectCurriculumResources(sections), [sections]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        const result = await fetchLearningCourse({
          slug,
          learnerId: user.id,
          previewAsInstructorId:
            previewMode && isInstructorRole ? user.id : null,
        });
        if (ignore) return;
        setCourse(result.course);
        setEnrollment(result.enrollment);
        setSections(result.sections);
        setIsInstructorPreview(Boolean(result.isInstructorPreview));
        const lectures = flattenCurriculum(result.sections);
        const resume =
          lectures.find((item) => !item.isComplete) || lectures[0] || null;
        setActiveLectureId(resume?.id || "");
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to open this course.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [slug, user?.id, previewMode, isInstructorRole]);

  useEffect(() => {
    let ignore = false;

    const loadQuiz = async () => {
      if (!activeLecture?.id || isInstructorPreview) {
        setQuiz(null);
        setQuizResult(null);
        return;
      }
      setQuizLoading(true);
      try {
        const data = await fetchLessonQuiz(activeLecture.id);
        if (!ignore) {
          setQuiz(data);
          setQuizResult(data?.latestAttempt || null);
        }
      } catch {
        if (!ignore) {
          setQuiz(null);
          setQuizResult(null);
        }
      } finally {
        if (!ignore) setQuizLoading(false);
      }
    };

    loadQuiz();
    return () => {
      ignore = true;
    };
  }, [activeLecture?.id, isInstructorPreview]);

  const toggleSection = (sectionId) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  const selectLecture = (lectureId) => {
    setActiveLectureId(lectureId);
    setSections((current) =>
      current.map((section) =>
        section.lectures.some((l) => l.id === lectureId)
          ? { ...section, expanded: true }
          : section
      )
    );
    setShowOverview(false);
  };

  const goRelative = (delta) => {
    const next = flat[activeIndex + delta];
    if (next) selectLecture(next.id);
  };

  const handleToggleComplete = async () => {
    if (!activeLecture || !enrollment?.id || !user?.id || isInstructorPreview) {
      if (isInstructorPreview) {
        setFeedback({
          type: "info",
          message: "Completion is disabled in instructor preview.",
        });
      }
      return;
    }

    setUpdatingLessonId(activeLecture.id);
    setFeedback({ type: "idle", message: "" });
    try {
      const nextEnrollment = await updateLessonCompletion({
        learnerId: user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
        lessonId: activeLecture.id,
        isComplete: !activeLecture.isComplete,
      });

      setEnrollment((current) => ({
        ...current,
        ...nextEnrollment,
        progressPercent: nextEnrollment.progressPercent ?? current.progressPercent,
      }));

      setSections((current) =>
        current.map((section) => ({
          ...section,
          lectures: section.lectures.map((lecture) =>
            lecture.id === activeLecture.id
              ? { ...lecture, isComplete: !activeLecture.isComplete }
              : lecture
          ),
        }))
      );

      setFeedback({
        type: "success",
        message: !activeLecture.isComplete
          ? "Lecture marked complete."
          : "Lecture marked incomplete.",
      });
    } catch (updateError) {
      setFeedback({
        type: "error",
        message: updateError.message || "Unable to update progress.",
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
          ? "Quiz passed."
          : `Score ${result.scorePercent}%. Review and try again.`,
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
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-center sm:px-6 sm:pt-28">
        <p className="oman-section-kicker text-xs font-semibold uppercase">Learning</p>
        <h1 className="oman-title-accent mt-4 text-3xl font-semibold">Loading your course...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="oman-page min-h-screen px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase">Course access</p>
          <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
            We could not open this course.
          </h1>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{error}</p>
          <Link
            to={`/courses/${slug}/`}
            className="oman-button-primary mt-6 inline-flex rounded-2xl px-6 py-3 font-semibold transition"
          >
            Back to course
          </Link>
        </section>
      </main>
    );
  }

  const courseTitle = course?.en?.title || course?.title_en || "Course";

  return (
    <main className="min-h-screen bg-[#1a1410] text-slate-900">
      <div className="border-b border-white/10 bg-[#241a16] pt-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--oman-brass)]">
              {isInstructorPreview ? "Instructor preview" : "Learning player"}
            </p>
            <h1 className="truncate text-lg font-bold sm:text-xl">{courseTitle}</h1>
            <div className="mt-2 flex max-w-md items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[var(--oman-brass)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-white/75">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="!border-white/20 !text-white"
              onClick={() => setShowOverview((value) => !value)}
            >
              {showOverview ? "Back to player" : "Course overview"}
            </Button>
            <Button to={`/courses/${slug}/`} variant="secondary" size="sm">
              Course page
            </Button>
            <Button to="/learner-dashboard/" variant="primary" size="sm">
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[minmax(17rem,22rem)_1fr]">
        <div className="min-h-[70vh] border-r border-[rgba(111,49,29,0.1)] bg-[rgba(247,239,223,0.98)] lg:min-h-[calc(100vh-8rem)]">
          <div className="sticky top-20 flex h-[calc(100vh-5.5rem)] flex-col p-3 sm:p-4">
            <Card variant="soft" padding="sm" rounded="lg" className="mb-3 shrink-0">
              <p className="text-xs font-semibold text-[var(--oman-ink)]/70">Your progress</p>
              <p className="mt-1 text-sm font-semibold text-[var(--oman-ink)]">
                {completedCount} of {flat.length} lectures complete
              </p>
              {isInstructorPreview ? (
                <p className="mt-1 text-xs text-[var(--oman-terracotta)]">
                  Preview mode — enrollment not required
                </p>
              ) : null}
            </Card>
            <CurriculumSidebar
              sections={sections}
              activeLectureId={activeLecture?.id}
              onSelectLecture={selectLecture}
              onToggleSection={toggleSection}
              mode="learner"
              className="min-h-0 flex-1 !rounded-xl"
            />
          </div>
        </div>

        <div className="min-w-0 bg-[linear-gradient(180deg,#f7efdf_0%,#efe1c9_100%)] px-4 py-5 sm:px-6 sm:py-6">
          <Alert type={feedback.type} message={feedback.message} title="Learning update" className="mb-4" />

          {showOverview ? (
            <div className="space-y-4">
              <Card variant="default" padding="lg" rounded="xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                  Overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{courseTitle}</h2>
                <p className="mt-4 leading-7 text-[var(--oman-ink)]/80">
                  {course?.en?.summary ||
                    course?.summary_en ||
                    course?.en?.subtitle ||
                    "Course summary"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-1 font-semibold">
                    {course?.level || "Level"}
                  </span>
                  <span className="rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-1 font-semibold">
                    {course?.duration || course?.en?.duration || "Self-paced"}
                  </span>
                  <span className="rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-1 font-semibold">
                    {progressPercent}% complete
                  </span>
                </div>
              </Card>

              <Card variant="default" padding="lg" rounded="xl">
                <h3 className="text-lg font-semibold">Full curriculum</h3>
                <ol className="mt-4 space-y-4">
                  {sections.map((section, sIndex) => (
                    <li key={section.id}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                        Section {sIndex + 1}: {section.title}
                      </p>
                      <ul className="mt-2 space-y-1 pl-2">
                        {section.lectures.map((lecture, lIndex) => (
                          <li key={lecture.id}>
                            <button
                              type="button"
                              className="text-left text-sm font-medium text-[var(--oman-ink)] hover:text-[var(--oman-terracotta)]"
                              onClick={() => selectLecture(lecture.id)}
                            >
                              {lIndex + 1}. {lecture.title || lecture.title_en}
                              {lecture.isComplete ? " ✓" : ""}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Card>

              <Card variant="default" padding="lg" rounded="xl">
                <h3 className="text-lg font-semibold">All resources</h3>
                {allResources.length ? (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {allResources.map((file) => (
                      <li key={`${file.lectureId}-${file.id}`}>
                        <a
                          href={file.resolvedUrl || file.fileUrl || file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-[rgba(111,49,29,0.12)] bg-white px-3 py-2 text-sm font-medium"
                        >
                          📎 {file.name}
                          <span className="ml-auto text-xs text-[var(--oman-ink)]/50">
                            {file.lectureTitle}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[var(--oman-ink)]/65">No downloads in this course yet.</p>
                )}
              </Card>
            </div>
          ) : (
            <LecturePlayerPanel
              lecture={activeLecture}
              sectionTitle={activeLecture?.sectionTitle}
              onPrev={() => goRelative(-1)}
              onNext={() => goRelative(1)}
              onToggleComplete={handleToggleComplete}
              hasPrev={activeIndex > 0}
              hasNext={activeIndex >= 0 && activeIndex < flat.length - 1}
              showComplete={!isInstructorPreview && Boolean(enrollment?.id)}
              quiz={quizLoading ? null : quiz}
              quizResult={quizResult}
              quizSubmitting={quizSubmitting || Boolean(updatingLessonId)}
              onQuizSubmit={isInstructorPreview ? null : handleQuizSubmit}
            />
          )}
        </div>
      </div>
    </main>
  );
}
