import { normalizeCoursePriceOmr } from "./coursePricing";
import { isSupabaseConfigured, supabase } from "./supabase";

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

export async function fetchInstructorCourseKit({ courseId, instructorId }) {
  requireDatabase();

  const [courseResult, lessonResult] = await Promise.all([
    supabase
      .from("learning_courses")
      .select(INSTRUCTOR_COURSE_COLUMNS)
      .eq("id", courseId)
      .eq("instructor_id", instructorId)
      .single(),
    supabase
      .from("course_lessons")
      .select(
        "id, course_id, title_en, body_en, video_url, resource_url, sort_order, is_preview, is_published"
      )
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true }),
  ]);

  if (courseResult.error) throw courseResult.error;
  if (lessonResult.error) throw lessonResult.error;

  const lessonIds = (lessonResult.data ?? []).map((lesson) => lesson.id);
  const { data: quizRows, error: quizError } = lessonIds.length
    ? await supabase
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
        .in("lesson_id", lessonIds)
    : { data: [], error: null };

  if (quizError) throw quizError;

  const quizzesByLesson = Object.fromEntries(
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

  return {
    course: {
      ...courseResult.data,
      price_omr: normalizeCoursePriceOmr(courseResult.data?.price_omr),
    },
    lessons: (lessonResult.data ?? []).map((lesson) => ({
      ...lesson,
      quiz: quizzesByLesson[lesson.id] || null,
    })),
  };
}

export async function saveInstructorCourseKit({ course, lessons }) {
  requireDatabase();

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

  const lessonPayload = lessons
    .map((lesson, index) => ({
      id: lesson.id,
      course_id: course.id,
      title_en: lesson.title_en.trim(),
      body_en: lesson.body_en.trim() || null,
      video_url: lesson.video_url.trim() || null,
      resource_url: lesson.resource_url.trim() || null,
      sort_order: index + 1,
      is_preview: Boolean(lesson.is_preview),
      is_published: Boolean(lesson.is_published),
    }))
    .filter((lesson) => lesson.title_en);

  const { data: existingLessons, error: existingError } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("course_id", course.id);

  if (existingError) throw existingError;

  const retainedIds = new Set(lessonPayload.map((lesson) => lesson.id));
  const removedIds = (existingLessons ?? [])
    .map((lesson) => lesson.id)
    .filter((lessonId) => !retainedIds.has(lessonId));

  if (removedIds.length) {
    const { error: deleteError } = await supabase
      .from("course_lessons")
      .delete()
      .in("id", removedIds);
    if (deleteError) throw deleteError;
  }

  let savedLessons = [];
  if (lessonPayload.length) {
    const { data, error: lessonError } = await supabase
      .from("course_lessons")
      .upsert(lessonPayload)
      .select(
        "id, course_id, title_en, body_en, video_url, resource_url, sort_order, is_preview, is_published"
      )
      .order("sort_order", { ascending: true });

    if (lessonError) throw lessonError;
    savedLessons = data ?? [];
  }

  for (const lesson of lessons.filter((item) => item.title_en.trim())) {
    await saveLessonQuiz(lesson);
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
    lessons: refreshed.lessons.length ? refreshed.lessons : savedLessons,
  };
}

async function saveLessonQuiz(lesson) {
  if (!lesson.quiz) {
    const { error } = await supabase
      .from("course_quizzes")
      .delete()
      .eq("lesson_id", lesson.id);
    if (error) throw error;
    return;
  }

  const quizPayload = {
    id: lesson.quiz.id,
    lesson_id: lesson.id,
    title_en: lesson.quiz.title_en.trim() || "Lesson Quiz",
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

  for (const [questionIndex, question] of lesson.quiz.questions.entries()) {
    if (!question.prompt_en.trim()) continue;

    const { data: savedQuestion, error: questionError } = await supabase
      .from("quiz_questions")
      .insert({
        id: question.id,
        quiz_id: savedQuiz.id,
        prompt_en: question.prompt_en.trim(),
        explanation_en: question.explanation_en.trim() || null,
        sort_order: questionIndex + 1,
      })
      .select("id")
      .single();
    if (questionError) throw questionError;

    const optionPayload = question.options
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

  const { data, error } = await supabase.rpc(
    "instructor_confirm_course_publication",
    { p_course_id: courseId }
  );

  if (error) {
    throw error;
  }

  return data;
}
