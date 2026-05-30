import { isSupabaseConfigured, supabase } from "./supabase";

const COURSE_ADMIN_COLUMNS = `
  id,
  category_id,
  slug,
  title_en,
  title_ar,
  subtitle_en,
  subtitle_ar,
  summary_en,
  summary_ar,
  level,
  duration,
  language,
  price_omr,
  is_published,
  sort_order,
  created_at,
  updated_at
`;

function requireDatabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

function sortByOrder(left, right) {
  return (left.sort_order ?? 0) - (right.sort_order ?? 0);
}

function mapAdminCourse(row, categories = [], outcomes = [], modules = []) {
  return {
    ...row,
    category: categories.find((category) => category.id === row.category_id) || null,
    outcomes: outcomes.filter((outcome) => outcome.course_id === row.id).sort(sortByOrder),
    modules: modules.filter((module) => module.course_id === row.id).sort(sortByOrder),
  };
}

async function fetchCourseRelations(courses) {
  const courseIds = courses.map((course) => course.id);
  const categoryIds = Array.from(new Set(courses.map((course) => course.category_id).filter(Boolean)));

  const [categoryResult, outcomeResult, moduleResult] = await Promise.all([
    categoryIds.length
      ? supabase
          .from("course_categories")
          .select("id, slug, name_en, name_ar, sort_order, is_active")
          .in("id", categoryIds)
      : Promise.resolve({ data: [], error: null }),
    courseIds.length
      ? supabase
          .from("course_outcomes")
          .select("id, course_id, outcome_en, outcome_ar, sort_order")
          .in("course_id", courseIds)
      : Promise.resolve({ data: [], error: null }),
    courseIds.length
      ? supabase
          .from("course_modules")
          .select("id, course_id, title_en, title_ar, sort_order")
          .in("course_id", courseIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (categoryResult.error) throw categoryResult.error;
  if (outcomeResult.error) throw outcomeResult.error;
  if (moduleResult.error) throw moduleResult.error;

  return courses.map((course) =>
    mapAdminCourse(course, categoryResult.data ?? [], outcomeResult.data ?? [], moduleResult.data ?? [])
  );
}

export async function fetchAdminCourseCategories() {
  requireDatabase();

  const { data, error } = await supabase
    .from("course_categories")
    .select("id, slug, name_en, name_ar, description_en, sort_order, is_active")
    .order("sort_order", { ascending: true })
    .order("name_en", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchAdminCourses() {
  requireDatabase();

  const { data, error } = await supabase
    .from("learning_courses")
    .select(COURSE_ADMIN_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return fetchCourseRelations(data ?? []);
}

export async function saveAdminCourse({ course, outcomes, modules }) {
  requireDatabase();

  if (!course?.slug || !course.title_en || !course.category_id) {
    throw new Error("Course category, slug, and English title are required.");
  }

  const coursePayload = {
    category_id: course.category_id,
    slug: course.slug,
    title_en: course.title_en,
    title_ar: course.title_ar || null,
    subtitle_en: course.subtitle_en || null,
    subtitle_ar: course.subtitle_ar || null,
    summary_en: course.summary_en || null,
    summary_ar: course.summary_ar || null,
    level: course.level || "Beginner",
    duration: course.duration || "Self-paced",
    language: course.language || "English",
    price_omr: Number(course.price_omr) || 0,
    is_published: Boolean(course.is_published),
    sort_order: Number(course.sort_order) || 0,
  };

  const query = course.id
    ? supabase
        .from("learning_courses")
        .update(coursePayload)
        .eq("id", course.id)
        .select(COURSE_ADMIN_COLUMNS)
        .single()
    : supabase
        .from("learning_courses")
        .insert(coursePayload)
        .select(COURSE_ADMIN_COLUMNS)
        .single();

  const { data: savedCourse, error: courseError } = await query;

  if (courseError) {
    throw courseError;
  }

  await replaceCourseLines({
    table: "course_outcomes",
    courseId: savedCourse.id,
    rows: outcomes,
    textColumnEn: "outcome_en",
    textColumnAr: "outcome_ar",
  });

  await replaceCourseLines({
    table: "course_modules",
    courseId: savedCourse.id,
    rows: modules,
    textColumnEn: "title_en",
    textColumnAr: "title_ar",
  });

  const [courseWithRelations] = await fetchCourseRelations([savedCourse]);
  return courseWithRelations;
}

async function replaceCourseLines({ table, courseId, rows, textColumnEn, textColumnAr }) {
  const { error: deleteError } = await supabase.from(table).delete().eq("course_id", courseId);

  if (deleteError) {
    throw deleteError;
  }

  const cleanedRows = rows
    .map((row, index) => ({
      course_id: courseId,
      [textColumnEn]: row.en.trim(),
      [textColumnAr]: row.ar.trim() || null,
      sort_order: index + 1,
    }))
    .filter((row) => row[textColumnEn]);

  if (!cleanedRows.length) {
    return;
  }

  const { error: insertError } = await supabase.from(table).insert(cleanedRows);

  if (insertError) {
    throw insertError;
  }
}

export async function updateAdminCoursePublishStatus({ courseId, isPublished }) {
  requireDatabase();

  const { data, error } = await supabase
    .from("learning_courses")
    .update({ is_published: Boolean(isPublished) })
    .eq("id", courseId)
    .select(COURSE_ADMIN_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  const [course] = await fetchCourseRelations([data]);
  return course;
}
