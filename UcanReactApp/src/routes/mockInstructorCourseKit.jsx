import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Field } from "../components/ui";
import { Page, SiteFooter } from "../components/layout";
import CurriculumSidebar from "../components/domain/CurriculumSidebar";
import {
  LECTURE_TYPES,
  countCurriculumStats,
  createInitialInstructorCurriculum,
  flattenLectures,
  lectureTypeMeta,
  mockCourseMeta,
} from "../lib/mockCourseExperience";

function newId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function blankLecture(type = "video") {
  return {
    id: newId("lec"),
    type,
    title: type === "quiz" ? "New quiz" : "New lecture",
    durationLabel: type === "video" ? "0:00" : type === "article" ? "3 min read" : "—",
    isPreview: false,
    isPublished: true,
    body: "",
    videoLabel: type === "video" ? "" : "",
    resources: [],
    quiz:
      type === "quiz"
        ? {
            title: "New quiz",
            passingScore: 70,
            questions: [
              {
                id: newId("q"),
                prompt: "Sample question?",
                options: [
                  { id: newId("o"), text: "Option A", correct: true },
                  { id: newId("o"), text: "Option B", correct: false },
                ],
              },
            ],
          }
        : null,
  };
}

function blankSection() {
  return {
    id: newId("sec"),
    title: "New section",
    expanded: true,
    lectures: [blankLecture("video")],
  };
}

export default function MockInstructorCourseKit() {
  const [courseTitle, setCourseTitle] = useState(mockCourseMeta.title);
  const [courseSummary, setCourseSummary] = useState(mockCourseMeta.summary);
  const [sections, setSections] = useState(() => createInitialInstructorCurriculum());
  const [activeLectureId, setActiveLectureId] = useState(
    () => createInitialInstructorCurriculum()[0]?.lectures[0]?.id || ""
  );
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });
  const [resourceName, setResourceName] = useState("");

  const flat = useMemo(() => flattenLectures(sections), [sections]);
  const stats = useMemo(() => countCurriculumStats(sections), [sections]);
  const activeLecture = flat.find((item) => item.id === activeLectureId) || flat[0] || null;

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
          lecture.id === activeLecture.id ? { ...lecture, ...patch } : lecture
        ),
      }))
    );
  };

  const addSection = () => {
    const section = blankSection();
    updateSections((current) => [...current, section]);
    setActiveLectureId(section.lectures[0].id);
    setFeedback({ type: "success", message: "Section added (mock — not saved to database)." });
  };

  const addLecture = (type) => {
    if (!activeLecture) {
      addSection();
      return;
    }
    const lecture = blankLecture(type);
    updateSections((current) =>
      current.map((section) =>
        section.id === activeLecture.sectionId
          ? { ...section, expanded: true, lectures: [...section.lectures, lecture] }
          : section
      )
    );
    setActiveLectureId(lecture.id);
    setFeedback({ type: "success", message: `${lectureTypeMeta(type).label} lecture added (mock).` });
  };

  const removeActiveLecture = () => {
    if (!activeLecture) return;
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
      nextActiveId = flattenLectures(next)[0]?.id || "";
      return next;
    });
    setActiveLectureId(nextActiveId);
    setFeedback({ type: "info", message: "Lecture removed from mock curriculum." });
  };

  const moveLecture = (direction) => {
    if (!activeLecture) return;
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

  const addResource = () => {
    const name = resourceName.trim();
    if (!name || !activeLecture) return;
    patchActiveLecture({
      resources: [...(activeLecture.resources || []), { id: newId("res"), name }],
    });
    setResourceName("");
    setFeedback({ type: "success", message: "Resource attached to lecture (mock)." });
  };

  const removeResource = (resourceId) => {
    if (!activeLecture) return;
    patchActiveLecture({
      resources: (activeLecture.resources || []).filter((item) => item.id !== resourceId),
    });
  };

  const renameSection = (sectionId, title) => {
    updateSections((current) =>
      current.map((section) => (section.id === sectionId ? { ...section, title } : section))
    );
  };

  return (
    <Page className="bg-[linear-gradient(180deg,#f7efdf_0%,#f2e3cc_100%)]">
      {/* Top bar */}
      <div className="border-b border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.95)] pt-20 backdrop-blur sm:pt-22">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]">
              UI mock · Instructor course kit
            </p>
            <h1 className="mt-1 text-xl font-bold text-[var(--oman-ink)] sm:text-2xl">
              {courseTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--oman-ink)]/65">
              {stats.sectionCount} sections · {stats.lectureCount} lectures · {stats.videoCount}{" "}
              videos · {stats.resourceCount} files
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button to="/mock/course-experience/" variant="ghost" size="sm">
              Mock hub
            </Button>
            <Button to="/mock/learn-player/" variant="secondary" size="sm">
              Preview as student
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() =>
                setFeedback({
                  type: "info",
                  message: "Save is mock-only. Schema/API phase will persist this curriculum.",
                })
              }
            >
              Save draft (mock)
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(16rem,20rem)_1fr] lg:gap-6 lg:py-8">
        {/* Curriculum tree */}
        <div className="flex min-h-[70vh] flex-col gap-3">
          <CurriculumSidebar
            sections={sections}
            activeLectureId={activeLecture?.id}
            onSelectLecture={setActiveLectureId}
            onToggleSection={toggleSection}
            mode="instructor"
            className="min-h-[28rem] flex-1"
          />
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" fullWidth size="sm" onClick={addSection}>
              + Add section
            </Button>
            <div className="grid grid-cols-2 gap-2">
              {LECTURE_TYPES.map((type) => (
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
        </div>

        {/* Editor */}
        <div className="min-w-0 space-y-4">
          <Alert
            type={feedback.type}
            message={feedback.message}
            title="Course kit mock"
            className={!feedback.message ? "hidden" : ""}
          />

          <Card variant="default" padding="lg" rounded="xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
              Course details
            </p>
            <div className="mt-4 grid gap-4">
              <Field
                label="Course title"
                name="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                controlClassName="min-h-12"
              />
              <Field
                as="textarea"
                label="Summary"
                name="courseSummary"
                value={courseSummary}
                onChange={(e) => setCourseSummary(e.target.value)}
                rows={3}
              />
            </div>
          </Card>

          {activeLecture ? (
            <Card variant="default" padding="lg" rounded="xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Editing lecture · {lectureTypeMeta(activeLecture.type).label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--oman-ink)]/65">
                    Section: {activeLecture.sectionTitle}
                  </p>
                </div>
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
              </div>

              <div className="mt-5 grid gap-4">
                <Field
                  label="Section title"
                  name="sectionTitle"
                  value={
                    sections.find((s) => s.id === activeLecture.sectionId)?.title || ""
                  }
                  onChange={(e) => renameSection(activeLecture.sectionId, e.target.value)}
                  controlClassName="min-h-12"
                />
                <Field
                  label="Lecture title"
                  name="lectureTitle"
                  value={activeLecture.title}
                  onChange={(e) => patchActiveLecture({ title: e.target.value })}
                  controlClassName="min-h-12"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    as="select"
                    label="Lecture type"
                    name="lectureType"
                    value={activeLecture.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      patchActiveLecture({
                        type,
                        quiz:
                          type === "quiz"
                            ? activeLecture.quiz || blankLecture("quiz").quiz
                            : activeLecture.quiz,
                      });
                    }}
                    controlClassName="min-h-12"
                  >
                    {LECTURE_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </Field>
                  <Field
                    label="Duration label"
                    name="duration"
                    value={activeLecture.durationLabel}
                    onChange={(e) => patchActiveLecture({ durationLabel: e.target.value })}
                    placeholder="e.g. 12:30 or 5 min read"
                    controlClassName="min-h-12"
                  />
                </div>

                <Field
                  as="textarea"
                  label="Lesson text / article"
                  name="body"
                  value={activeLecture.body}
                  onChange={(e) => patchActiveLecture({ body: e.target.value })}
                  rows={5}
                  hint="Later: rich text editor (headings, lists, code, images)."
                />

                {(activeLecture.type === "video" || activeLecture.videoLabel !== undefined) && (
                  <div className="rounded-2xl border border-dashed border-[rgba(111,49,29,0.2)] bg-[rgba(255,252,247,0.8)] p-4">
                    <p className="text-sm font-semibold text-[var(--oman-ink)]">Video</p>
                    <p className="mt-1 text-xs text-[var(--oman-ink)]/60">
                      Upload UI mock — file stays local until storage API is connected.
                    </p>
                    <Field
                      label="Video file name or URL label"
                      name="videoLabel"
                      value={activeLecture.videoLabel || ""}
                      onChange={(e) => patchActiveLecture({ videoLabel: e.target.value })}
                      placeholder="lecture-01.mp4 or YouTube URL"
                      className="mt-3"
                      controlClassName="min-h-11"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" variant="ghost" size="sm" disabled>
                        Upload video (API later)
                      </Button>
                      <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-[rgba(111,49,29,0.12)]">
                        <input
                          type="checkbox"
                          checked={Boolean(activeLecture.isPreview)}
                          onChange={(e) => patchActiveLecture({ isPreview: e.target.checked })}
                        />
                        Free preview
                      </label>
                    </div>
                  </div>
                )}

                {/* Multi resources */}
                <div className="rounded-2xl border border-[rgba(111,49,29,0.12)] bg-white p-4">
                  <p className="text-sm font-semibold text-[var(--oman-ink)]">
                    Resources ({activeLecture.resources?.length || 0})
                  </p>
                  <p className="mt-1 text-xs text-[var(--oman-ink)]/60">
                    Udemy-style multi-file downloads per lecture.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {(activeLecture.resources || []).map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-[rgba(244,232,214,0.4)] px-3 py-2 text-sm"
                      >
                        <span className="truncate">📎 {file.name}</span>
                        <button
                          type="button"
                          className="text-xs font-semibold text-[var(--oman-terracotta)]"
                          onClick={() => removeResource(file.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                    {!activeLecture.resources?.length ? (
                      <li className="text-sm text-[var(--oman-ink)]/55">No files yet.</li>
                    ) : null}
                  </ul>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      placeholder="e.g. slides.pdf"
                      className="min-h-11 flex-1 rounded-xl border border-[rgba(111,49,29,0.16)] px-3 py-2 text-sm"
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={addResource}>
                      Add file (mock)
                    </Button>
                  </div>
                </div>

                {activeLecture.quiz ? (
                  <div className="rounded-2xl border border-[rgba(111,49,29,0.12)] bg-[rgba(255,252,247,0.9)] p-4">
                    <p className="text-sm font-semibold">Quiz preview</p>
                    <p className="mt-1 text-sm text-[var(--oman-ink)]/70">
                      {activeLecture.quiz.title} · pass {activeLecture.quiz.passingScore}% ·{" "}
                      {activeLecture.quiz.questions?.length || 0} questions
                    </p>
                    <p className="mt-2 text-xs text-[var(--oman-ink)]/55">
                      Full question editor already exists in live kit; this mock focuses on
                      curriculum structure.
                    </p>
                  </div>
                ) : null}
              </div>
            </Card>
          ) : (
            <Card variant="default" padding="lg" rounded="xl">
              <p className="text-[var(--oman-ink)]/70">Add a section to start building the curriculum.</p>
            </Card>
          )}

          <Card variant="soft" padding="md" rounded="lg">
            <p className="text-sm leading-6 text-[var(--oman-ink)]/80">
              This screen is a <strong>UI target</strong>. When you approve it, the next step is
              schema for sections, multi resources, and lecture types — then connect this editor to
              real save/publish APIs.{" "}
              <Link to="/mock/learn-player/" className="font-semibold text-[var(--oman-terracotta)]">
                Open student player mock →
              </Link>
            </p>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </Page>
  );
}
