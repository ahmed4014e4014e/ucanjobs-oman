import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CurriculumSidebar from "../components/domain/CurriculumSidebar";
import { Alert, Button, Card, Field } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import {
  countCurriculumStats,
  createBlankLecture,
  createBlankQuiz,
  createBlankSection,
  flattenCurriculum,
  normalizeLectureType,
} from "../lib/curriculumModel";
import { uploadCourseMedia } from "../lib/courseMediaApi";
import {
  confirmInstructorCoursePublication,
  fetchInstructorCourseKit,
  saveInstructorCourseKit,
} from "../lib/instructorCourseApi";

const LECTURE_TYPE_OPTIONS = [
  { id: "video", label: "Video" },
  { id: "article", label: "Article" },
  { id: "quiz", label: "Quiz" },
  { id: "resources", label: "Resources" },
];

function ensureLectureIds(lecture) {
  return {
    ...lecture,
    id: lecture.id || crypto.randomUUID(),
    clientId: lecture.clientId || lecture.id || crypto.randomUUID(),
    type: normalizeLectureType(lecture.type || lecture.lecture_type),
    title: lecture.title || lecture.title_en || "",
    title_en: lecture.title_en || lecture.title || "",
    body: lecture.body || lecture.body_en || "",
    body_en: lecture.body_en || lecture.body || "",
    video_url: lecture.video_url || lecture.videoUrl || "",
    videoUrl: lecture.videoUrl || lecture.video_url || "",
    durationLabel: lecture.durationLabel || lecture.duration_label || "",
    duration_label: lecture.duration_label || lecture.durationLabel || "",
    isPreview: Boolean(lecture.isPreview ?? lecture.is_preview),
    is_preview: Boolean(lecture.is_preview ?? lecture.isPreview),
    isPublished: Boolean(lecture.isPublished ?? lecture.is_published ?? true),
    is_published: Boolean(lecture.is_published ?? lecture.isPublished ?? true),
    resources: (lecture.resources || []).map((resource) => ({
      ...resource,
      id: resource.id || crypto.randomUUID(),
      fileUrl: resource.fileUrl || resource.file_url || "",
      file_url: resource.file_url || resource.fileUrl || "",
      name: resource.name || "Resource",
    })),
  };
}

function normalizeSections(sections) {
  if (!sections?.length) {
    return [createBlankSection("Main")];
  }
  return sections.map((section) => ({
    ...section,
    id: section.id || crypto.randomUUID(),
    clientId: section.clientId || section.id,
    title: section.title || section.title_en || "Section",
    title_en: section.title_en || section.title || "Section",
    expanded: section.expanded !== false,
    lectures: (section.lectures || []).map(ensureLectureIds),
  }));
}

export default function InstructorCourseKit() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeLectureId, setActiveLectureId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState({ lectureId: "", kind: "" });
  const [publicationConfirmed, setPublicationConfirmed] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const flat = useMemo(() => flattenCurriculum(sections), [sections]);
  const stats = useMemo(() => countCurriculumStats(sections), [sections]);
  const activeLecture = flat.find((item) => item.id === activeLectureId) || flat[0] || null;
  const isPublished = course?.publication_status === "published";
  const publishedLectureCount = flat.filter(
    (lecture) => lecture.is_published && (lecture.title_en || lecture.title)?.trim()
  ).length;

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const result = await fetchInstructorCourseKit({
          courseId,
          instructorId: user?.id,
        });
        if (!ignore) {
          const nextSections = normalizeSections(result.sections);
          setCourse(result.course);
          setSections(nextSections);
          const firstId = flattenCurriculum(nextSections)[0]?.id || "";
          setActiveLectureId(firstId);
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

  const updateSections = (updater) => {
    setSections((current) => updater(current));
  };

  const toggleSection = (sectionId) => {
    updateSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  const patchActiveLecture = (patch) => {
    if (!activeLecture) return;
    updateSections((current) =>
      current.map((section) => ({
        ...section,
        lectures: section.lectures.map((lecture) =>
          lecture.id === activeLecture.id
            ? ensureLectureIds({ ...lecture, ...patch })
            : lecture
        ),
      }))
    );
  };

  const addSection = () => {
    if (isPublished) return;
    const section = createBlankSection("New section");
    updateSections((current) => [...current, section]);
    setActiveLectureId(section.lectures[0].id);
  };

  const addLecture = (type) => {
    if (isPublished) return;
    if (!activeLecture) {
      addSection();
      return;
    }
    const lecture = ensureLectureIds(createBlankLecture(type));
    updateSections((current) =>
      current.map((section) =>
        section.id === activeLecture.sectionId
          ? { ...section, expanded: true, lectures: [...section.lectures, lecture] }
          : section
      )
    );
    setActiveLectureId(lecture.id);
  };

  const removeActiveLecture = () => {
    if (!activeLecture || isPublished) return;
    const removedId = activeLecture.id;
    let nextActiveId = "";
    updateSections((current) => {
      const next = current
        .map((section) =>
          section.id === activeLecture.sectionId
            ? {
                ...section,
                lectures: section.lectures.filter((lecture) => lecture.id !== removedId),
              }
            : section
        )
        .filter((section) => section.lectures.length > 0);
      nextActiveId = flattenCurriculum(next)[0]?.id || "";
      return next.length ? next : [createBlankSection("Main")];
    });
    setActiveLectureId(nextActiveId);
  };

  const moveLecture = (direction) => {
    if (!activeLecture || isPublished) return;
    updateSections((current) =>
      current.map((section) => {
        if (section.id !== activeLecture.sectionId) return section;
        const index = section.lectures.findIndex((l) => l.id === activeLecture.id);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= section.lectures.length) return section;
        const next = [...section.lectures];
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item);
        return { ...section, lectures: next };
      })
    );
  };

  const renameSection = (sectionId, title) => {
    updateSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, title, title_en: title }
          : section
      )
    );
  };

  const uploadVideo = async (file) => {
    if (!file || !user?.id || !course || !activeLecture || isPublished) return;
    setUploading({ lectureId: activeLecture.id, kind: "video" });
    setFeedback({ type: "idle", message: "" });
    try {
      const storedValue = await uploadCourseMedia({
        file,
        instructorId: user.id,
        courseId: course.id,
        mediaType: "video",
      });
      patchActiveLecture({ video_url: storedValue, videoUrl: storedValue, type: "video" });
      setFeedback({
        type: "success",
        message: `${file.name} uploaded. Save draft to keep it on this lecture.`,
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to upload video." });
    } finally {
      setUploading({ lectureId: "", kind: "" });
    }
  };

  const uploadResourceFile = async (file) => {
    if (!file || !user?.id || !course || !activeLecture || isPublished) return;
    setUploading({ lectureId: activeLecture.id, kind: "resource" });
    setFeedback({ type: "idle", message: "" });
    try {
      const storedValue = await uploadCourseMedia({
        file,
        instructorId: user.id,
        courseId: course.id,
        mediaType: "attachment",
      });
      const resource = {
        id: crypto.randomUUID(),
        name: file.name,
        file_url: storedValue,
        fileUrl: storedValue,
      };
      patchActiveLecture({
        resources: [...(activeLecture.resources || []), resource],
      });
      setFeedback({
        type: "success",
        message: `${file.name} uploaded. Save draft to attach it.`,
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to upload file." });
    } finally {
      setUploading({ lectureId: "", kind: "" });
    }
  };

  const addNamedResource = () => {
    const name = resourceName.trim();
    if (!name || !activeLecture || isPublished) return;
    // Placeholder until upload — instructors should use file upload; allow URL label notes
    patchActiveLecture({
      resources: [
        ...(activeLecture.resources || []),
        {
          id: crypto.randomUUID(),
          name,
          file_url: name.startsWith("http") || name.startsWith("storage://") ? name : "",
          fileUrl: name.startsWith("http") || name.startsWith("storage://") ? name : "",
        },
      ].filter((item) => item.file_url),
    });
    if (!(name.startsWith("http") || name.startsWith("storage://"))) {
      setFeedback({
        type: "info",
        message: "Use Upload file for attachments, or paste a full URL / storage path.",
      });
    }
    setResourceName("");
  };

  const removeResource = (resourceId) => {
    if (!activeLecture || isPublished) return;
    patchActiveLecture({
      resources: (activeLecture.resources || []).filter((item) => item.id !== resourceId),
    });
  };

  const save = async (event) => {
    event?.preventDefault?.();
    if (!course || isPublished) return;
    setSaving(true);
    setFeedback({ type: "idle", message: "" });
    try {
      const result = await saveInstructorCourseKit({ course, sections });
      const nextSections = normalizeSections(result.sections);
      setCourse(result.course);
      setSections(nextSections);
      const stillActive = flattenCurriculum(nextSections).some((l) => l.id === activeLectureId);
      if (!stillActive) {
        setActiveLectureId(flattenCurriculum(nextSections)[0]?.id || "");
      }
      setFeedback({ type: "success", message: "Course draft saved with full curriculum." });
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
    if (!publicationConfirmed || !course) return;
    setPublishing(true);
    setFeedback({ type: "idle", message: "" });
    try {
      const result = await saveInstructorCourseKit({ course, sections });
      setCourse(result.course);
      setSections(normalizeSections(result.sections));
      const publishedCourse = await confirmInstructorCoursePublication(course.id);
      setCourse(publishedCourse);
      setFeedback({
        type: "success",
        message: "Course published. Job seekers can enroll when live in the catalog.",
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
    return (
      <main className="oman-page min-h-screen px-4 pt-28 text-center">Loading course kit...</main>
    );
  }

  if (!course) {
    return (
      <main className="oman-page min-h-screen px-4 pt-28">
        <Alert type={feedback.type} message={feedback.message} title="Course kit unavailable" />
      </main>
    );
  }

  const previewPath = course.slug
    ? `/learn/${course.slug}/?preview=1`
    : "/instructor-courses/";

  return (
    <main className="oman-page min-h-screen bg-[linear-gradient(180deg,#f7efdf_0%,#f2e3cc_100%)] text-slate-900">
      <div className="border-b border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.95)] pt-20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]">
              Course creation kit
            </p>
            <h1 className="mt-1 text-xl font-bold text-[var(--oman-ink)] sm:text-2xl">
              {course.title_en}
            </h1>
            <p className="mt-1 text-sm text-[var(--oman-ink)]/65">
              {course.publication_status} · {stats.sectionCount} sections · {stats.lectureCount}{" "}
              lectures · {stats.resourceCount} files
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button to="/instructor-courses/" variant="ghost" size="sm">
              My courses
            </Button>
            <Button to={previewPath} variant="secondary" size="sm">
              Preview as student
            </Button>
            {!isPublished ? (
              <Button type="button" variant="primary" size="sm" loading={saving} onClick={save}>
                {saving ? "Saving..." : "Save draft"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(16rem,20rem)_1fr] lg:gap-6">
        <div className="flex min-h-[70vh] flex-col gap-3">
          <CurriculumSidebar
            sections={sections}
            activeLectureId={activeLecture?.id}
            onSelectLecture={setActiveLectureId}
            onToggleSection={toggleSection}
            mode="instructor"
            className="min-h-[28rem] flex-1"
          />
          {!isPublished ? (
            <div className="flex flex-col gap-2">
              <Button type="button" variant="secondary" fullWidth size="sm" onClick={addSection}>
                + Add section
              </Button>
              <div className="grid grid-cols-2 gap-2">
                {LECTURE_TYPE_OPTIONS.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addLecture(type.id)}
                  >
                    + {type.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 space-y-4">
          <Alert type={feedback.type} message={feedback.message} title="Course kit update" />

          <Card variant="default" padding="lg" rounded="xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
              Course details
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Subtitle"
                name="subtitle"
                value={course.subtitle_en || ""}
                onChange={(e) => setCourse((c) => ({ ...c, subtitle_en: e.target.value }))}
                disabled={isPublished}
                className="sm:col-span-2"
                controlClassName="min-h-12"
              />
              <Field
                as="textarea"
                label="Summary"
                name="summary"
                value={course.summary_en || ""}
                onChange={(e) => setCourse((c) => ({ ...c, summary_en: e.target.value }))}
                disabled={isPublished}
                rows={4}
                className="sm:col-span-2"
              />
              <Field
                label="Duration"
                name="duration"
                value={course.duration || ""}
                onChange={(e) => setCourse((c) => ({ ...c, duration: e.target.value }))}
                disabled={isPublished}
                controlClassName="min-h-12"
              />
              <Field
                label="Language"
                name="language"
                value={course.language || ""}
                onChange={(e) => setCourse((c) => ({ ...c, language: e.target.value }))}
                disabled={isPublished}
                controlClassName="min-h-12"
              />
            </div>
          </Card>

          {activeLecture ? (
            <Card variant="default" padding="lg" rounded="xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Editing lecture · {activeLecture.type}
                  </p>
                  <p className="mt-1 text-sm text-[var(--oman-ink)]/65">
                    Section: {activeLecture.sectionTitle}
                  </p>
                </div>
                {!isPublished ? (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => moveLecture(-1)}>
                      Move up
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => moveLecture(1)}>
                      Move down
                    </Button>
                    <Button type="button" variant="danger" size="sm" onClick={removeActiveLecture}>
                      Remove
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4">
                <Field
                  label="Section title"
                  name="sectionTitle"
                  value={
                    sections.find((s) => s.id === activeLecture.sectionId)?.title ||
                    activeLecture.sectionTitle ||
                    ""
                  }
                  onChange={(e) => renameSection(activeLecture.sectionId, e.target.value)}
                  disabled={isPublished}
                  controlClassName="min-h-12"
                />
                <Field
                  label="Lecture title"
                  name="lectureTitle"
                  value={activeLecture.title_en || activeLecture.title || ""}
                  onChange={(e) =>
                    patchActiveLecture({ title: e.target.value, title_en: e.target.value })
                  }
                  disabled={isPublished}
                  controlClassName="min-h-12"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    as="select"
                    label="Lecture type"
                    name="lectureType"
                    value={activeLecture.type}
                    disabled={isPublished}
                    onChange={(e) => {
                      const type = e.target.value;
                      patchActiveLecture({
                        type,
                        lecture_type: type,
                        quiz:
                          type === "quiz"
                            ? activeLecture.quiz || createBlankQuiz()
                            : activeLecture.quiz,
                      });
                    }}
                    controlClassName="min-h-12"
                  >
                    {LECTURE_TYPE_OPTIONS.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </Field>
                  <Field
                    label="Duration label"
                    name="durationLabel"
                    value={activeLecture.durationLabel || ""}
                    onChange={(e) =>
                      patchActiveLecture({
                        durationLabel: e.target.value,
                        duration_label: e.target.value,
                      })
                    }
                    disabled={isPublished}
                    placeholder="e.g. 12:30"
                    controlClassName="min-h-12"
                  />
                </div>

                <Field
                  as="textarea"
                  label="Lesson text / article"
                  name="body"
                  value={activeLecture.body_en || activeLecture.body || ""}
                  onChange={(e) =>
                    patchActiveLecture({ body: e.target.value, body_en: e.target.value })
                  }
                  disabled={isPublished}
                  rows={6}
                />

                <div className="rounded-2xl border border-dashed border-[rgba(111,49,29,0.2)] bg-[rgba(255,252,247,0.8)] p-4">
                  <p className="text-sm font-semibold">Video</p>
                  <Field
                    label="Video URL (or upload below)"
                    name="videoUrl"
                    value={
                      (activeLecture.video_url || "").startsWith("storage://")
                        ? ""
                        : activeLecture.video_url || ""
                    }
                    onChange={(e) =>
                      patchActiveLecture({ video_url: e.target.value, videoUrl: e.target.value })
                    }
                    disabled={isPublished}
                    placeholder="https://youtube.com/..."
                    className="mt-3"
                    controlClassName="min-h-11"
                    hint={
                      (activeLecture.video_url || "").startsWith("storage://")
                        ? "Uploaded video attached (storage)."
                        : ""
                    }
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold ring-1 ring-[rgba(111,49,29,0.12)]">
                      <input
                        type="file"
                        accept="video/*"
                        disabled={
                          isPublished ||
                          (uploading.lectureId === activeLecture.id && uploading.kind === "video")
                        }
                        className="hidden"
                        onChange={(e) => uploadVideo(e.target.files?.[0])}
                      />
                      {uploading.lectureId === activeLecture.id && uploading.kind === "video"
                        ? "Uploading..."
                        : "Upload video"}
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(activeLecture.is_preview)}
                        disabled={isPublished}
                        onChange={(e) =>
                          patchActiveLecture({
                            is_preview: e.target.checked,
                            isPreview: e.target.checked,
                          })
                        }
                      />
                      Free preview
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(activeLecture.is_published)}
                        disabled={isPublished}
                        onChange={(e) =>
                          patchActiveLecture({
                            is_published: e.target.checked,
                            isPublished: e.target.checked,
                          })
                        }
                      />
                      Include in course
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-[rgba(111,49,29,0.12)] bg-white p-4">
                  <p className="text-sm font-semibold">
                    Resources ({activeLecture.resources?.length || 0})
                  </p>
                  <ul className="mt-3 space-y-2">
                    {(activeLecture.resources || []).map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-[rgba(244,232,214,0.4)] px-3 py-2 text-sm"
                      >
                        <span className="truncate">📎 {file.name}</span>
                        {!isPublished ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-[var(--oman-terracotta)]"
                            onClick={() => removeResource(file.id)}
                          >
                            Remove
                          </button>
                        ) : null}
                      </li>
                    ))}
                    {!activeLecture.resources?.length ? (
                      <li className="text-sm text-[var(--oman-ink)]/55">No files yet.</li>
                    ) : null}
                  </ul>
                  {!isPublished ? (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[rgba(255,252,247,0.9)] px-3 py-2 text-sm font-semibold ring-1 ring-[rgba(111,49,29,0.12)]">
                        <input
                          type="file"
                          disabled={
                            uploading.lectureId === activeLecture.id &&
                            uploading.kind === "resource"
                          }
                          className="hidden"
                          onChange={(e) => uploadResourceFile(e.target.files?.[0])}
                        />
                        {uploading.lectureId === activeLecture.id && uploading.kind === "resource"
                          ? "Uploading..."
                          : "Upload file"}
                      </label>
                      <input
                        value={resourceName}
                        onChange={(e) => setResourceName(e.target.value)}
                        placeholder="Or paste file URL"
                        className="min-h-11 flex-1 rounded-xl border border-[rgba(111,49,29,0.16)] px-3 py-2 text-sm"
                      />
                      <Button type="button" variant="secondary" size="sm" onClick={addNamedResource}>
                        Add URL
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-[rgba(111,49,29,0.12)] bg-[rgba(255,252,247,0.9)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">Lesson quiz</p>
                    {!isPublished ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          patchActiveLecture({
                            quiz: activeLecture.quiz ? null : createBlankQuiz(),
                            type: activeLecture.quiz ? activeLecture.type : "quiz",
                          })
                        }
                      >
                        {activeLecture.quiz ? "Remove quiz" : "Add quiz"}
                      </Button>
                    ) : null}
                  </div>
                  {activeLecture.quiz ? (
                    <div className="mt-4 grid gap-3">
                      <Field
                        label="Quiz title"
                        name="quizTitle"
                        value={activeLecture.quiz.title_en || ""}
                        disabled={isPublished}
                        onChange={(e) =>
                          patchActiveLecture({
                            quiz: { ...activeLecture.quiz, title_en: e.target.value },
                          })
                        }
                        controlClassName="min-h-11"
                      />
                      <Field
                        label="Passing score"
                        name="passScore"
                        type="number"
                        min="0"
                        max="100"
                        value={activeLecture.quiz.passing_score ?? 70}
                        disabled={isPublished}
                        onChange={(e) =>
                          patchActiveLecture({
                            quiz: {
                              ...activeLecture.quiz,
                              passing_score: Number(e.target.value) || 70,
                            },
                          })
                        }
                        controlClassName="min-h-11"
                      />
                      {(activeLecture.quiz.questions || []).map((question, qIndex) => (
                        <div
                          key={question.id}
                          className="rounded-xl border border-[rgba(111,49,29,0.1)] bg-white p-3"
                        >
                          <Field
                            label={`Question ${qIndex + 1}`}
                            name={`q-${question.id}`}
                            value={question.prompt_en || ""}
                            disabled={isPublished}
                            onChange={(e) =>
                              patchActiveLecture({
                                quiz: {
                                  ...activeLecture.quiz,
                                  questions: activeLecture.quiz.questions.map((q) =>
                                    q.id === question.id
                                      ? { ...q, prompt_en: e.target.value }
                                      : q
                                  ),
                                },
                              })
                            }
                            controlClassName="min-h-11"
                          />
                          {(question.options || []).map((option, oIndex) => (
                            <label
                              key={option.id}
                              className="mt-2 flex items-center gap-2 text-sm"
                            >
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={Boolean(option.is_correct)}
                                disabled={isPublished}
                                onChange={() =>
                                  patchActiveLecture({
                                    quiz: {
                                      ...activeLecture.quiz,
                                      questions: activeLecture.quiz.questions.map((q) =>
                                        q.id !== question.id
                                          ? q
                                          : {
                                              ...q,
                                              options: q.options.map((o) => ({
                                                ...o,
                                                is_correct: o.id === option.id,
                                              })),
                                            }
                                      ),
                                    },
                                  })
                                }
                              />
                              <input
                                value={option.option_en || ""}
                                disabled={isPublished}
                                placeholder={`Option ${oIndex + 1}`}
                                className="min-h-10 flex-1 rounded-lg border px-2"
                                onChange={(e) =>
                                  patchActiveLecture({
                                    quiz: {
                                      ...activeLecture.quiz,
                                      questions: activeLecture.quiz.questions.map((q) =>
                                        q.id !== question.id
                                          ? q
                                          : {
                                              ...q,
                                              options: q.options.map((o) =>
                                                o.id === option.id
                                                  ? { ...o, option_en: e.target.value }
                                                  : o
                                              ),
                                            }
                                      ),
                                    },
                                  })
                                }
                              />
                            </label>
                          ))}
                        </div>
                      ))}
                      {!isPublished ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            patchActiveLecture({
                              quiz: {
                                ...activeLecture.quiz,
                                questions: [
                                  ...(activeLecture.quiz.questions || []),
                                  {
                                    id: crypto.randomUUID(),
                                    prompt_en: "",
                                    explanation_en: "",
                                    options: [
                                      {
                                        id: crypto.randomUUID(),
                                        option_en: "",
                                        is_correct: true,
                                      },
                                      {
                                        id: crypto.randomUUID(),
                                        option_en: "",
                                        is_correct: false,
                                      },
                                    ],
                                  },
                                ],
                              },
                            })
                          }
                        >
                          + Add question
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--oman-ink)]/60">No quiz on this lecture.</p>
                  )}
                </div>
              </div>
            </Card>
          ) : null}

          {!isPublished ? (
            <Card variant="default" padding="lg" rounded="xl">
              <h2 className="text-lg font-semibold">Publication</h2>
              <p className="mt-2 text-sm text-[var(--oman-ink)]/70">
                {publishedLectureCount} publishable lecture
                {publishedLectureCount === 1 ? "" : "s"} ready.
              </p>
              <label className="mt-4 flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={publicationConfirmed}
                  onChange={(e) => setPublicationConfirmed(e.target.checked)}
                  className="mt-1"
                />
                I confirm the course content is complete and ready for job seekers.
              </label>
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                loading={publishing}
                disabled={!publicationConfirmed || publishedLectureCount === 0}
                onClick={publish}
              >
                {publishing ? "Publishing..." : "Confirm and publish course"}
              </Button>
            </Card>
          ) : (
            <Card variant="soft" padding="md" rounded="lg">
              <p className="text-sm">
                This course is published. Use{" "}
                <Link to={previewPath} className="font-semibold text-[var(--oman-terracotta)]">
                  student preview
                </Link>{" "}
                to review the learner experience.
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
