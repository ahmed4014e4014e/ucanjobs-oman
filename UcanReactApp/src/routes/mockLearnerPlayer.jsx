import { useMemo, useState } from "react";
import { Button, Card } from "../components/ui";
import { Page, SiteFooter } from "../components/layout";
import CurriculumSidebar from "../components/domain/CurriculumSidebar";
import LecturePlayerPanel from "../components/domain/LecturePlayerPanel";
import {
  countCurriculumStats,
  createInitialLearnerCurriculum,
  flattenLectures,
  mockCourseMeta,
} from "../lib/mockCourseExperience";

export default function MockLearnerPlayer() {
  const [sections, setSections] = useState(() => createInitialLearnerCurriculum());
  const [activeLectureId, setActiveLectureId] = useState(() => {
    const flat = flattenLectures(createInitialLearnerCurriculum());
    const resume = flat.find((item) => !item.isComplete) || flat[0];
    return resume?.id || "";
  });

  const flat = useMemo(() => flattenLectures(sections), [sections]);
  const stats = useMemo(() => countCurriculumStats(sections), [sections]);
  const activeIndex = flat.findIndex((item) => item.id === activeLectureId);
  const activeLecture = activeIndex >= 0 ? flat[activeIndex] : flat[0];
  const progressPercent =
    stats.lectureCount > 0
      ? Math.round((stats.completedCount / stats.lectureCount) * 100)
      : 0;

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
  };

  const toggleComplete = () => {
    if (!activeLecture) return;
    setSections((current) =>
      current.map((section) => ({
        ...section,
        lectures: section.lectures.map((lecture) =>
          lecture.id === activeLecture.id
            ? { ...lecture, isComplete: !lecture.isComplete }
            : lecture
        ),
      }))
    );
  };

  const goRelative = (delta) => {
    const next = flat[activeIndex + delta];
    if (next) selectLecture(next.id);
  };

  return (
    <Page className="bg-[#1a1410]">
      {/* Compact player chrome */}
      <div className="border-b border-white/10 bg-[#241a16] pt-20 text-white sm:pt-22">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--oman-brass)]">
              UI mock · Job seeker player
            </p>
            <h1 className="truncate text-lg font-bold sm:text-xl">{mockCourseMeta.title}</h1>
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
            <Button to="/mock/course-experience/" variant="ghost" size="sm" className="!text-white !border-white/20">
              Mock hub
            </Button>
            <Button to="/mock/instructor-course-kit/" variant="secondary" size="sm">
              Instructor kit
            </Button>
            <Button to="/learner-dashboard/" variant="primary" size="sm">
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[minmax(17rem,22rem)_1fr]">
        {/* Sidebar column */}
        <div className="min-h-[70vh] border-r border-[rgba(111,49,29,0.1)] bg-[rgba(247,239,223,0.98)] lg:min-h-[calc(100vh-8rem)]">
          <div className="sticky top-20 flex h-[calc(100vh-5.5rem)] flex-col p-3 sm:p-4">
            <Card variant="soft" padding="sm" rounded="lg" className="mb-3 shrink-0">
              <p className="text-xs font-semibold text-[var(--oman-ink)]/70">Your progress</p>
              <p className="mt-1 text-sm font-semibold text-[var(--oman-ink)]">
                {stats.completedCount} of {stats.lectureCount} lectures complete
              </p>
              <p className="mt-1 text-xs text-[var(--oman-ink)]/55">
                {stats.sectionCount} sections · continue where you left off
              </p>
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

        {/* Player column */}
        <div className="min-w-0 bg-[linear-gradient(180deg,#f7efdf_0%,#efe1c9_100%)] px-4 py-5 sm:px-6 sm:py-6">
          <LecturePlayerPanel
            lecture={activeLecture}
            sectionTitle={activeLecture?.sectionTitle}
            onPrev={() => goRelative(-1)}
            onNext={() => goRelative(1)}
            onToggleComplete={toggleComplete}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex >= 0 && activeIndex < flat.length - 1}
            mockMode
          />

          <Card variant="outline" padding="md" rounded="lg" className="mt-4 bg-white/70">
            <p className="text-sm leading-6 text-[var(--oman-ink)]/80">
              <strong>Mock player notes:</strong> video stage is a placeholder; downloads and quiz
              are interactive in-memory only. After you approve this layout, Schema/API will load
              real sections, signed video URLs, multi-file resources, and lesson progress from
              Supabase.
            </p>
          </Card>
        </div>
      </div>

      <div className="bg-[#f7efdf]">
        <SiteFooter />
      </div>
    </Page>
  );
}
