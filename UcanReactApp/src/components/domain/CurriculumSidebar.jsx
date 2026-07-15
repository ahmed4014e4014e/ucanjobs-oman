const TYPE_META = {
  video: { label: "Video", icon: "▶" },
  article: { label: "Article", icon: "¶" },
  quiz: { label: "Quiz", icon: "?" },
  resources: { label: "Resources", icon: "📎" },
};

function lectureTypeMeta(type) {
  return TYPE_META[type] || TYPE_META.video;
}

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Udemy-style curriculum sidebar (sections → lectures).
 * Works for learner player and instructor preview.
 */
export default function CurriculumSidebar({
  sections,
  activeLectureId,
  onSelectLecture,
  onToggleSection,
  mode = "learner",
  className = "",
}) {
  return (
    <aside
      className={joinClasses(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-[1.25rem] border border-[rgba(111,49,29,0.12)] bg-[rgba(255,250,244,0.96)]",
        className
      )}
    >
      <div className="border-b border-[rgba(111,49,29,0.1)] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
          Curriculum
        </p>
        <p className="mt-1 text-sm text-[var(--oman-ink)]/70">
          {mode === "instructor" ? "Click a lecture to edit" : "Click a lecture to open"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {sections.map((section, sectionIndex) => {
          const completedInSection = section.lectures.filter((l) => l.isComplete).length;

          return (
            <div key={section.id} className="mb-2">
              <button
                type="button"
                onClick={() => onToggleSection?.(section.id)}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left transition hover:bg-[rgba(197,154,68,0.1)]"
              >
                <span className="min-w-0">
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                    Section {sectionIndex + 1}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-[var(--oman-ink)]">
                    {section.title}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-[var(--oman-ink)]/55">
                  {mode === "learner" ? `${completedInSection}/${section.lectures.length}` : ""}{" "}
                  {section.expanded ? "▾" : "▸"}
                </span>
              </button>

              {section.expanded ? (
                <ol className="space-y-1 pb-2 pl-1">
                  {section.lectures.map((lecture, lectureIndex) => {
                    const type = lectureTypeMeta(lecture.type || lecture.lecture_type);
                    const isActive = lecture.id === activeLectureId;
                    const title = lecture.title || lecture.title_en || "Lecture";
                    const isPreview = lecture.isPreview || lecture.is_preview;
                    const duration =
                      lecture.durationLabel || lecture.duration_label || "";

                    return (
                      <li key={lecture.id}>
                        <button
                          type="button"
                          onClick={() => onSelectLecture?.(lecture.id)}
                          disabled={lecture.isLocked && mode === "learner"}
                          className={joinClasses(
                            "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                            isActive
                              ? "bg-[rgba(197,154,68,0.18)] ring-1 ring-[rgba(197,154,68,0.35)]"
                              : "hover:bg-white",
                            lecture.isLocked && mode === "learner" ? "opacity-60" : ""
                          )}
                        >
                          <span
                            className={joinClasses(
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold",
                              lecture.isComplete
                                ? "bg-[var(--oman-olive)] text-white"
                                : "bg-[rgba(111,49,29,0.08)] text-[var(--oman-ink)]/70"
                            )}
                            aria-hidden="true"
                          >
                            {lecture.isComplete ? "✓" : lectureIndex + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--oman-terracotta-dark)]">
                                {type.icon} {type.label}
                              </span>
                              {isPreview ? (
                                <span className="rounded-full bg-[rgba(82,101,74,0.12)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase text-[var(--oman-olive)]">
                                  Preview
                                </span>
                              ) : null}
                              {lecture.isLocked ? (
                                <span className="text-[0.65rem] text-[var(--oman-ink)]/50">Locked</span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-sm font-medium leading-5 text-[var(--oman-ink)]">
                              {title}
                            </span>
                            <span className="mt-0.5 block text-xs text-[var(--oman-ink)]/55">
                              {duration}
                              {lecture.resources?.length
                                ? ` · ${lecture.resources.length} file${lecture.resources.length === 1 ? "" : "s"}`
                                : ""}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
