import {
  fetchCourseEnrollment,
  fetchPublishedCourseBySlug,
  updateCourseProgress,
} from "./courseApi";
import { isSupabaseConfigured, supabase } from "./supabase";
import { resolveCourseMediaUrl } from "./courseMediaApi";

function requireDatabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

function mapLesson(row, completedLessonIds) {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title_en,
    body: row.body_en || "",
    videoUrl: row.video_url || "",
    resourceUrl: row.resource_url || "",
    sortOrder: row.sort_order ?? 0,
    isPreview: Boolean(row.is_preview),
    isPublished: Boolean(row.is_published),
    isComplete: completedLessonIds.has(row.id),
  };
}

function calculateProgress(lessons) {
  if (!lessons.length) {
    return 0;
  }

  const completedCount = lessons.filter((lesson) => lesson.isComplete).length;
  return Math.round((completedCount / lessons.length) * 100);
}

export async function fetchLearningCourse({ slug, learnerId }) {
  requireDatabase();

  if (!slug || !learnerId) {
    throw new Error("A job seeker account and course slug are required.");
  }

  const course = await fetchPublishedCourseBySlug(slug);

  if (!course || course.source !== "database") {
    throw new Error("This course is not available as a live database course yet.");
  }

  const enrollment = await fetchCourseEnrollment({
    learnerId,
    courseId: course.id,
  });

  if (!enrollment) {
    throw new Error("You need to enroll in this course before opening the learning page.");
  }

  if (!["enrolled", "in_progress", "completed"].includes(enrollment.status)) {
    throw new Error("Your course access is not active yet. Please check your payment or enrollment status from the job seeker dashboard.");
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("course_lessons")
    .select("id, course_id, title_en, body_en, video_url, resource_url, sort_order, is_preview, is_published")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (lessonsError) {
    throw lessonsError;
  }

  const lessonIds = (lessons ?? []).map((lesson) => lesson.id);
  const { data: progressRows, error: progressError } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("learner_id", learnerId)
        .eq("enrollment_id", enrollment.id)
        .in("lesson_id", lessonIds)
    : { data: [], error: null };

  if (progressError) {
    throw progressError;
  }

  const completedLessonIds = new Set((progressRows ?? []).map((row) => row.lesson_id));
  const mappedLessons = await Promise.all(
    (lessons ?? []).map(async (lesson) => {
      const mappedLesson = mapLesson(lesson, completedLessonIds);
      return {
        ...mappedLesson,
        videoIsUpload: mappedLesson.videoUrl.startsWith("storage://"),
        videoUrl: await resolveCourseMediaUrl(mappedLesson.videoUrl),
        resourceUrl: await resolveCourseMediaUrl(mappedLesson.resourceUrl),
      };
    })
  );

  return {
    course,
    enrollment: {
      ...enrollment,
      progressPercent: calculateProgress(mappedLessons),
    },
    lessons: mappedLessons,
  };
}

export async function fetchLessonQuiz(lessonId) {
  requireDatabase();

  const { data, error } = await supabase.rpc("get_learner_lesson_quiz", {
    p_lesson_id: lessonId,
  });

  if (error) throw error;
  return data || null;
}

export async function submitLessonQuiz({ quizId, answers }) {
  requireDatabase();

  const { data, error } = await supabase.rpc("submit_lesson_quiz", {
    p_quiz_id: quizId,
    p_answers: answers,
  });

  if (error) throw error;
  return data;
}

export async function updateLessonCompletion({
  learnerId,
  courseId,
  enrollmentId,
  lessonId,
  isComplete,
}) {
  requireDatabase();

  if (!learnerId || !courseId || !enrollmentId || !lessonId) {
    throw new Error("A job seeker, enrollment, course, and lesson are required.");
  }

  if (isComplete) {
    const { error } = await supabase.from("lesson_progress").upsert(
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
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("learner_id", learnerId)
      .eq("enrollment_id", enrollmentId)
      .eq("lesson_id", lessonId);

    if (error) {
      throw error;
    }
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("is_published", true);

  if (lessonsError) {
    throw lessonsError;
  }

  const lessonIds = (lessons ?? []).map((lesson) => lesson.id);
  const { data: progressRows, error: progressError } = lessonIds.length
    ? await supabase
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
  });
}
