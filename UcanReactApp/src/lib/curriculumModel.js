/**
 * Pure curriculum model for sectioned courses.
 * No Supabase I/O — unit-testable round-trips and ordering.
 */

export const LECTURE_TYPES = ["video", "article", "quiz", "resources"];

export function normalizeLectureType(value) {
  const type = String(value || "video").toLowerCase();
  return LECTURE_TYPES.includes(type) ? type : "video";
}

export function createBlankLecture(type = "video") {
  const id = crypto.randomUUID();
  return {
    id,
    clientId: id,
    sectionId: null,
    type: normalizeLectureType(type),
    title: type === "quiz" ? "New quiz" : "New lecture",
    title_en: type === "quiz" ? "New quiz" : "New lecture",
    body: "",
    body_en: "",
    videoUrl: "",
    video_url: "",
    resourceUrl: "",
    resource_url: "",
    durationLabel: type === "video" ? "0:00" : type === "article" ? "3 min read" : "—",
    duration_label: type === "video" ? "0:00" : type === "article" ? "3 min read" : "—",
    isPreview: false,
    is_preview: false,
    isPublished: true,
    is_published: true,
    sortOrder: 0,
    resources: [],
    quiz: type === "quiz" ? createBlankQuiz() : null,
  };
}

export function createBlankQuiz() {
  return {
    id: crypto.randomUUID(),
    title_en: "Lesson Quiz",
    passing_score: 70,
    questions: [],
  };
}

export function createBlankSection(title = "New section") {
  const id = crypto.randomUUID();
  return {
    id,
    clientId: id,
    title,
    title_en: title,
    sortOrder: 0,
    expanded: true,
    lectures: [createBlankLecture("video")],
  };
}

/**
 * Build nested sections from flat DB rows.
 */
export function buildCurriculumFromRows({
  sections = [],
  lessons = [],
  resources = [],
  quizzesByLessonId = {},
} = {}) {
  const resourcesByLesson = new Map();
  for (const resource of resources) {
    const lessonId = resource.lesson_id || resource.lessonId;
    if (!resourcesByLesson.has(lessonId)) {
      resourcesByLesson.set(lessonId, []);
    }
    resourcesByLesson.get(lessonId).push({
      id: resource.id,
      name: resource.name,
      fileUrl: resource.file_url || resource.fileUrl || "",
      file_url: resource.file_url || resource.fileUrl || "",
      sortOrder: resource.sort_order ?? resource.sortOrder ?? 0,
    });
  }

  for (const list of resourcesByLesson.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const mappedLessons = lessons.map((lesson, index) => {
    const lessonResources = resourcesByLesson.get(lesson.id) || [];
    // Backward compat: legacy single resource_url
    if (
      !lessonResources.length &&
      (lesson.resource_url || lesson.resourceUrl)
    ) {
      const url = lesson.resource_url || lesson.resourceUrl;
      lessonResources.push({
        id: crypto.randomUUID(),
        name: url.split("/").pop() || "Resource",
        fileUrl: url,
        file_url: url,
        sortOrder: 1,
      });
    }

    const type = normalizeLectureType(lesson.lecture_type || lesson.type || "video");
    const title = lesson.title_en || lesson.title || "";
    const body = lesson.body_en || lesson.body || "";
    const videoUrl = lesson.video_url || lesson.videoUrl || "";
    const durationLabel = lesson.duration_label || lesson.durationLabel || "";

    return {
      id: lesson.id,
      clientId: lesson.id,
      sectionId: lesson.section_id || lesson.sectionId || null,
      type,
      lecture_type: type,
      title,
      title_en: title,
      body,
      body_en: body,
      videoUrl,
      video_url: videoUrl,
      resourceUrl: lessonResources[0]?.fileUrl || lesson.resource_url || "",
      resource_url: lessonResources[0]?.fileUrl || lesson.resource_url || "",
      durationLabel,
      duration_label: durationLabel,
      isPreview: Boolean(lesson.is_preview ?? lesson.isPreview),
      is_preview: Boolean(lesson.is_preview ?? lesson.isPreview),
      isPublished: Boolean(lesson.is_published ?? lesson.isPublished ?? true),
      is_published: Boolean(lesson.is_published ?? lesson.isPublished ?? true),
      isComplete: Boolean(lesson.isComplete),
      isLocked: Boolean(lesson.isLocked),
      sortOrder: lesson.sort_order ?? lesson.sortOrder ?? index + 1,
      sort_order: lesson.sort_order ?? lesson.sortOrder ?? index + 1,
      resources: lessonResources,
      quiz: quizzesByLessonId[lesson.id] || lesson.quiz || null,
    };
  });

  mappedLessons.sort((a, b) => a.sortOrder - b.sortOrder);

  let sectionRows = [...sections].sort(
    (a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0)
  );

  // Flat lessons without sections → one Main section (legacy)
  if (!sectionRows.length && mappedLessons.length) {
    const mainId = crypto.randomUUID();
    sectionRows = [
      {
        id: mainId,
        title_en: "Main",
        sort_order: 1,
      },
    ];
    for (const lecture of mappedLessons) {
      if (!lecture.sectionId) {
        lecture.sectionId = mainId;
      }
    }
  }

  if (!sectionRows.length) {
    return [createBlankSection("Main")];
  }

  const lecturesBySection = new Map();
  for (const lecture of mappedLessons) {
    const key = lecture.sectionId || sectionRows[0].id;
    if (!lecturesBySection.has(key)) {
      lecturesBySection.set(key, []);
    }
    lecturesBySection.get(key).push({ ...lecture, sectionId: key });
  }

  return sectionRows.map((section, index) => {
    const id = section.id;
    const title = section.title_en || section.title || `Section ${index + 1}`;
    const lectures = lecturesBySection.get(id) || [];
    return {
      id,
      clientId: id,
      title,
      title_en: title,
      sortOrder: section.sort_order ?? section.sortOrder ?? index + 1,
      sort_order: section.sort_order ?? section.sortOrder ?? index + 1,
      expanded: true,
      lectures: lectures.length ? lectures : [],
    };
  });
}

/**
 * Flatten nested curriculum preserving section order then lecture order.
 */
export function flattenCurriculum(sections) {
  const list = [];
  for (const section of sections || []) {
    const lectures = [...(section.lectures || [])].sort(
      (a, b) => (a.sortOrder ?? a.sort_order ?? 0) - (b.sortOrder ?? b.sort_order ?? 0)
    );
    for (const lecture of lectures) {
      list.push({
        ...lecture,
        sectionId: section.id,
        sectionTitle: section.title || section.title_en,
      });
    }
  }
  return list;
}

export function calculateCurriculumProgress(lectures) {
  if (!lectures?.length) return 0;
  const completed = lectures.filter((item) => item.isComplete).length;
  return Math.round((completed / lectures.length) * 100);
}

/**
 * Serialize UI curriculum into DB-ready payloads for save APIs.
 */
export function serializeCurriculumForSave(sections) {
  const sectionPayload = [];
  const lessonPayload = [];
  const resourcePayload = [];

  (sections || []).forEach((section, sectionIndex) => {
    const sectionId = section.id || section.clientId || crypto.randomUUID();
    const title = (section.title || section.title_en || "").trim() || `Section ${sectionIndex + 1}`;

    sectionPayload.push({
      id: sectionId,
      title_en: title,
      sort_order: sectionIndex + 1,
    });

    const lectures = section.lectures || [];
    lectures.forEach((lecture, lectureIndex) => {
      const titleEn = (lecture.title_en || lecture.title || "").trim();
      if (!titleEn) return;

      const lessonId = lecture.id || lecture.clientId || crypto.randomUUID();
      const type = normalizeLectureType(lecture.type || lecture.lecture_type);
      const resources = lecture.resources || [];
      const firstResourceUrl =
        resources[0]?.file_url ||
        resources[0]?.fileUrl ||
        lecture.resource_url ||
        lecture.resourceUrl ||
        null;

      lessonPayload.push({
        id: lessonId,
        section_id: sectionId,
        title_en: titleEn,
        body_en: (lecture.body_en || lecture.body || "").trim() || null,
        video_url: (lecture.video_url || lecture.videoUrl || "").trim() || null,
        resource_url: (firstResourceUrl || "").trim() || null,
        lecture_type: type,
        duration_label: (lecture.duration_label || lecture.durationLabel || "").trim() || null,
        sort_order: lectureIndex + 1,
        is_preview: Boolean(lecture.is_preview ?? lecture.isPreview),
        is_published: Boolean(lecture.is_published ?? lecture.isPublished ?? true),
        quiz: lecture.quiz || null,
        _clientResources: resources,
      });

      resources.forEach((resource, resourceIndex) => {
        const fileUrl = (resource.file_url || resource.fileUrl || "").trim();
        if (!fileUrl) return;
        resourcePayload.push({
          id: resource.id || crypto.randomUUID(),
          lesson_id: lessonId,
          name: (resource.name || fileUrl.split("/").pop() || "Resource").trim(),
          file_url: fileUrl,
          sort_order: resourceIndex + 1,
        });
      });
    });
  });

  return { sectionPayload, lessonPayload, resourcePayload };
}

/**
 * Round-trip helper for tests: serialize then rebuild.
 */
export function roundTripCurriculum(sections) {
  const { sectionPayload, lessonPayload, resourcePayload } = serializeCurriculumForSave(sections);

  const quizzesByLessonId = {};
  for (const lesson of lessonPayload) {
    if (lesson.quiz) {
      quizzesByLessonId[lesson.id] = lesson.quiz;
    }
  }

  return buildCurriculumFromRows({
    sections: sectionPayload,
    lessons: lessonPayload,
    resources: resourcePayload,
    quizzesByLessonId,
  });
}

export function curriculumSnapshot(sections) {
  return (sections || []).map((section) => ({
    title: section.title || section.title_en,
    lectures: (section.lectures || []).map((lecture) => ({
      title: lecture.title || lecture.title_en,
      type: normalizeLectureType(lecture.type || lecture.lecture_type),
      resourceCount: (lecture.resources || []).length,
      hasQuiz: Boolean(lecture.quiz),
      isPreview: Boolean(lecture.is_preview ?? lecture.isPreview),
    })),
  }));
}

export function countCurriculumStats(sections) {
  const lectures = flattenCurriculum(sections);
  return {
    sectionCount: (sections || []).length,
    lectureCount: lectures.length,
    videoCount: lectures.filter((item) => item.type === "video").length,
    quizCount: lectures.filter((item) => item.type === "quiz" || item.quiz).length,
    resourceCount: lectures.reduce((sum, item) => sum + (item.resources?.length || 0), 0),
    completedCount: lectures.filter((item) => item.isComplete).length,
  };
}

/**
 * Aggregate downloadable resources for enrolled course overview (shipped helper).
 */
export function collectCurriculumResources(sections) {
  const list = [];
  for (const lecture of flattenCurriculum(sections)) {
    for (const resource of lecture.resources || []) {
      list.push({
        ...resource,
        lectureId: lecture.id,
        lectureTitle: lecture.title || lecture.title_en,
        sectionTitle: lecture.sectionTitle,
      });
    }
  }
  return list;
}

/**
 * Score MCQ answers — shared by mock player tests and UI logic.
 * @param {Array<{id:string, options:Array<{id:string, is_correct?:boolean, correct?:boolean}>}>} questions
 * @param {Record<string,string>} answers map questionId -> optionId
 */
export function scoreQuizAnswers(questions, answers) {
  const list = questions || [];
  if (!list.length) return 0;
  let correct = 0;
  for (const question of list) {
    const selected = answers?.[question.id];
    const right = (question.options || []).find(
      (option) => option.is_correct || option.correct
    );
    if (selected && right && selected === right.id) {
      correct += 1;
    }
  }
  return Math.round((correct / list.length) * 100);
}
