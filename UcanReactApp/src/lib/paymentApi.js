import { isSupabaseConfigured, supabase } from "./supabase";

function formatMoney(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free";
  }

  return `${amount.toFixed(3).replace(/\.?0+$/, "")} OMR`;
}

function mapOrder(row) {
  const course = Array.isArray(row.learning_courses)
    ? row.learning_courses[0]
    : row.learning_courses;
  const learner = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id,
    orderNumber: row.order_number,
    learnerId: row.learner_id,
    courseId: row.course_id,
    enrollmentId: row.enrollment_id,
    status: row.status,
    paymentMethod: row.payment_method,
    subtotalOmr: Number(row.subtotal_omr) || 0,
    discountOmr: Number(row.discount_omr) || 0,
    totalOmr: Number(row.total_omr) || 0,
    totalLabel: formatMoney(row.total_omr),
    createdAt: row.created_at,
    paidAt: row.paid_at,
    cancelledAt: row.cancelled_at,
    adminNotes: row.admin_notes || "",
    course: course
      ? {
          title: course.title_en,
          slug: course.slug,
        }
      : null,
    learner: learner
      ? {
          name: learner.full_name,
          email: learner.email,
        }
      : null,
  };
}

function mapPayment(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    learnerId: row.learner_id,
    amountOmr: Number(row.amount_omr) || 0,
    amountLabel: formatMoney(row.amount_omr),
    method: row.method,
    status: row.status,
    referenceNumber: row.reference_number || "",
    payerName: row.payer_name || "",
    payerEmail: row.payer_email || "",
    proofUrl: row.proof_url || "",
    submittedAt: row.submitted_at,
    confirmedAt: row.confirmed_at,
    rejectedAt: row.rejected_at,
    adminNotes: row.admin_notes || "",
  };
}

function assertPaymentConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("database is not configured yet.");
  }
}

export function getCoursePriceOmr(course) {
  const price = Number(course?.priceOmr);

  if (Number.isFinite(price)) {
    return Math.max(0, price);
  }

  const parsedPrice = Number.parseFloat(String(course?.price || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsedPrice) ? Math.max(0, parsedPrice) : 0;
}

export async function fetchLearnerOrders(learnerId) {
  if (!isSupabaseConfigured || !supabase || !learnerId) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      learner_id,
      course_id,
      enrollment_id,
      order_number,
      status,
      payment_method,
      subtotal_omr,
      discount_omr,
      total_omr,
      created_at,
      paid_at,
      cancelled_at,
      admin_notes,
      learning_courses (title_en, slug)
    `
    )
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapOrder);
}

export async function fetchCourseOrder({ learnerId, courseId }) {
  if (!isSupabaseConfigured || !supabase || !learnerId || !courseId) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      learner_id,
      course_id,
      enrollment_id,
      order_number,
      status,
      payment_method,
      subtotal_omr,
      discount_omr,
      total_omr,
      created_at,
      paid_at,
      cancelled_at,
      admin_notes,
      learning_courses (title_en, slug)
    `
    )
    .eq("learner_id", learnerId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapOrder(data) : null;
}

export async function createManualOrder({ learnerId, course }) {
  assertPaymentConfigured();

  if (!learnerId || !course?.id) {
    throw new Error("A learner account and course are required before creating an order.");
  }

  const existingOrder = await fetchCourseOrder({ learnerId, courseId: course.id });

  if (existingOrder) {
    return existingOrder;
  }

  const priceOmr = getCoursePriceOmr(course);
  const { data, error } = await supabase
    .from("orders")
    .insert({
      learner_id: learnerId,
      course_id: course.id,
      status: "pending_payment",
      payment_method: "bank_transfer",
      subtotal_omr: priceOmr,
      discount_omr: 0,
      total_omr: priceOmr,
    })
    .select(
      `
      id,
      learner_id,
      course_id,
      enrollment_id,
      order_number,
      status,
      payment_method,
      subtotal_omr,
      discount_omr,
      total_omr,
      created_at,
      paid_at,
      cancelled_at,
      admin_notes,
      learning_courses (title_en, slug)
    `
    )
    .single();

  if (error) {
    throw error;
  }

  return mapOrder(data);
}

export async function submitManualPayment({ order, learnerId, referenceNumber, payerName, payerEmail }) {
  assertPaymentConfigured();

  if (!order?.id || !learnerId) {
    throw new Error("An order and learner account are required before submitting payment details.");
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: order.id,
      learner_id: learnerId,
      amount_omr: order.totalOmr,
      method: "bank_transfer",
      status: "submitted",
      reference_number: referenceNumber?.trim() || null,
      payer_name: payerName?.trim() || null,
      payer_email: payerEmail?.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapPayment(data);
}

export async function fetchAdminOrders() {
  assertPaymentConfigured();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      learner_id,
      course_id,
      enrollment_id,
      order_number,
      status,
      payment_method,
      subtotal_omr,
      discount_omr,
      total_omr,
      created_at,
      paid_at,
      cancelled_at,
      admin_notes,
      learning_courses (title_en, slug),
      profiles (full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapOrder);
}

export async function fetchAdminPayments() {
  assertPaymentConfigured();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapPayment);
}

export async function updateAdminOrderStatus({ order, status }) {
  assertPaymentConfigured();

  if (!order?.id) {
    throw new Error("An order is required before updating status.");
  }

  const payload = {
    status,
    paid_at: status === "paid" ? new Date().toISOString() : order.paidAt || null,
    cancelled_at: status === "cancelled" ? new Date().toISOString() : order.cancelledAt || null,
  };

  const { data, error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", order.id)
    .select(
      `
      id,
      learner_id,
      course_id,
      enrollment_id,
      order_number,
      status,
      payment_method,
      subtotal_omr,
      discount_omr,
      total_omr,
      created_at,
      paid_at,
      cancelled_at,
      admin_notes,
      learning_courses (title_en, slug),
      profiles (full_name, email)
    `
    )
    .single();

  if (error) {
    throw error;
  }

  if (status === "paid") {
    const { error: enrollmentError } = await supabase.from("course_enrollments").upsert(
      {
        learner_id: data.learner_id,
        course_id: data.course_id,
        status: "enrolled",
      },
      {
        onConflict: "learner_id,course_id",
      }
    );

    if (enrollmentError) {
      throw enrollmentError;
    }
  }

  return mapOrder(data);
}
