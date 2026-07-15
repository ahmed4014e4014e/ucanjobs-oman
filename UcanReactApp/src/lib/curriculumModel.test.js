import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCurriculumFromRows,
  calculateCurriculumProgress,
  countCurriculumStats,
  curriculumSnapshot,
  flattenCurriculum,
  normalizeLectureType,
  roundTripCurriculum,
  serializeCurriculumForSave,
} from "./curriculumModel.js";

describe("curriculumModel", () => {
  it("normalizes lecture types", () => {
    assert.equal(normalizeLectureType("video"), "video");
    assert.equal(normalizeLectureType("ARTICLE"), "article");
    assert.equal(normalizeLectureType("unknown"), "video");
  });

  it("builds ordered sections with multi resources from flat rows", () => {
    const sectionA = "11111111-1111-1111-1111-111111111111";
    const sectionB = "22222222-2222-2222-2222-222222222222";
    const lesson1 = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const lesson2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
    const lesson3 = "cccccccc-cccc-cccc-cccc-cccccccccccc";

    const sections = buildCurriculumFromRows({
      sections: [
        { id: sectionB, title_en: "Module 2", sort_order: 2 },
        { id: sectionA, title_en: "Module 1", sort_order: 1 },
      ],
      lessons: [
        {
          id: lesson2,
          section_id: sectionA,
          title_en: "Second lecture",
          lecture_type: "article",
          sort_order: 2,
          is_preview: false,
          is_published: true,
        },
        {
          id: lesson1,
          section_id: sectionA,
          title_en: "First lecture",
          lecture_type: "video",
          sort_order: 1,
          is_preview: true,
          is_published: true,
          video_url: "storage://course-content/a.mp4",
        },
        {
          id: lesson3,
          section_id: sectionB,
          title_en: "Quiz lecture",
          lecture_type: "quiz",
          sort_order: 1,
          is_published: true,
        },
      ],
      resources: [
        {
          id: "r2",
          lesson_id: lesson1,
          name: "b.pdf",
          file_url: "storage://course-content/b.pdf",
          sort_order: 2,
        },
        {
          id: "r1",
          lesson_id: lesson1,
          name: "a.pdf",
          file_url: "storage://course-content/a.pdf",
          sort_order: 1,
        },
      ],
      quizzesByLessonId: {
        [lesson3]: {
          id: "q1",
          title_en: "Check",
          passing_score: 70,
          questions: [],
        },
      },
    });

    assert.equal(sections.length, 2);
    assert.equal(sections[0].title, "Module 1");
    assert.equal(sections[0].lectures.length, 2);
    assert.equal(sections[0].lectures[0].title, "First lecture");
    assert.equal(sections[0].lectures[0].resources.length, 2);
    assert.equal(sections[0].lectures[0].resources[0].name, "a.pdf");
    assert.equal(sections[1].title, "Module 2");
    assert.equal(sections[1].lectures[0].type, "quiz");
    assert.ok(sections[1].lectures[0].quiz);

    const flat = flattenCurriculum(sections);
    assert.deepEqual(
      flat.map((item) => item.title),
      ["First lecture", "Second lecture", "Quiz lecture"]
    );
  });

  it("round-trips section titles, order, types, and resource counts", () => {
    const sectionId = "33333333-3333-3333-3333-333333333333";
    const original = [
      {
        id: sectionId,
        title: "Getting started",
        title_en: "Getting started",
        lectures: [
          {
            id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
            type: "video",
            title: "Welcome",
            title_en: "Welcome",
            body_en: "Hello",
            video_url: "https://example.com/v.mp4",
            is_preview: true,
            is_published: true,
            resources: [
              {
                id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
                name: "syllabus.pdf",
                file_url: "storage://course-content/syllabus.pdf",
              },
              {
                id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
                name: "checklist.pdf",
                file_url: "storage://course-content/checklist.pdf",
              },
            ],
            quiz: null,
          },
          {
            id: "99999999-9999-9999-9999-999999999999",
            type: "article",
            title: "Setup notes",
            title_en: "Setup notes",
            body_en: "Install tools",
            is_published: true,
            resources: [],
            quiz: null,
          },
        ],
      },
    ];

    const { sectionPayload, lessonPayload, resourcePayload } =
      serializeCurriculumForSave(original);

    assert.equal(sectionPayload.length, 1);
    assert.equal(lessonPayload.length, 2);
    assert.equal(resourcePayload.length, 2);
    assert.equal(lessonPayload[0].lecture_type, "video");
    assert.equal(lessonPayload[1].lecture_type, "article");
    assert.equal(lessonPayload[0].is_preview, true);

    const rebuilt = roundTripCurriculum(original);
    assert.deepEqual(curriculumSnapshot(rebuilt), curriculumSnapshot(original));
  });

  it("migrates flat legacy lessons into a default Main section", () => {
    const sections = buildCurriculumFromRows({
      sections: [],
      lessons: [
        {
          id: "l1",
          title_en: "Legacy A",
          sort_order: 1,
          resource_url: "https://files.example/a.pdf",
          is_published: true,
        },
        {
          id: "l2",
          title_en: "Legacy B",
          sort_order: 2,
          is_published: true,
        },
      ],
      resources: [],
    });

    assert.equal(sections.length, 1);
    assert.equal(sections[0].title, "Main");
    assert.equal(sections[0].lectures.length, 2);
    assert.equal(sections[0].lectures[0].resources.length, 1);
  });

  it("calculates progress from completed lectures", () => {
    const lectures = [
      { isComplete: true },
      { isComplete: false },
      { isComplete: true },
      { isComplete: false },
    ];
    assert.equal(calculateCurriculumProgress(lectures), 50);
    assert.equal(calculateCurriculumProgress([]), 0);
  });

  it("counts curriculum stats", () => {
    const stats = countCurriculumStats([
      {
        lectures: [
          { type: "video", resources: [{}, {}], isComplete: true },
          { type: "quiz", quiz: {}, resources: [], isComplete: false },
        ],
      },
    ]);
    assert.equal(stats.sectionCount, 1);
    assert.equal(stats.lectureCount, 2);
    assert.equal(stats.videoCount, 1);
    assert.equal(stats.quizCount, 1);
    assert.equal(stats.resourceCount, 2);
    assert.equal(stats.completedCount, 1);
  });
});
