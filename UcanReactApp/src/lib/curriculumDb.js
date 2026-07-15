/**
 * Schema-aware helpers for course curriculum tables.
 */

export const LESSON_COLUMNS_FULL =
  "id, course_id, section_id, title_en, body_en, video_url, resource_url, lecture_type, duration_label, sort_order, is_preview, is_published";

export const LESSON_COLUMNS_LEGACY =
  "id, course_id, title_en, body_en, video_url, resource_url, sort_order, is_preview, is_published";

export function isMissingRelationError(error) {
  if (!error) return false;
  const message = String(error.message || error.details || error.hint || "");
  const code = String(error.code || "");
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    /does not exist/i.test(message) ||
    /could not find the table/i.test(message) ||
    /schema cache/i.test(message)
  );
}

export function isMissingColumnError(error) {
  if (!error) return false;
  const message = String(error.message || error.details || error.hint || "");
  const code = String(error.code || "");
  return (
    code === "42703" ||
    code === "PGRST204" ||
    /column .* does not exist/i.test(message) ||
    /Could not find the .* column/i.test(message)
  );
}

export function isSchemaCompatError(error) {
  return isMissingRelationError(error) || isMissingColumnError(error);
}

/**
 * Select lessons with full columns; fall back to legacy columns when missing.
 */
export async function selectCourseLessons(
  supabase,
  courseId,
  { publishedOnly = false, previewOnly = false } = {}
) {
  const run = async (columns) => {
    let query = supabase
      .from("course_lessons")
      .select(columns)
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });

    if (publishedOnly) {
      query = query.eq("is_published", true);
    }
    if (previewOnly) {
      query = query.eq("is_preview", true);
    }
    return query;
  };

  const full = await run(LESSON_COLUMNS_FULL);
  if (!full.error) {
    return { data: full.data ?? [], error: null, mode: "full" };
  }

  if (isSchemaCompatError(full.error)) {
    const legacy = await run(LESSON_COLUMNS_LEGACY);
    if (legacy.error) {
      return { data: [], error: legacy.error, mode: "legacy" };
    }
    return { data: legacy.data ?? [], error: null, mode: "legacy" };
  }

  return { data: [], error: full.error, mode: "full" };
}

export async function selectCourseSections(supabase, courseId) {
  const result = await supabase
    .from("course_sections")
    .select("id, course_id, title_en, sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (result.error && isMissingRelationError(result.error)) {
    return { data: [], error: null, available: false };
  }
  if (result.error) {
    return { data: [], error: result.error, available: true };
  }
  return { data: result.data ?? [], error: null, available: true };
}

export async function selectLectureResources(supabase, lessonIds) {
  if (!lessonIds?.length) {
    return { data: [], error: null, available: true };
  }

  const result = await supabase
    .from("lecture_resources")
    .select("id, lesson_id, name, file_url, sort_order")
    .in("lesson_id", lessonIds)
    .order("sort_order", { ascending: true });

  if (result.error && isMissingRelationError(result.error)) {
    return { data: [], error: null, available: false };
  }
  if (result.error) {
    return { data: [], error: result.error, available: true };
  }
  return { data: result.data ?? [], error: null, available: true };
}

export async function getCurriculumSchemaCapabilities(supabase) {
  const [sections, resources, lessons] = await Promise.all([
    supabase.from("course_sections").select("id").limit(1),
    supabase.from("lecture_resources").select("id").limit(1),
    supabase.from("course_lessons").select("section_id").limit(1),
  ]);

  return {
    sectionsAvailable: !sections.error || !isMissingRelationError(sections.error),
    resourcesAvailable: !resources.error || !isMissingRelationError(resources.error),
    extendedLessonColumns: !lessons.error || !isMissingColumnError(lessons.error),
  };
}
