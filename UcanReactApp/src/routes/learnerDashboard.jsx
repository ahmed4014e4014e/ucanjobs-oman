import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { fetchLearnerEnrollments, fetchPublishedCourses } from "../lib/courseApi";
import { fetchLearnerOrders } from "../lib/paymentApi";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { themeImages } from "../lib/themeImages";
import { BANK_MUSCAT_PAYMENT_METHOD, BANK_MUSCAT_PAYMENT_PHONE } from "../lib/paymentConfig";

const quickLinkTargets = [
  {
    to: "/courses/",
  },
  {
    to: "/contact/",
  },
];

function formatStatus(value) {
  return String(value || "pending").replaceAll("_", " ");
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString("en-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getOrderMessage(status) {
  switch (status) {
    case "pending_payment":
      return "Payment proof has not been submitted yet.";
    case "payment_submitted":
      return "Already paid but waiting for access. Your payment proof was sent and is waiting for admin review.";
    case "paid":
      return "Your access was approved. The course should appear in your enrolled courses.";
    case "cancelled":
      return "This access request was cancelled. Contact support if this was unexpected.";
    case "refunded":
      return "This order was refunded and course access is not active.";
    default:
      return "This access request is being processed.";
  }
}

export default function LearnerDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const copy = t("studentDashboard");
  const quickLinks = copy.quickLinks.map((item, index) => ({
    ...item,
    to: quickLinkTargets[index]?.to || "/",
  }));
  const [fullName, setFullName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [targetJobRole, setTargetJobRole] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [paymentOrders, setPaymentOrders] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingAvailableCourses, setLoadingAvailableCourses] = useState(false);
  const [availableCoursesError, setAvailableCoursesError] = useState("");
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [loadingPaymentOrders, setLoadingPaymentOrders] = useState(false);
  const [paymentOrderError, setPaymentOrderError] = useState("");
  const [feedback, setFeedback] = useState({
    type: "idle",
    message: "",
  });
  const name = profile?.full_name || copy.fallbackName;
  const profileComplete = Boolean(
    profile?.full_name?.trim() &&
      profile?.institute?.trim() &&
      profile?.target_job_role?.trim()
  );
  const visiblePaymentOrders = paymentOrders.filter((order) => order.status !== "paid");
  const enrolledCourseIds = new Set(enrollments.map((enrollment) => enrollment.course?.id).filter(Boolean));
  const availableUnenrolledCourses = availableCourses.filter((course) => !enrolledCourseIds.has(course.id));
  const loadingCourseAvailability = loadingAvailableCourses || loadingEnrollments;

  useEffect(() => {
    setFullName(profile?.full_name || "");
    setUniversityName(profile?.institute || "");
    setTargetJobRole(profile?.target_job_role || user?.user_metadata?.target_job_role || "");
  }, [profile?.full_name, profile?.institute, profile?.target_job_role, user?.user_metadata?.target_job_role]);

  useEffect(() => {
    let active = true;

    async function loadAvailableCourses() {
      setLoadingAvailableCourses(true);
      setAvailableCoursesError("");

      try {
        const nextCourses = await fetchPublishedCourses();

        if (!active) {
          return;
        }

        setAvailableCourses(nextCourses.filter((course) => course.source === "database"));
      } catch (error) {
        if (!active) {
          return;
        }

        setAvailableCoursesError(error?.message || "We could not load live database courses.");
      } finally {
        if (active) {
          setLoadingAvailableCourses(false);
        }
      }
    }

    async function loadEnrollments() {
      if (!user?.id) {
        setEnrollments([]);
        return;
      }

      setLoadingEnrollments(true);
      setEnrollmentError("");

      try {
        const nextEnrollments = await fetchLearnerEnrollments(user.id);

        if (!active) {
          return;
        }

        setEnrollments(nextEnrollments);
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error?.message || "We could not load your enrolled courses right now.";
        setEnrollmentError(message);
      } finally {
        if (active) {
          setLoadingEnrollments(false);
        }
      }
    }

    async function loadPaymentOrders() {
      if (!user?.id) {
        setPaymentOrders([]);
        return;
      }

      setLoadingPaymentOrders(true);
      setPaymentOrderError("");

      try {
        const nextOrders = await fetchLearnerOrders(user.id);

        if (!active) {
          return;
        }

        setPaymentOrders(nextOrders);
      } catch (error) {
        if (!active) {
          return;
        }

        setPaymentOrderError(error?.message || "We could not load your payment access requests.");
      } finally {
        if (active) {
          setLoadingPaymentOrders(false);
        }
      }
    }

    loadAvailableCourses();
    loadEnrollments();
    loadPaymentOrders();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id || !isSupabaseConfigured || !supabase) {
      setFeedback({
        type: "error",
        message: copy.messages.notConfigured,
      });
      return;
    }

    if (!fullName.trim() || !universityName.trim() || !targetJobRole.trim()) {
      setFeedback({
        type: "error",
        message: copy.messages.required,
      });
      return;
    }

    setSavingProfile(true);
    setFeedback({
      type: "idle",
      message: "",
    });

    try {
      const profilePayload = {
        id: user.id,
        full_name: fullName.trim(),
        institute: universityName.trim(),
        target_job_role: targetJobRole.trim(),
        email: user.email || profile?.email || null,
        role: "learner",
      };

      const { error } = await supabase.from("profiles").upsert(profilePayload);

      if (error) {
        throw error;
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profilePayload.full_name,
          institute: profilePayload.institute,
          target_job_role: profilePayload.target_job_role,
          role: "learner",
        },
      });

      if (metadataError) {
        throw metadataError;
      }

      await refreshProfile();
      setFeedback({
        type: "success",
        message: copy.messages.success,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || copy.messages.error,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{ backgroundImage: `url(${themeImages.studentsGroup})` }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {copy.heroKicker}
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {copy.welcome.replace("{name}", name)}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
                {copy.heroText}
              </p>
            </div>
            <div className="oman-card rounded-3xl p-4 text-[var(--oman-ink)]">
              <div className="oman-photo-frame aspect-[4/3]">
                <img src={themeImages.studentsStudyHall} alt="Students studying in a library" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {copy.profileKicker}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            {profileComplete ? copy.profileComplete : copy.completeProfile}
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            {copy.profileText}
          </p>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title={copy.feedbackTitle}
            className="mt-5"
          />

          <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                {copy.studentName} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder={copy.studentNamePlaceholder}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                {copy.universityName} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
              </span>
              <input
                type="text"
                value={universityName}
                onChange={(event) => setUniversityName(event.target.value)}
                placeholder={copy.universityPlaceholder}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                {copy.targetJobRole} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
              </span>
              <input
                type="text"
                value={targetJobRole}
                onChange={(event) => setTargetJobRole(event.target.value)}
                placeholder={copy.targetJobRolePlaceholder}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <div className="rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]/80">
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.email}</span>{" "}
                {user?.email || copy.notSet}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-[var(--oman-ink)]">{copy.role}</span>{" "}
                {copy.roleStudent}
              </p>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="oman-button-primary inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingProfile ? copy.saving : copy.save}
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {copy.actionsKicker}
          </p>
          {!profileComplete ? (
            <div className="mt-6 rounded-3xl oman-outline-panel p-6 text-center">
              <h2 className="text-lg font-semibold text-[var(--oman-ink)]">
                {copy.lockedTitle}
              </h2>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                {copy.lockedText}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {quickLinks.map((item) => (
                <article key={item.title} className="rounded-3xl oman-outline-panel p-5">
                  <h2 className="text-lg font-semibold text-[var(--oman-ink)]">{item.title}</h2>
                  <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{item.description}</p>
                  <Link
                    to={item.to}
                    className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                  >
                    {item.action}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Access Requests
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Paid course payment status
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Track payment proofs you submitted for paid courses. Course lessons unlock after admin
            approval.
          </p>

          {loadingPaymentOrders && (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-[var(--oman-ink)]/75">
              Loading your access requests...
            </div>
          )}

          {paymentOrderError && (
            <ActionFeedback
              type="error"
              message={paymentOrderError}
              title="Access Requests"
              className="mt-6"
            />
          )}

          {!loadingPaymentOrders && !paymentOrderError && visiblePaymentOrders.length === 0 && (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-center">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                No pending paid access requests
              </h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                Paid courses move to your enrolled courses after admin approval.
              </p>
            </div>
          )}

          {visiblePaymentOrders.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {visiblePaymentOrders.map((order) => (
                <article key={order.id} className="rounded-3xl oman-outline-panel p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                      {order.status === "payment_submitted"
                        ? "already paid but waiting for access"
                        : formatStatus(order.status)}
                    </span>
                    <span className="rounded-full bg-[rgba(244,232,214,0.54)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                      {order.totalLabel}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[var(--oman-ink)]">
                    {order.course?.title || "Paid course access"}
                  </h3>
                  <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                    {getOrderMessage(order.status)}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--oman-ink)]/75 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">Order:</span>{" "}
                      {order.orderNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">Created:</span>{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {order.status === "paid" && order.course?.slug ? (
                    <Link
                      to={`/learn/${order.course.slug}/`}
                      className="oman-button-primary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                    >
                      Open Course Lessons
                    </Link>
                  ) : order.course?.slug ? (
                    <Link
                      to={`/courses/${order.course.slug}/`}
                      className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                    >
                      View Course
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Available Live Courses
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Courses loaded from the database
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            These are published courses currently coming from your live database. Open a course to
            test the enrollment flow.
          </p>

          {loadingCourseAvailability && (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-[var(--oman-ink)]/75">
              Loading live database courses...
            </div>
          )}

          {availableCoursesError && (
            <ActionFeedback
              type="error"
              message={availableCoursesError}
              title="Live Courses"
              className="mt-6"
            />
          )}

          {!loadingCourseAvailability && !availableCoursesError && availableUnenrolledCourses.length === 0 && (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-center">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                No available live courses right now
              </h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                Published database courses will appear here only when you are not already enrolled
                in them.
              </p>
            </div>
          )}

          {!loadingCourseAvailability && availableUnenrolledCourses.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {availableUnenrolledCourses.map((course) => {
                const content = course.en;

                return (
                  <article key={course.id} className="rounded-3xl oman-outline-panel p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                        {course.category}
                      </span>
                      <span className="rounded-full bg-[rgba(244,232,214,0.54)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                        {course.price}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[var(--oman-ink)]">
                      {content.title}
                    </h3>
                    <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                      {content.subtitle}
                    </p>
                    <Link
                      to={`/courses/${course.slug}/`}
                      className="oman-button-primary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                    >
                      Open And Enroll
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Bank Muscat Phone Payment
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Pay for paid courses by phone transfer
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Use the Bank Muscat phone number below when a paid course asks you to send payment before access approval.
          </p>

          <div className="mt-6 rounded-3xl oman-outline-panel p-5">
            <p className="leading-7 text-[var(--oman-ink)]/75">
              Send the requested amount from your bank mobile app, keep proof of payment, then submit the access request for approval. If access is not approved, you can request a full refund.
            </p>
            <div className="mt-5 rounded-2xl bg-[rgba(244,232,214,0.5)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                {BANK_MUSCAT_PAYMENT_METHOD}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-[0.08em] text-[var(--oman-ink)]">
                {BANK_MUSCAT_PAYMENT_PHONE}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Enrolled Courses
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Your Ucan learning path
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Courses you enroll in will appear here. Detailed progress tracking will be added in a
            later phase.
          </p>

          {loadingEnrollments && (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-[var(--oman-ink)]/75">
              Loading your enrolled courses...
            </div>
          )}

          {enrollmentError && (
            <ActionFeedback
              type="error"
              message={enrollmentError}
              title="Enrollment Status"
              className="mt-6"
            />
          )}

          {!loadingEnrollments && !enrollmentError && enrollments.length === 0 && (
            <div className="mt-6 rounded-3xl oman-outline-panel p-5 text-center">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                No enrolled courses yet
              </h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                Browse the course catalog and enroll in your first course when you are ready.
              </p>
              <Link
                to="/courses/"
                className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
              >
                Browse Courses
              </Link>
            </div>
          )}

          {enrollments.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {enrollments.map((enrollment) => {
                const content = enrollment.course.en;

                return (
                  <article key={enrollment.id} className="rounded-3xl oman-outline-panel p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                        {enrollment.status}
                      </span>
                      <span className="rounded-full bg-[rgba(244,232,214,0.54)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                        {enrollment.progressPercent}% progress
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[var(--oman-ink)]">
                      {content.title}
                    </h3>
                    <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                      {content.subtitle}
                    </p>
                    <Link
                      to={`/learn/${enrollment.course.slug}/`}
                      className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                    >
                      Start Learning
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}







