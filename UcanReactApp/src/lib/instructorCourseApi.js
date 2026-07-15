import { normalizeCoursePriceOmr } from "./coursePricing.js";
import {
  buildCurriculumFromRows,
  serializeCurriculumForSave,
} from "./curriculumModel.js";
import {
  getCurriculumSchemaCapabilities,
  isMissingColumnError,
  isMissingRelationError,
  isSchemaCompatError,
  selectCourseLessons,
  selectCourseSections,
  selectLectureResources,
} from "./curriculumDb.js";
import { isSupabaseConfigured, supabase } from "./supabase.js";

const INSTRUCTOR_COURSE_COLUMNS = `
  id,
  category_id,
  proposal_id,
  instructor_id,
  slug,
  title_en,
  subtitle_en,
  summary_en,
  level,
  duration,
  language,
  price_omr,
  is_published,
  publication_status,
  instructor_confirmed_at,
  updated_at
`;

function requireDatabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export async function fetchInstructorCourses(instructorId) {
  requireDatabase();

  if (!instructorId) {
    return [];
  }

  const { data, error } = await supabase
    .from("learning_courses")
    .select(INSTRUCTOR_COURSE_COLUMNS)
    .eq("instructor_id", instructorId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((course) => ({
    ...course,
    price_omr: normalizeCoursePriceOmr(course.price_omr),
  }));
}

async function fetchQuizzesByLessonIds(lessonIds) {
  if (!lessonIds.length) {
    return {};
  }

  const { data: quizRows, error: quizError } = await supabase
    .from("course_quizzes")
    .select(`
      id,
      lesson_id,
      title_en,
      passing_score,
      quiz_questions (
        id,
        quiz_id,
        prompt_en,
        explanation_en,
        sort_order,
        quiz_options (
          id,
          question_id,
          option_en,
          is_correct,
          sort_order
        )
      )
    `)
    .in("lesson_id", lessonIds);

  if (quizError) throw quizError;

  return Object.fromEntries(
    (quizRows ?? []).map((quiz) => [
      quiz.lesson_id,
      {
        id: quiz.id,
        title_en: quiz.title_en,
        passing_score: quiz.passing_score,
        questions: (quiz.quiz_questions ?? [])
          .sort((left, right) => left.sort_order - right.sort_order)
          .map((question) => ({
            id: question.id,
            prompt_en: question.prompt_en,
            explanation_en: question.explanation_en || "",
            options: (question.quiz_options ?? [])
              .sort((left, right) => left.sort_order - right.sort_order)
              .map((option) => ({
                id: option.id,
                option_en: option.option_en,
                is_correct: Boolean(option.is_correct),
              })),
          })),
      },
    ])
  );
}

/**
 * Load course + sectioned curriculum for the instructor kit.
 */
export async function fetchInstructorCourseKit({ courseId, instructorId }) {
  requireDatabase();

  const courseResult = await supabase
    .from("learning_courses")
    .select(INSTRUCTOR_COURSE_COLUMNS)
    .eq("id", courseId)
    .eq("instructor_id", instructorId)
    .single();

  if (courseResult.error) throw courseResult.error;

  const [sectionResult, lessonResult] = await Promise.all([
    selectCourseSections(supabase, courseId),
    selectCourseLessons(supabase, courseId),
  ]);

  if (sectionResult.error) throw sectionResult.error;
  if (lessonResult.error) throw lessonResult.error;

  const lessons = lessonResult.data ?? [];
  const lessonIds = lessons.map((lesson) => lesson.id);
  const resourceResult = await selectLectureResources(supabase, lessonIds);
  if (resourceResult.error) throw resourceResult.error;

  const quizzesByLessonId = await fetchQuizzesByLessonIds(lessonIds);
  const sections = buildCurriculumFromRows({
    sections: sectionResult.available === false ? [] : sectionResult.data,
    lessons,
    resources: resourceResult.data,
    quizzesByLessonId,
  });

  const flatLessons = sections.flatMap((section) =>
    section.lectures.map((lecture) => ({
      ...lecture,
      section_id: section.id,
    }))
  );

  return {
    course: {
      ...courseResult.data,
      price_omr: normalizeCoursePriceOmr(courseResult.data?.price_omr),
    },
    sections,
    lessons: flatLessons,
    schema: {
      sectionsAvailable: sectionResult.available !== false,
      resourcesAvailable: resourceResult.available !== false,
      mode: lessonResult.mode,
    },
  };
}

/**
 * Save course details + full sectioned curriculum.
 * Falls back to legacy flat lesson upsert when sectioned tables/columns are missing.
 */
export async function saveInstructorCourseKit(payload) {
  requireDatabase();

  const course = payload.course;
  let sections = payload.sections;

  if (!sections && payload.lessons) {
    sections = [
      {
        id: crypto.randomUUID(),
        title: "Main",
        title_en: "Main",
        lectures: (payload.lessons || []).map((lesson, index) => ({
          ...lesson,
          title: lesson.title_en || lesson.title,
          title_en: lesson.title_en || lesson.title,
          body: lesson.body_en || lesson.body,
          body_en: lesson.body_en || lesson.body,
          videoUrl: lesson.video_url || lesson.videoUrl,
          video_url: lesson.video_url || lesson.videoUrl,
          type: lesson.lecture_type || lesson.type || "video",
          resources:
            lesson.resources ||
            (lesson.resource_url
              ? [
                  {
                    id: crypto.randomUUID(),
                    name: "Resource",
                    fileUrl: lesson.resource_url,
                    file_url: lesson.resource_url,
                  },
                ]
              : []),
          sortOrder: index + 1,
        })),
      },
    ];
  }

  const { data: savedCourse, error: courseError } = await supabase
    .from("learning_courses")
    .update({
      subtitle_en: course.subtitle_en?.trim() || null,
      summary_en: course.summary_en?.trim() || null,
      duration: course.duration?.trim() || "Self-paced",
      language: course.language?.trim() || "English",
      publication_status: "draft",
    })
    .eq("id", course.id)
    .eq("instructor_id", course.instructor_id)
    .select(INSTRUCTOR_COURSE_COLUMNS)
    .single();

  if (courseError) {
    throw courseError;
  }

  const capabilities = await getCurriculumSchemaCapabilities(supabase);
  const { sectionPayload, lessonPayload, resourcePayload } =
    serializeCurriculumForSave(sections);

  if (capabilities.sectionsAvailable && capabilities.extendedLessonColumns) {
    await saveSectionedCurriculum({
      courseId: course.id,
      sectionPayload,
      lessonPayload,
      resourcePayload,
      resourcesAvailable: capabilities.resourcesAvailable,
    });
  } else {
    await saveLegacyFlatCurriculum({
      courseId: course.id,
      lessonPayload,
    });
  }

  for (const lesson of lessonPayload) {
    await saveLessonQuiz({ id: lesson.id, quiz: lesson.quiz });
  }

  const refreshed = await fetchInstructorCourseKit({
    courseId: course.id,
    instructorId: course.instructor_id,
  });

  return {
    course: {
      ...savedCourse,
      price_omr: normalizeCoursePriceOmr(savedCourse?.price_omr),
    },
    sections: refreshed.sections,
    lessons: refreshed.lessons,
    schema: refreshed.schema,
  };
}

async function saveSectionedCurriculum({
  courseId,
  sectionPayload,
  lessonPayload,
  resourcePayload,
  resourcesAvailable,
}) {
  const { data: existingSections, error: existingSectionsError } = await supabase
    .from("course_sections")
    .select("id")
    .eq("course_id", courseId);

  if (existingSectionsError) {
    if (isMissingRelationError(existingSectionsError)) {
      return saveLegacyFlatCurriculum({ courseId, lessonPayload });
    }
    throw existingSectionsError;
  }

  const retainedSectionIds = new Set(sectionPayload.map((section) => section.id));
  const removedSectionIds = (existingSections ?? [])
    .map((section) => section.id)
    .filter((id) => !retainedSectionIds.has(id));

  if (removedSectionIds.length) {
    const { error: deleteSectionsError } = await supabase
      .from("course_sections")
      .delete()
      .in("id", removedSectionIds);
    if (deleteSectionsError) throw deleteSectionsError;
  }

  if (sectionPayload.length) {
    const { error: sectionUpsertError } = await supabase.from("course_sections").upsert(
      sectionPayload.map((section) => ({
        ...section,
        course_id: courseId,
      }))
    );
    if (sectionUpsertError) {
      if (isSchemaCompatError(sectionUpsertError)) {
        return saveLegacyFlatCurriculum({ courseId, lessonPayload });
      }
      throw sectionUpsertError;
    }
  }

  const { data: existingLessons, error: existingError } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("course_id", courseId);

  if (existingError) throw existingError;

  const retainedLessonIds = new Set(lessonPayload.map((lesson) => lesson.id));
  const removedLessonIds = (existingLessons ?? [])
    .map((lesson) => lesson.id)
    .filter((id) => !retainedLessonIds.has(id));

  if (removedLessonIds.length) {
    const { error: deleteError } = await supabase
      .from("course_lessons")
      .delete()
      .in("id", removedLessonIds);
    if (deleteError) throw deleteError;
  }

  const lessonRowsFull = lessonPayload.map(({ quiz: _quiz, _clientResources, ...row }) => ({
    ...row,
    course_id: courseId,
  }));

  if (lessonRowsFull.length) {
    const fullUpsert = await supabase.from("course_lessons").upsert(lessonRowsFull);
    if (fullUpsert.error && isMissingColumnError(fullUpsert.error)) {
      const legacyRows = lessonRowsFull.map(
        ({ section_id, lecture_type, duration_label, ...legacy }) => legacy
      );
      const legacyUpsert = await supabase.from("course_lessons").upsert(legacyRows);
      if (legacyUpsert.error) throw legacyUpsert.error;
    } else if (fullUpsert.error) {
      throw fullUpsert.error;
    }
  }

  if (resourcesAvailable) {
    for (const lesson of lessonPayload) {
      const { error: clearError } = await supabase
        .from("lecture_resources")
        .delete()
        .eq("lesson_id", lesson.id);
      if (clearError && !isMissingRelationError(clearError)) throw clearError;
    }

    const resourcesForInsert = resourcePayload.filter((resource) =>
      retainedLessonIds.has(resource.lesson_id)
    );

    if (resourcesForInsert.length) {
      const { error: resourceError } = await supabase
        .from("lecture_resources")
        .insert(resourcesForInsert);
      if (resourceError && !isMissingRelationError(resourceError)) {
        throw resourceError;
      }
    }
  }
}

async function saveLegacyFlatCurriculum({ courseId, lessonPayload }) {
  const { data: existingLessons, error: existingError } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("course_id", courseId);

  if (existingError) throw existingError;

  const retainedLessonIds = new Set(lessonPayload.map((lesson) => lesson.id));
  const removedLessonIds = (existingLessons ?? [])
    .map((lesson) => lesson.id)
    .filter((id) => !retainedLessonIds.has(id));

  if (removedLessonIds.length) {
    const { error: deleteError } = await supabase
      .from("course_lessons")
      .delete()
      .in("id", removedLessonIds);
    if (deleteError) throw deleteError;
  }

  const legacyRows = lessonPayload.map(
    ({ quiz: _q, _clientResources, section_id, lecture_type, duration_label, ...row }, index) => ({
      id: row.id,
      course_id: courseId,
      title_en: row.title_en,
      body_en: row.body_en,
      video_url: row.video_url,
      resource_url: row.resource_url,
      sort_order: row.sort_order ?? index + 1,
      is_preview: row.is_preview,
      is_published: row.is_published,
    })
  );

  if (legacyRows.length) {
    const { error } = await supabase.from("course_lessons").upsert(legacyRows);
    if (error) throw error;
  }
}

async function saveLessonQuiz(lesson) {
  if (!lesson.quiz) {
    const { error } = await supabase.from("course_quizzes").delete().eq("lesson_id", lesson.id);
    if (error) throw error;
    return;
  }

  const quizPayload = {
    id: lesson.quiz.id,
    lesson_id: lesson.id,
    title_en: lesson.quiz.title_en?.trim() || "Lesson Quiz",
    passing_score: Number(lesson.quiz.passing_score) || 70,
  };
  const { data: savedQuiz, error: quizError } = await supabase
    .from("course_quizzes")
    .upsert(quizPayload)
    .select("id")
    .single();

  if (quizError) throw quizError;

  const { error: deleteQuestionError } = await supabase
    .from("quiz_questions")
    .delete()
    .eq("quiz_id", savedQuiz.id);
  if (deleteQuestionError) throw deleteQuestionError;

  for (const [questionIndex, question] of (lesson.quiz.questions || []).entries()) {
    if (!question.prompt_en?.trim()) continue;

    const { data: savedQuestion, error: questionError } = await supabase
      .from("quiz_questions")
      .insert({
        id: question.id,
        quiz_id: savedQuiz.id,
        prompt_en: question.prompt_en.trim(),
        explanation_en: question.explanation_en?.trim() || null,
        sort_order: questionIndex + 1,
      })
      .select("id")
      .single();
    if (questionError) throw questionError;

    const optionPayload = (question.options || [])
      .map((option, optionIndex) => ({
        id: option.id,
        question_id: savedQuestion.id,
        option_en: option.option_en.trim(),
        is_correct: Boolean(option.is_correct),
        sort_order: optionIndex + 1,
      }))
      .filter((option) => option.option_en);

    if (optionPayload.length) {
      const { error: optionError } = await supabase.from("quiz_options").insert(optionPayload);
      if (optionError) throw optionError;
    }
  }
}

export async function confirmInstructorCoursePublication(courseId) {
  requireDatabase();

  const { data, error } = await supabase.rpc("instructor_confirm_course_publication", {
    p_course_id: courseId,
  });

  if (error) {
    throw error;
  }

  return data;
}
