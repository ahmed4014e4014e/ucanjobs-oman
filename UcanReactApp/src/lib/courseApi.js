import { courseCatalog } from "./courseCatalog";
import { formatCoursePriceOmr, normalizeCoursePriceOmr } from "./coursePricing";
import { isSupabaseConfigured, supabase } from "./supabase";

const COURSE_COLUMNS = `
  id,
  category_id,
  slug,
  title_en,
  subtitle_en,
  summary_en,
  level,
  duration,
  language,
  price_omr,
  sort_order
`;

function formatPrice(price) {
  return formatCoursePriceOmr(price);
}

function sortByOrder(left, right) {
  return (left.sort_order ?? 0) - (right.sort_order ?? 0);
}

function mapCourseRow(row, outcomes = [], modules = []) {
  const categoryNameEn = row.category?.name_en || "Courses";
  const sortedOutcomes = [...outcomes].sort(sortByOrder);
  const sortedModules = [...modules].sort(sortByOrder);

  return {
    id: row.id,
    slug: row.slug,
    category: categoryNameEn,
    level: row.level,
    priceOmr: normalizeCoursePriceOmr(row.price_omr),
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
  };
}

function mapEnrollmentRow(row, course) {
  return {
    id: row.id,
    status: row.status,
    progressPercent: row.progress_percent ?? 0,
    enrolledAt: row.enrolled_at,
    course,
  };
}

function mapEnrollmentRecord(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    status: row.status,
    progressPercent: row.progress_percent ?? 0,
    enrolledAt: row.enrolled_at,
  };
}

async function addCourseRelations(courses) {
  if (!courses?.length) {
    return [];
  }

  const courseIds = courses.map((course) => course.id);
  const categoryIds = Array.from(new Set(courses.map((course) => course.category_id).filter(Boolean)));
  const [categoryResult, outcomeResult, moduleResult] = await Promise.allSettled([
    categoryIds.length
      ? supabase.from("course_categories").select("id, slug, name_en").in("id", categoryIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("course_outcomes")
      .select("course_id, outcome_en, sort_order")
      .in("course_id", courseIds),
    supabase
      .from("course_modules")
      .select("course_id, title_en, sort_order")
      .in("course_id", courseIds),
  ]);

  const categories =
    categoryResult.status === "fulfilled" && !categoryResult.value.error
      ? categoryResult.value.data ?? []
      : [];
  const outcomes =
    outcomeResult.status === "fulfilled" && !outcomeResult.value.error
      ? outcomeResult.value.data ?? []
      : [];
  const modules =
    moduleResult.status === "fulfilled" && !moduleResult.value.error
      ? moduleResult.value.data ?? []
      : [];

  return courses.map((course) => {
    const category = categories.find((item) => item.id === course.category_id);

    return mapCourseRow(
      { ...course, category },
      outcomes.filter((outcome) => outcome.course_id === course.id),
      modules.filter((module) => module.course_id === course.id)
    );
  });
}

async function fetchCourseRows(queryBuilder) {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data: courses, error } = await queryBuilder;

  if (error) {
    throw error;
  }

  return addCourseRelations(courses ?? []);
}

export async function fetchPublishedCourses() {
  if (!isSupabaseConfigured || !supabase) {
    return courseCatalog;
  }

  const courses = await fetchCourseRows(
    supabase
      .from("learning_courses")
      .select(COURSE_COLUMNS)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
  );

  return courses.length ? courses : courseCatalog;
}

export async function fetchPublishedCourseBySlug(slug) {
  if (!isSupabaseConfigured || !supabase) {
    return courseCatalog.find((course) => course.slug === slug) || null;
  }

  const courses = await fetchCourseRows(
    supabase
      .from("learning_courses")
      .select(COURSE_COLUMNS)
      .eq("is_published", true)
      .eq("slug", slug)
      .limit(1)
  );

  return courses[0] || courseCatalog.find((course) => course.slug === slug) || null;
}

export async function enrollInCourse({ learnerId, courseId }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }

  if (!learnerId || !courseId) {
    throw new Error("A job seeker account and course are required before enrollment.");
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

  return mapEnrollmentRecord(data);
}

export async function fetchCourseEnrollment({ learnerId, courseId }) {
  if (!isSupabaseConfigured || !supabase || !learnerId || !courseId) {
    return null;
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .select("id, status, progress_percent, enrolled_at")
    .eq("learner_id", learnerId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return mapEnrollmentRecord(data);
}

export async function updateCourseProgress({ learnerId, courseId, progressPercent }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }

  if (!learnerId || !courseId) {
    throw new Error("A job seeker account and course are required before updating progress.");
  }

  const normalizedProgress = Math.max(0, Math.min(100, Number(progressPercent) || 0));
  const nextStatus =
    normalizedProgress >= 100 ? "completed" : normalizedProgress > 0 ? "in_progress" : "enrolled";

  const { data, error } = await supabase
    .from("course_enrollments")
    .update({
      progress_percent: normalizedProgress,
      status: nextStatus,
      completed_at: normalizedProgress >= 100 ? new Date().toISOString() : null,
    })
    .eq("learner_id", learnerId)
    .eq("course_id", courseId)
    .select("id, status, progress_percent, enrolled_at")
    .single();

  if (error) {
    throw error;
  }

  return mapEnrollmentRecord(data);
}

export async function fetchLearnerEnrollments(learnerId) {
  if (!isSupabaseConfigured || !supabase || !learnerId) {
    return [];
  }

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("course_enrollments")
    .select("id, status, progress_percent, enrolled_at, course_id")
    .eq("learner_id", learnerId)
    .neq("status", "cancelled")
    .order("enrolled_at", { ascending: false });

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  if (!enrollments?.length) {
    return [];
  }

  const courseIds = enrollments.map((enrollment) => enrollment.course_id).filter(Boolean);
  const courses = await fetchCourseRows(
    supabase.from("learning_courses").select(COURSE_COLUMNS).in("id", courseIds)
  );

  return enrollments
    .map((enrollment) =>
      mapEnrollmentRow(
        enrollment,
        courses.find((course) => course.id === enrollment.course_id)
      )
    )
    .filter((entry) => entry.course);
}


