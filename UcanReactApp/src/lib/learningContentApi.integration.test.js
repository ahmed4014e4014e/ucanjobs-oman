import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMemorySupabase } from "./memorySupabase.js";
import {
  fetchLearningCourse,
  updateLessonCompletion,
} from "./learningContentApi.js";

const COURSE_ID = "11111111-1111-4111-8111-111111111111";
const SECTION_ID = "22222222-2222-4222-8222-222222222222";
const LESSON_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const LESSON_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const LEARNER_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const ENROLLMENT_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

function seedLearnerFixture() {
  return createMemorySupabase({
    learning_courses: [
      {
        id: COURSE_ID,
        instructor_id: "instructor-1",
        slug: "frontend-verify",
        title_en: "Frontend Verify",
        subtitle_en: "Sub",
        summary_en: "Summary",
        level: "Beginner",
        duration: "4 weeks",
        language: "English",
        price_omr: 10,
        is_published: true,
        publication_status: "published",
      },
    ],
    course_sections: [
      {
        id: SECTION_ID,
        course_id: COURSE_ID,
        title_en: "Module 1",
        sort_order: 1,
      },
    ],
    course_lessons: [
      {
        id: LESSON_A,
        course_id: COURSE_ID,
        section_id: SECTION_ID,
        title_en: "Welcome video",
        body_en: "Intro body",
        video_url: "https://example.com/a.mp4",
        resource_url: null,
        lecture_type: "video",
        duration_label: "5:00",
        sort_order: 1,
        is_preview: true,
        is_published: true,
      },
      {
        id: LESSON_B,
        course_id: COURSE_ID,
        section_id: SECTION_ID,
        title_en: "Article notes",
        body_en: "Read this",
        video_url: null,
        resource_url: null,
        lecture_type: "article",
        duration_label: "3 min",
        sort_order: 2,
        is_preview: false,
        is_published: true,
      },
    ],
    lecture_resources: [
      {
        id: "r1",
        lesson_id: LESSON_A,
        name: "syllabus.pdf",
        file_url: "storage://course-content/syllabus.pdf",
        sort_order: 1,
      },
      {
        id: "r2",
        lesson_id: LESSON_A,
        name: "checklist.pdf",
        file_url: "storage://course-content/checklist.pdf",
        sort_order: 2,
      },
    ],
    course_enrollments: [
      {
        id: ENROLLMENT_ID,
        learner_id: LEARNER_ID,
        course_id: COURSE_ID,
        status: "enrolled",
        progress_percent: 0,
        enrolled_at: "2026-01-01T00:00:00.000Z",
        completed_at: null,
      },
    ],
    lesson_progress: [],
  });
}

describe("shipped learner APIs (fetchLearningCourse + updateLessonCompletion)", () => {
  it("loads sectioned curriculum for an enrolled learner", async () => {
    const client = seedLearnerFixture();

    const result = await fetchLearningCourse({
      slug: "frontend-verify",
      learnerId: LEARNER_ID,
      client,
      fetchPublishedCourseBySlug: async () => ({
        id: COURSE_ID,
        slug: "frontend-verify",
        instructor_id: "instructor-1",
        source: "database",
        en: {
          title: "Frontend Verify",
          subtitle: "Sub",
          summary: "Summary",
        },
      }),
      fetchCourseEnrollment: async ({ learnerId, courseId, client: db }) => {
        const { data } = await db
          .from("course_enrollments")
          .select("id, status, progress_percent, enrolled_at")
          .eq("learner_id", learnerId)
          .eq("course_id", courseId)
          .maybeSingle();
        if (!data) return null;
        return {
          id: data.id,
          status: data.status,
          progressPercent: data.progress_percent ?? 0,
          enrolledAt: data.enrolled_at,
        };
      },
      resolveCourseMediaUrl: async (value) => value || "",
    });

    assert.equal(result.sections.length, 1);
    assert.equal(result.sections[0].title, "Module 1");
    assert.equal(result.lessons.length, 2);
    assert.equal(result.lessons[0].title, "Welcome video");
    assert.equal(result.lessons[0].resources.length, 2);
    assert.equal(result.enrollment.progressPercent, 0);
    assert.equal(result.lessons.every((lesson) => lesson.isComplete === false), true);
  });

  it("completes one lecture, increases progress, and persists completion", async () => {
    const client = seedLearnerFixture();

    const afterComplete = await updateLessonCompletion({
      learnerId: LEARNER_ID,
      courseId: COURSE_ID,
      enrollmentId: ENROLLMENT_ID,
      lessonId: LESSON_A,
      isComplete: true,
      client,
    });

    assert.equal(afterComplete.progressPercent, 50);
    assert.equal(afterComplete.status, "in_progress");

    // Persistence: progress row stored in memory DB
    const { data: progressRows } = await client
      .from("lesson_progress")
      .select("lesson_id")
      .eq("enrollment_id", ENROLLMENT_ID);
    assert.equal(progressRows.length, 1);
    assert.equal(progressRows[0].lesson_id, LESSON_A);

    // Enrollment row updated
    const { data: enrollment } = await client
      .from("course_enrollments")
      .select("progress_percent, status")
      .eq("id", ENROLLMENT_ID)
      .maybeSingle();
    assert.equal(enrollment.progress_percent, 50);
    assert.equal(enrollment.status, "in_progress");

    // Reload via shipped fetchLearningCourse reflects completion
    const reloaded = await fetchLearningCourse({
      slug: "frontend-verify",
      learnerId: LEARNER_ID,
      client,
      fetchPublishedCourseBySlug: async () => ({
        id: COURSE_ID,
        slug: "frontend-verify",
        instructor_id: "instructor-1",
        source: "database",
        en: { title: "Frontend Verify", subtitle: "Sub", summary: "Summary" },
      }),
      fetchCourseEnrollment: async ({ learnerId, courseId, client: db }) => {
        const { data } = await db
          .from("course_enrollments")
          .select("id, status, progress_percent, enrolled_at")
          .eq("learner_id", learnerId)
          .eq("course_id", courseId)
          .maybeSingle();
        return {
          id: data.id,
          status: data.status,
          progressPercent: data.progress_percent ?? 0,
          enrolledAt: data.enrolled_at,
        };
      },
      resolveCourseMediaUrl: async (value) => value || "",
    });

    const completed = reloaded.lessons.filter((lesson) => lesson.isComplete);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].id, LESSON_A);
    assert.equal(reloaded.enrollment.progressPercent, 50);

    // Complete second lecture -> 100%
    const afterAll = await updateLessonCompletion({
      learnerId: LEARNER_ID,
      courseId: COURSE_ID,
      enrollmentId: ENROLLMENT_ID,
      lessonId: LESSON_B,
      isComplete: true,
      client,
    });
    assert.equal(afterAll.progressPercent, 100);
    assert.equal(afterAll.status, "completed");

    const { data: allProgress } = await client
      .from("lesson_progress")
      .select("lesson_id")
      .eq("enrollment_id", ENROLLMENT_ID);
    assert.equal(allProgress.length, 2);
  });

  it("un-completing a lecture decreases persisted progress", async () => {
    const client = seedLearnerFixture();

    await updateLessonCompletion({
      learnerId: LEARNER_ID,
      courseId: COURSE_ID,
      enrollmentId: ENROLLMENT_ID,
      lessonId: LESSON_A,
      isComplete: true,
      client,
    });
    await updateLessonCompletion({
      learnerId: LEARNER_ID,
      courseId: COURSE_ID,
      enrollmentId: ENROLLMENT_ID,
      lessonId: LESSON_B,
      isComplete: true,
      client,
    });

    const afterUndo = await updateLessonCompletion({
      learnerId: LEARNER_ID,
      courseId: COURSE_ID,
      enrollmentId: ENROLLMENT_ID,
      lessonId: LESSON_A,
      isComplete: false,
      client,
    });

    assert.equal(afterUndo.progressPercent, 50);
    const { data: progressRows } = await client
      .from("lesson_progress")
      .select("lesson_id")
      .eq("enrollment_id", ENROLLMENT_ID);
    assert.equal(progressRows.length, 1);
    assert.equal(progressRows[0].lesson_id, LESSON_B);
  });
});
