import {
  fetchCourseEnrollment,
  fetchPublishedCourseBySlug,
  updateCourseProgress,
} from "./courseApi.js";
import {
  buildCurriculumFromRows,
  calculateCurriculumProgress,
  collectCurriculumResources,
  flattenCurriculum,
} from "./curriculumModel.js";
import {
  selectCourseLessons,
  selectCourseSections,
  selectLectureResources,
} from "./curriculumDb.js";
import { isSupabaseConfigured, supabase } from "./supabase.js";
import { resolveCourseMediaUrl } from "./courseMediaApi.js";

// Re-export for consumers / tests that import from this module
export { collectCurriculumResources };

function requireClient(client) {
  const db = client || supabase;
  if (!db || (!client && !isSupabaseConfigured)) {
    throw new Error("database is not configured yet.");
  }
  return db;
}

async function loadCourseCurriculumRows(
  courseId,
  { publishedOnly = true, previewOnly = false } = {},
  client = supabase
) {
  const [sectionResult, lessonResult] = await Promise.all([
    selectCourseSections(client, courseId),
    selectCourseLessons(client, courseId, { publishedOnly, previewOnly }),
  ]);

  if (sectionResult.error) throw sectionResult.error;
  if (lessonResult.error) throw lessonResult.error;

  const lessons = lessonResult.data ?? [];
  const lessonIds = lessons.map((lesson) => lesson.id);
  const resourceResult = await selectLectureResources(client, lessonIds);
  if (resourceResult.error) throw resourceResult.error;

  return {
    sections: sectionResult.available === false ? [] : sectionResult.data,
    lessons,
    resources: resourceResult.data,
  };
}

async function resolveLectureMedia(lecture, resolveMedia = resolveCourseMediaUrl) {
  const videoUrl = lecture.videoUrl || lecture.video_url || "";
  const resources = await Promise.all(
    (lecture.resources || []).map(async (resource) => {
      const fileUrl = resource.fileUrl || resource.file_url || "";
      const resolved = fileUrl ? await resolveMedia(fileUrl) : "";
      return {
        ...resource,
        fileUrl: resolved,
        file_url: fileUrl,
        resolvedUrl: resolved,
      };
    })
  );

  let resourceUrl = lecture.resourceUrl || lecture.resource_url || "";
  if (!resources.length && resourceUrl) {
    const resolved = await resolveMedia(resourceUrl);
    resources.push({
      id: `legacy-${lecture.id}`,
      name: resourceUrl.split("/").pop() || "Resource",
      fileUrl: resolved,
      file_url: resourceUrl,
      resolvedUrl: resolved,
    });
  }

  return {
    ...lecture,
    videoIsUpload: videoUrl.startsWith("storage://"),
    videoUrl: videoUrl ? await resolveMedia(videoUrl) : "",
    video_url: videoUrl,
    resourceUrl:
      resources[0]?.resolvedUrl ||
      (resourceUrl ? await resolveMedia(resourceUrl) : ""),
    resources,
  };
}

/**
 * Public curriculum outline for course detail (published course).
 */
export async function fetchPublicCourseCurriculum(slug, deps = {}) {
  const client = requireClient(deps.client);
  const loadCourse = deps.fetchPublishedCourseBySlug || fetchPublishedCourseBySlug;
  const resolveMedia = deps.resolveCourseMediaUrl || resolveCourseMediaUrl;

  const course = await loadCourse(slug);
  if (!course || course.source !== "database") {
    return { course, sections: [], lectures: [], freePreviewLectures: [] };
  }

  const rows = await loadCourseCurriculumRows(
    course.id,
    { publishedOnly: true },
    client
  );
  const sections = buildCurriculumFromRows(rows);

  const publicSections = sections.map((section) => ({
    ...section,
    lectures: section.lectures.map((lecture) => {
      if (lecture.isPreview || lecture.is_preview) {
        return lecture;
      }
      return {
        ...lecture,
        body: "",
        body_en: "",
        videoUrl: "",
        video_url: "",
        resources: [],
        quiz: null,
        isLocked: true,
      };
    }),
  }));

  const freePreviewLectures = flattenCurriculum(sections).filter(
    (lecture) => lecture.isPreview || lecture.is_preview
  );

  const resolvedPreview = await Promise.all(
    freePreviewLectures.map((lecture) => resolveLectureMedia(lecture, resolveMedia))
  );

  return {
    course,
    sections: publicSections,
    lectures: flattenCurriculum(publicSections),
    freePreviewLectures: resolvedPreview,
  };
}

/**
 * Enrolled learner (or owning instructor preview) full curriculum.
 * Optional deps.client enables integration tests against a memory Supabase stub.
 */
export async function fetchLearningCourse({
  slug,
  learnerId,
  previewAsInstructorId = null,
  client = null,
  fetchPublishedCourseBySlug: loadCourse = fetchPublishedCourseBySlug,
  fetchCourseEnrollment: loadEnrollment = fetchCourseEnrollment,
  resolveCourseMediaUrl: resolveMedia = resolveCourseMediaUrl,
} = {}) {
  const db = requireClient(client);

  if (!slug) {
    throw new Error("A course slug is required.");
  }

  const course = await loadCourse(slug);

  let courseRecord = course;
  if ((!course || course.source !== "database") && previewAsInstructorId) {
    const { data, error } = await db
      .from("learning_courses")
      .select(
        "id, instructor_id, slug, title_en, subtitle_en, summary_en, level, duration, language, price_omr, is_published, publication_status"
      )
      .eq("slug", slug)
      .eq("instructor_id", previewAsInstructorId)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      courseRecord = {
        ...data,
        source: "database",
        en: {
          title: data.title_en,
          subtitle: data.subtitle_en || "",
          summary: data.summary_en || "",
        },
      };
    }
  }

  if (!courseRecord || courseRecord.source !== "database") {
    throw new Error("This course is not available as a live database course yet.");
  }

  const isInstructorPreview =
    previewAsInstructorId && courseRecord.instructor_id === previewAsInstructorId;

  let enrollment = null;
  if (!isInstructorPreview) {
    if (!learnerId) {
      throw new Error("A job seeker account and course slug are required.");
    }

    enrollment = await loadEnrollment({
      learnerId,
      courseId: courseRecord.id,
      client: db,
    });

    if (!enrollment) {
      throw new Error("You need to enroll in this course before opening the learning page.");
    }

    if (!["enrolled", "in_progress", "completed"].includes(enrollment.status)) {
      throw new Error(
        "Your course access is not active yet. Please check your payment or enrollment status from the job seeker dashboard."
      );
    }
  }

  const rows = await loadCourseCurriculumRows(
    courseRecord.id,
    {
      publishedOnly: !isInstructorPreview,
    },
    db
  );

  let completedLessonIds = new Set();
  if (enrollment && learnerId) {
    const lessonIds = rows.lessons.map((lesson) => lesson.id);
    const { data: progressRows, error: progressError } = lessonIds.length
      ? await db
          .from("lesson_progress")
          .select("lesson_id")
          .eq("learner_id", learnerId)
          .eq("enrollment_id", enrollment.id)
          .in("lesson_id", lessonIds)
      : { data: [], error: null };

    if (progressError) throw progressError;
    completedLessonIds = new Set((progressRows ?? []).map((row) => row.lesson_id));
  }

  const lessonsWithComplete = rows.lessons.map((lesson) => ({
    ...lesson,
    isComplete: completedLessonIds.has(lesson.id),
  }));

  const sections = buildCurriculumFromRows({
    ...rows,
    lessons: lessonsWithComplete,
  });

  const flat = flattenCurriculum(sections);
  const resolvedFlat = await Promise.all(
    flat.map((lecture) => resolveLectureMedia(lecture, resolveMedia))
  );

  const resolvedById = Object.fromEntries(resolvedFlat.map((lecture) => [lecture.id, lecture]));
  const resolvedSections = sections.map((section) => ({
    ...section,
    lectures: section.lectures.map((lecture) => resolvedById[lecture.id] || lecture),
  }));

  const progressPercent = calculateCurriculumProgress(resolvedFlat);

  return {
    course: courseRecord,
    enrollment: enrollment
      ? { ...enrollment, progressPercent }
      : {
          id: null,
          status: "instructor_preview",
          progressPercent,
        },
    sections: resolvedSections,
    lessons: resolvedFlat,
    isInstructorPreview: Boolean(isInstructorPreview),
  };
}

export async function fetchFreePreviewLecture({ slug, lectureId, client = null }) {
  const db = requireClient(client);

  const course = await fetchPublishedCourseBySlug(slug);
  if (!course || course.source !== "database") {
    throw new Error("Course not found.");
  }

  const lessonSelect = await selectCourseLessons(db, course.id, {
    publishedOnly: true,
    previewOnly: true,
  });
  if (lessonSelect.error) throw lessonSelect.error;

  const lesson = (lessonSelect.data || []).find((row) => row.id === lectureId);
  if (!lesson) {
    throw new Error("This free preview lecture is not available.");
  }

  const resourceResult = await selectLectureResources(db, [lesson.id]);
  if (resourceResult.error) throw resourceResult.error;

  const sections = buildCurriculumFromRows({
    sections: [],
    lessons: [lesson],
    resources: resourceResult.data,
  });

  const lecture = flattenCurriculum(sections)[0];
  return {
    course,
    lecture: await resolveLectureMedia(lecture),
  };
}

export async function fetchLessonQuiz(lessonId, client = null) {
  const db = requireClient(client);

  const { data, error } = await db.rpc("get_learner_lesson_quiz", {
    p_lesson_id: lessonId,
  });

  if (error) throw error;
  return data || null;
}

export async function submitLessonQuiz({ quizId, answers, client = null }) {
  const db = requireClient(client);

  const { data, error } = await db.rpc("submit_lesson_quiz", {
    p_quiz_id: quizId,
    p_answers: answers,
  });

  if (error) throw error;
  return data;
}

/**
 * Mark a lesson complete/incomplete and recompute enrollment progress.
 * Pass `client` to drive this path in tests without a live Supabase session.
 */
export async function updateLessonCompletion({
  learnerId,
  courseId,
  enrollmentId,
  lessonId,
  isComplete,
  client = null,
}) {
  const db = requireClient(client);

  if (!learnerId || !courseId || !enrollmentId || !lessonId) {
    throw new Error("A job seeker, enrollment, course, and lesson are required.");
  }

  if (isComplete) {
    const { error } = await db.from("lesson_progress").upsert(
      {
        learner_id: learnerId,
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "enrollment_id,lesson_id",
      }
    );

    if (error) {
      throw error;
    }
  } else {
    const { error } = await db
      .from("lesson_progress")
      .delete()
      .eq("learner_id", learnerId)
      .eq("enrollment_id", enrollmentId)
      .eq("lesson_id", lessonId);

    if (error) {
      throw error;
    }
  }

  const lessonSelect = await selectCourseLessons(db, courseId, {
    publishedOnly: true,
  });
  if (lessonSelect.error) throw lessonSelect.error;

  const lessonIds = (lessonSelect.data ?? []).map((lesson) => lesson.id);
  const { data: progressRows, error: progressError } = lessonIds.length
    ? await db
        .from("lesson_progress")
        .select("lesson_id")
        .eq("learner_id", learnerId)
        .eq("enrollment_id", enrollmentId)
        .in("lesson_id", lessonIds)
    : { data: [], error: null };

  if (progressError) {
    throw progressError;
  }

  const nextProgress = lessonIds.length
    ? Math.round(((progressRows ?? []).length / lessonIds.length) * 100)
    : 0;

  return updateCourseProgress({
    learnerId,
    courseId,
    progressPercent: nextProgress,
    client: db,
  });
}
