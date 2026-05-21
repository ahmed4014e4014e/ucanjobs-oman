import { courseCatalog } from "./courseCatalog";
import { isSupabaseConfigured, supabase } from "./supabase";

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Free";
  }

  return `${numericPrice.toFixed(0)} OMR`;
}

function sortByOrder(left, right) {
  return (left.sort_order ?? 0) - (right.sort_order ?? 0);
}

function localize(primary, fallback) {
  return primary || fallback || "";
}

function mapCourseRow(row, outcomes = [], modules = []) {
  const categoryNameEn = row.category?.name_en || "Courses";
  const categoryNameAr = row.category?.name_ar || categoryNameEn;
  const sortedOutcomes = [...outcomes].sort(sortByOrder);
  const sortedModules = [...modules].sort(sortByOrder);

  return {
    id: row.id,
    slug: row.slug,
    category: categoryNameEn,
    categoryAr: categoryNameAr,
    level: row.level,
    price: formatPrice(row.price_omr),
    duration: row.duration,
    language: row.language,
    source: "database",
    en: {
      title: row.title_en,
      subtitle: row.subtitle_en,
      summary: row.summary_en,
      outcomes: sortedOutcomes.map((item) => item.outcome_en).filter(Boolean),
      modules: sortedModules.map((item) => item.title_en).filter(Boolean),
    },
    ar: {
      title: localize(row.title_ar, row.title_en),
      subtitle: localize(row.subtitle_ar, row.subtitle_en),
      summary: localize(row.summary_ar, row.summary_en),
      outcomes: sortedOutcomes
        .map((item) => localize(item.outcome_ar, item.outcome_en))
        .filter(Boolean),
      modules: sortedModules.map((item) => localize(item.title_ar, item.title_en)).filter(Boolean),
    },
  };
}

function mapEnrollmentRow(row) {
  const course = row.course ? mapCourseRow(row.course) : null;

  return {
    id: row.id,
    status: row.status,
    progressPercent: row.progress_percent ?? 0,
    enrolledAt: row.enrolled_at,
    course,
  };
}

async function fetchCourseRows(queryBuilder) {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data: courses, error: coursesError } = await queryBuilder;

  if (coursesError) {
    throw coursesError;
  }

  if (!courses?.length) {
    return [];
  }

  const courseIds = courses.map((course) => course.id);

  const [{ data: outcomes, error: outcomesError }, { data: modules, error: modulesError }] =
    await Promise.all([
      supabase
        .from("course_outcomes")
        .select("course_id, outcome_en, outcome_ar, sort_order")
        .in("course_id", courseIds),
      supabase
        .from("course_modules")
        .select("course_id, title_en, title_ar, sort_order")
        .in("course_id", courseIds),
    ]);

  if (outcomesError) {
    throw outcomesError;
  }

  if (modulesError) {
    throw modulesError;
  }

  return courses.map((course) =>
    mapCourseRow(
      course,
      (outcomes ?? []).filter((outcome) => outcome.course_id === course.id),
      (modules ?? []).filter((module) => module.course_id === course.id)
    )
  );
}

export async function fetchPublishedCourses() {
  if (!isSupabaseConfigured || !supabase) {
    return courseCatalog;
  }

  const courses = await fetchCourseRows(
    supabase
      .from("learning_courses")
      .select(
        `
          id,
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
          sort_order,
          category:course_categories (
            slug,
            name_en,
            name_ar
          )
        `
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
  );

  return courses.length ? courses : courseCatalog;
}

export async function enrollInCourse({ learnerId, courseId }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }

  if (!learnerId || !courseId) {
    throw new Error("A learner account and course are required before enrollment.");
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .upsert(
      {
        learner_id: learnerId,
        course_id: courseId,
        status: "enrolled",
      },
      {
        onConflict: "learner_id,course_id",
      }
    )
    .select("id, status, progress_percent, enrolled_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchLearnerEnrollments(learnerId) {
  if (!isSupabaseConfigured || !supabase || !learnerId) {
    return [];
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .select(
      `
        id,
        status,
        progress_percent,
        enrolled_at,
        course:learning_courses (
          id,
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
          sort_order,
          category:course_categories (
            slug,
            name_en,
            name_ar
          )
        )
      `
    )
    .eq("learner_id", learnerId)
    .neq("status", "cancelled")
    .order("enrolled_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapEnrollmentRow).filter((entry) => entry.course);
}

export async function fetchPublishedCourseBySlug(slug) {
  if (!isSupabaseConfigured || !supabase) {
    return courseCatalog.find((course) => course.slug === slug) || null;
  }

  const courses = await fetchCourseRows(
    supabase
      .from("learning_courses")
      .select(
        `
          id,
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
          sort_order,
          category:course_categories (
            slug,
            name_en,
            name_ar
          )
        `
      )
      .eq("is_published", true)
      .eq("slug", slug)
      .limit(1)
  );

  return courses[0] || courseCatalog.find((course) => course.slug === slug) || null;
}
