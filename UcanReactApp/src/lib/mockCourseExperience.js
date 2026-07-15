/**
 * Static demo data for Udemy-style course kit + learner player UI mocks.
 * Replace with schema/API in a later phase — keep shapes close to the target model.
 */

export const mockCourseMeta = {
  id: "mock-course-1",
  title: "Frontend Engineering For Junior Roles",
  subtitle: "HTML, CSS, JavaScript, React, and portfolio projects",
  summary:
    "A practical frontend path for graduates who need stronger web skills before applying for junior software roles in Oman.",
  level: "Beginner to Intermediate",
  duration: "8 weeks",
  language: "English",
  priceLabel: "12 OMR",
  progressPercent: 38,
  instructorName: "Demo Instructor",
};

export const LECTURE_TYPES = [
  { id: "video", label: "Video", icon: "▶" },
  { id: "article", label: "Article", icon: "¶" },
  { id: "quiz", label: "Quiz", icon: "?" },
  { id: "resources", label: "Resources", icon: "📎" },
];

export function lectureTypeMeta(type) {
  return LECTURE_TYPES.find((item) => item.id === type) || LECTURE_TYPES[0];
}

/** Initial curriculum for instructor mock (editable in UI state). */
export function createInitialInstructorCurriculum() {
  return [
    {
      id: "sec-1",
      title: "Getting started",
      expanded: true,
      lectures: [
        {
          id: "lec-1",
          type: "video",
          title: "Welcome and course roadmap",
          durationLabel: "6:20",
          isPreview: true,
          isPublished: true,
          body:
            "Welcome to the course. In this lecture we outline the journey from basic HTML to a deployable React portfolio project.",
          videoLabel: "welcome-roadmap.mp4",
          resources: [
            { id: "res-1", name: "Course syllabus.pdf" },
            { id: "res-2", name: "Setup checklist.pdf" },
          ],
          quiz: null,
        },
        {
          id: "lec-2",
          type: "article",
          title: "How to set up your tools",
          durationLabel: "8 min read",
          isPreview: true,
          isPublished: true,
          body:
            "Install VS Code, Node.js, and Git. Create a GitHub account and a practice folder for this course.",
          videoLabel: "",
          resources: [{ id: "res-3", name: "tool-links.txt" }],
          quiz: null,
        },
      ],
    },
    {
      id: "sec-2",
      title: "HTML & CSS foundations",
      expanded: true,
      lectures: [
        {
          id: "lec-3",
          type: "video",
          title: "Semantic HTML in practice",
          durationLabel: "14:05",
          isPreview: false,
          isPublished: true,
          body: "Build a clean landing page structure with semantic tags.",
          videoLabel: "semantic-html.mp4",
          resources: [{ id: "res-4", name: "starter-html.zip" }],
          quiz: null,
        },
        {
          id: "lec-4",
          type: "video",
          title: "Responsive layout with Flexbox",
          durationLabel: "18:40",
          isPreview: false,
          isPublished: true,
          body: "Create responsive cards and navigation using Flexbox.",
          videoLabel: "flexbox-layout.mp4",
          resources: [],
          quiz: null,
        },
        {
          id: "lec-5",
          type: "quiz",
          title: "HTML & CSS check",
          durationLabel: "5 questions",
          isPreview: false,
          isPublished: true,
          body: "Check your understanding before moving to JavaScript.",
          videoLabel: "",
          resources: [],
          quiz: {
            title: "HTML & CSS check",
            passingScore: 70,
            questions: [
              {
                id: "q1",
                prompt: "Which tag is best for the main page content?",
                options: [
                  { id: "a", text: "<main>", correct: true },
                  { id: "b", text: "<span>", correct: false },
                  { id: "c", text: "<bold>", correct: false },
                ],
              },
              {
                id: "q2",
                prompt: "Flexbox is mainly used for…",
                options: [
                  { id: "a", text: "One-dimensional layouts", correct: true },
                  { id: "b", text: "Database queries", correct: false },
                  { id: "c", text: "Server authentication", correct: false },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: "sec-3",
      title: "JavaScript & React",
      expanded: false,
      lectures: [
        {
          id: "lec-6",
          type: "video",
          title: "JavaScript essentials for UI work",
          durationLabel: "22:10",
          isPreview: false,
          isPublished: true,
          body: "Arrays, objects, functions, and DOM basics for frontend developers.",
          videoLabel: "js-essentials.mp4",
          resources: [{ id: "res-5", name: "js-exercises.md" }],
          quiz: null,
        },
        {
          id: "lec-7",
          type: "video",
          title: "Your first React components",
          durationLabel: "19:55",
          isPreview: false,
          isPublished: true,
          body: "Create components, props, and simple state.",
          videoLabel: "react-components.mp4",
          resources: [{ id: "res-6", name: "react-starter.zip" }],
          quiz: null,
        },
        {
          id: "lec-8",
          type: "resources",
          title: "Project assets pack",
          durationLabel: "3 files",
          isPreview: false,
          isPublished: true,
          body: "Download the design assets and API mock data for the portfolio project.",
          videoLabel: "",
          resources: [
            { id: "res-7", name: "figma-export.zip" },
            { id: "res-8", name: "mock-api.json" },
            { id: "res-9", name: "rubric.pdf" },
          ],
          quiz: null,
        },
      ],
    },
  ];
}

/** Learner mock: same curriculum + completion flags. */
export function createInitialLearnerCurriculum() {
  const sections = createInitialInstructorCurriculum().map((section) => ({
    ...section,
    expanded: true,
    lectures: section.lectures.map((lecture, index) => ({
      ...lecture,
      isComplete: index === 0 || lecture.id === "lec-2",
      isLocked: false,
    })),
  }));

  // Lock non-preview after first incomplete for demo of lock UI on a couple items
  // Keep all unlocked for enrolled demo except we show lock icon style on none
  return sections;
}

export function flattenLectures(sections) {
  return sections.flatMap((section) =>
    section.lectures.map((lecture) => ({
      ...lecture,
      sectionId: section.id,
      sectionTitle: section.title,
    }))
  );
}

export function countCurriculumStats(sections) {
  const lectures = flattenLectures(sections);
  return {
    sectionCount: sections.length,
    lectureCount: lectures.length,
    videoCount: lectures.filter((item) => item.type === "video").length,
    quizCount: lectures.filter((item) => item.type === "quiz" || item.quiz).length,
    resourceCount: lectures.reduce((sum, item) => sum + (item.resources?.length || 0), 0),
    completedCount: lectures.filter((item) => item.isComplete).length,
  };
}
