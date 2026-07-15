import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  enrollInCourse,
  fetchCourseEnrollment,
  fetchPublishedCourseBySlug,
  updateCourseProgress,
} from "../lib/courseApi";
import { findCourseBySlug } from "../lib/courseCatalog";
import {
  createManualOrder,
  fetchCourseOrder,
  getCoursePriceOmr,
  submitManualPayment,
  uploadPaymentProof,
} from "../lib/paymentApi";
import { BANK_MUSCAT_PAYMENT_METHOD, BANK_MUSCAT_PAYMENT_PHONE } from "../lib/paymentConfig";
import {
  ACCEPTED_UPLOAD_ATTRIBUTE,
  FILE_SIZE_LIMIT_MB,
  validateUploadSelection,
} from "../lib/fileUploadRules";
import { themeImages } from "../lib/themeImages";
import { Alert, Button, Card, Field } from "../components/ui";
import { Hero, Page, PageHeader, Section, SiteFooter } from "../components/layout";
import LecturePlayerPanel from "../components/domain/LecturePlayerPanel";
import { fetchPublicCourseCurriculum } from "../lib/learningContentApi";
import { isSupabaseConfigured } from "../lib/supabase";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [course, setCourse] = useState(() => findCourseBySlug(slug));
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [courseOrder, setCourseOrder] = useState(null);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);
  const [courseLoadMessage, setCourseLoadMessage] = useState("");
  const [enrollmentFeedback, setEnrollmentFeedback] = useState({
    type: "idle",
    message: "",
  });
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [submittingAccessRequest, setSubmittingAccessRequest] = useState(false);
  const [publicSections, setPublicSections] = useState([]);
  const [freePreviewLectures, setFreePreviewLectures] = useState([]);
  const [activePreviewId, setActivePreviewId] = useState("");
  const jobSeekerName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email || "Job seeker";

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      setLoadingCourse(true);
      setCourseLoadMessage("");

      try {
        const nextCourse = await fetchPublishedCourseBySlug(slug);

        if (!active) {
          return;
        }

        setCourse(nextCourse);
        setCourseLoadMessage(
          nextCourse?.source === "database"
            ? ""
            : "Showing this course from the starter catalog for now."
        );
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Course detail load failed:", error);
        setCourse(findCourseBySlug(slug));
        setCourseLoadMessage(
          "Showing this course from the starter catalog until live course data is available."
        );
      } finally {
        if (active) {
          setLoadingCourse(false);
        }
      }
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;

    async function loadPublicCurriculum() {
      if (!isSupabaseConfigured || !slug) {
        setPublicSections([]);
        setFreePreviewLectures([]);
        return;
      }

      try {
        const result = await fetchPublicCourseCurriculum(slug);
        if (!active) return;
        setPublicSections(result.sections || []);
        setFreePreviewLectures(result.freePreviewLectures || []);
        setActivePreviewId(result.freePreviewLectures?.[0]?.id || "");
      } catch {
        if (active) {
          setPublicSections([]);
          setFreePreviewLectures([]);
        }
      }
    }

    loadPublicCurriculum();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;

    async function loadEnrollment() {
      if (!user?.id || course?.source !== "database" || !course?.id) {
        setEnrollment(null);
        return;
      }

      setLoadingEnrollment(true);

      try {
        const [nextEnrollment, nextOrder] = await Promise.all([
          fetchCourseEnrollment({
            learnerId: user.id,
            courseId: course.id,
          }),
          fetchCourseOrder({
            learnerId: user.id,
            courseId: course.id,
          }),
        ]);

        if (active) {
          setEnrollment(nextEnrollment);
          setCourseOrder(nextOrder);
        }
      } catch (error) {
        if (active) {
          setEnrollmentFeedback({
            type: "error",
            message: error?.message || "We could not load your enrollment or payment status.",
          });
        }
      } finally {
        if (active) {
          setLoadingEnrollment(false);
        }
      }
    }

    loadEnrollment();

    return () => {
      active = false;
    };
  }, [course?.id, course?.source, user?.id]);

  const handlePaymentProofChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const { validFiles, errorMessage } = validateUploadSelection(selectedFiles);

    if (errorMessage) {
      setPaymentProofFile(null);
      setEnrollmentFeedback({ type: "error", message: errorMessage });
      return;
    }

    setPaymentProofFile(validFiles[0] || null);
    setEnrollmentFeedback({ type: "idle", message: "" });
  };

  const handleAccessRequestSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      navigate("/learner-access/");
      return;
    }

    if (course?.source !== "database" || !course?.id) {
      setEnrollmentFeedback({
        type: "error",
        message: "Access requests will be available after live course data is connected.",
      });
      return;
    }

    if (!paymentProofFile) {
      setEnrollmentFeedback({
        type: "error",
        message: "Please attach proof of payment before sending your access request.",
      });
      return;
    }

    setSubmittingAccessRequest(true);
    setEnrollmentFeedback({ type: "idle", message: "" });

    try {
      const order = await createManualOrder({ learnerId: user.id, course });
      const proofFile = await uploadPaymentProof({
        file: paymentProofFile,
        learnerId: user.id,
        orderId: order.id,
      });

      await submitManualPayment({
        order,
        learnerId: user.id,
        referenceNumber: paymentReference,
        payerName: jobSeekerName,
        payerEmail: profile?.email || user.email || "",
        proofUrl: proofFile.path,
      });

      setCourseOrder({
        ...order,
        status: "payment_submitted",
      });
      setPaymentProofFile(null);
      setPaymentReference("");
      setEnrollmentFeedback({
        type: "success",
        message:
          "Your access request was sent. The admin team can now review your payment proof and approve course access.",
      });
    } catch (error) {
      setEnrollmentFeedback({
        type: "error",
        message: error?.message || "We could not send your access request right now.",
      });
    } finally {
      setSubmittingAccessRequest(false);
    }
  };

  const handleEnrollment = async () => {
    if (!user?.id) {
      navigate("/learner-access/");
      return;
    }

    if (course?.source !== "database" || !course?.id) {
      setEnrollmentFeedback({
        type: "error",
        message: "Enrollment will be available after live course data is connected.",
      });
      return;
    }

    setEnrolling(true);
    setEnrollmentFeedback({ type: "idle", message: "" });

    try {
      const priceOmr = getCoursePriceOmr(course);

      if (priceOmr > 0) {
        setEnrollmentFeedback({
          type: "info",
          message: `Send ${course.price} to ${BANK_MUSCAT_PAYMENT_PHONE} using your bank app, then upload proof of payment when the access request form is available.`,
        });
        return;
      }

      const nextEnrollment = await enrollInCourse({
        learnerId: user.id,
        courseId: course.id,
      });

      setEnrollment(nextEnrollment);
      setEnrollmentFeedback({
        type: "success",
        message: "You are enrolled. You can now view this course from your job seeker dashboard.",
      });
    } catch (error) {
      setEnrollmentFeedback({
        type: "error",
        message: error?.message || "We could not enroll you in this course right now.",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleProgressUpdate = async (progressPercent) => {
    if (!user?.id || !course?.id) {
      return;
    }

    setUpdatingProgress(true);
    setEnrollmentFeedback({ type: "idle", message: "" });

    try {
      const nextEnrollment = await updateCourseProgress({
        learnerId: user.id,
        courseId: course.id,
        progressPercent,
      });

      setEnrollment(nextEnrollment);
      setEnrollmentFeedback({
        type: "success",
        message: `Progress updated to ${nextEnrollment.progressPercent}%.`,
      });
    } catch (error) {
      setEnrollmentFeedback({
        type: "error",
        message: error?.message || "We could not update your course progress right now.",
      });
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (!course && loadingCourse) {
    return (
      <Page className="px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
        <Section spacing="none" className="max-w-3xl">
          <Card variant="default" padding="lg" rounded="xl" className="text-center">
            <PageHeader kicker="Loading course" title="Fetching course details..." align="center" />
          </Card>
        </Section>
      </Page>
    );
  }

  if (!course) {
    return (
      <Page className="px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
        <Section spacing="none" className="max-w-3xl">
          <Card variant="default" padding="lg" rounded="xl" className="text-center">
            <PageHeader
              kicker="Course not found"
              title="We could not find this course."
              align="center"
              actions={<Button to="/courses/" variant="primary">Back to Courses</Button>}
            />
          </Card>
        </Section>
      </Page>
    );
  }

  const content = course.en;
  const priceOmr = getCoursePriceOmr(course);
  const isPaidCourse = priceOmr > 0;
  const paidRequestSubmitted = courseOrder?.status === "payment_submitted";
  const paidRequestApproved = courseOrder?.status === "paid";
  const paidRequestClosed = ["cancelled", "refunded"].includes(courseOrder?.status);

  return (
    <Page>
      <Hero backgroundImage={themeImages.mountainFort}>
        <div className="max-w-4xl text-center lg:text-left">
          <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
            {course.category}
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
            {content.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {[course.price, course.duration, course.level, course.language].map((item) => (
              <span
                key={item}
                className="rounded-full bg-[rgba(255,252,247,0.16)] px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20"
              >
                {item}
              </span>
            ))}
          </div>
          {(loadingCourse || courseLoadMessage) && (
            <div className="mt-6 inline-flex rounded-2xl bg-[rgba(255,252,247,0.14)] px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
              {loadingCourse ? "Loading course details..." : courseLoadMessage}
            </div>
          )}
        </div>
      </Hero>

      <Section
        spacing="md"
        className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <Card variant="default" padding="lg" rounded="xl">
          <PageHeader
            kicker="Overview"
            title="What will you learn?"
            description={content.summary}
            className="max-w-none"
          />
          <div className="mt-8 grid gap-4">
            {content.outcomes.map((outcome) => (
              <Card key={outcome} variant="outline" padding="sm" rounded="md">
                <p className="font-semibold text-[var(--oman-ink)]">{outcome}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card as="aside" variant="default" padding="lg" rounded="xl">
          <PageHeader
            kicker="Course content"
            title={publicSections.length ? "Curriculum" : "Modules"}
            className="max-w-none"
          />
          {publicSections.length ? (
            <ol className="mt-6 space-y-4">
              {publicSections.map((section, sectionIndex) => (
                <li key={section.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                    Section {sectionIndex + 1}: {section.title}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {section.lectures.map((lecture, lectureIndex) => {
                      const isPreview = lecture.isPreview || lecture.is_preview;
                      return (
                        <li
                          key={lecture.id}
                          className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3 text-[var(--oman-ink)]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold">
                              {lectureIndex + 1}. {lecture.title || lecture.title_en}
                            </p>
                            {isPreview ? (
                              <button
                                type="button"
                                className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--oman-olive)]"
                                onClick={() => setActivePreviewId(lecture.id)}
                              >
                                Free preview
                              </button>
                            ) : (
                              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--oman-ink)]/50">
                                Locked
                              </span>
                            )}
                          </div>
                          {(lecture.durationLabel || lecture.duration_label) && (
                            <p className="mt-1 text-xs text-[var(--oman-ink)]/60">
                              {lecture.durationLabel || lecture.duration_label}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="mt-6 space-y-3">
              {content.modules.map((module, index) => (
                <li
                  key={module}
                  className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-4 text-[var(--oman-ink)]"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                    Module {index + 1}
                  </span>
                  <p className="mt-2 font-semibold">{module}</p>
                </li>
              ))}
            </ol>
          )}

          {loadingEnrollment ? (
            <Card variant="outline" padding="sm" rounded="md" className="mt-8 text-sm font-semibold text-[var(--oman-ink)]/75">
              Loading your enrollment status...
            </Card>
          ) : null}

          {enrollment ? (
            <Card variant="outline" padding="md" rounded="lg" className="mt-8">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Your progress
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold capitalize text-[var(--oman-ink)]">
                  {enrollment.status.replaceAll("_", " ")}
                </p>
                <p className="text-lg font-bold text-[var(--oman-terracotta)]">
                  {enrollment.progressPercent}%
                </p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(111,49,29,0.12)]">
                <div
                  className="h-full rounded-full bg-[var(--oman-terracotta)] transition-all"
                  style={{ width: `${enrollment.progressPercent}%` }}
                />
              </div>
              <Button to={`/learn/${course.slug}/`} variant="secondary" fullWidth className="mt-5">
                Open Learning Page
              </Button>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[0, 25, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleProgressUpdate(value)}
                    disabled={updatingProgress}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.9)] px-3 py-2 text-sm font-semibold text-[var(--oman-ink)] transition hover:border-[var(--oman-brass)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </Card>
          ) : null}

          {isPaidCourse && !enrollment && courseOrder ? (
            <Card variant="outline" padding="md" rounded="lg" className="mt-8">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Access request status
              </p>
              <h3 className="mt-3 text-lg font-semibold capitalize text-[var(--oman-ink)]">
                {courseOrder.status.replaceAll("_", " ")}
              </h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                {paidRequestSubmitted
                  ? "Your payment proof was submitted. Admin approval unlocks lessons."
                  : paidRequestApproved
                    ? "Payment approved. Open the learning page or dashboard if needed."
                    : paidRequestClosed
                      ? "This request is closed. Contact support if you need to resubmit."
                      : "This order is waiting for proof of payment."}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--oman-ink)]/70">
                Order {courseOrder.orderNumber} · {courseOrder.totalLabel}
              </p>
              {paidRequestApproved ? (
                <Button to={`/learn/${course.slug}/`} variant="primary" fullWidth className="mt-5">
                  Open Learning Page
                </Button>
              ) : null}
            </Card>
          ) : null}

          {isPaidCourse &&
          !enrollment &&
          !paidRequestSubmitted &&
          !paidRequestApproved &&
          !paidRequestClosed ? (
            <Card variant="outline" padding="md" rounded="lg" className="mt-8">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Bank Muscat phone payment
              </p>
              <form className="mt-4 space-y-4 text-sm leading-6 text-[var(--oman-ink)]/80" onSubmit={handleAccessRequestSubmit}>
                <p>
                  <span className="font-semibold text-[var(--oman-ink)]">Amount:</span> {course.price}
                </p>
                <p>Send the amount to the Bank Muscat phone number with your banking app.</p>
                <div className="rounded-2xl bg-[rgba(244,232,214,0.5)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                    {BANK_MUSCAT_PAYMENT_METHOD}
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-[0.08em] text-[var(--oman-ink)]">
                    {BANK_MUSCAT_PAYMENT_PHONE}
                  </p>
                </div>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Send the requested amount from your bank app.</li>
                  <li>Attach a screenshot or receipt as proof.</li>
                  <li>Send your access request and wait for approval.</li>
                  <li>If access is not approved, request a full refund.</li>
                </ol>

                <div className="rounded-2xl bg-[rgba(255,250,244,0.72)] px-4 py-4 ring-1 ring-[rgba(111,49,29,0.1)]">
                  <p>
                    <span className="font-semibold text-[var(--oman-ink)]">Job seeker name:</span>{" "}
                    {jobSeekerName}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-[var(--oman-ink)]">Email:</span>{" "}
                    {profile?.email || user?.email || t("common.notAvailable")}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--oman-ink)]">
                    Attach proof of payment{" "}
                    <span aria-hidden="true" className="text-[var(--oman-terracotta)]">
                      *
                    </span>
                  </span>
                  <input
                    type="file"
                    required
                    accept={ACCEPTED_UPLOAD_ATTRIBUTE}
                    onChange={handlePaymentProofChange}
                    className="w-full rounded-2xl border border-[rgba(111,49,29,0.16)] bg-[rgba(255,252,247,0.92)] px-4 py-3 text-sm text-[var(--oman-ink)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(197,154,68,0.16)] file:px-4 file:py-2 file:font-semibold file:text-[var(--oman-terracotta-dark)]"
                  />
                  <span className="mt-2 block text-xs leading-5 text-[var(--oman-ink)]/65">
                    Upload a screenshot or receipt. Max {FILE_SIZE_LIMIT_MB} MB.
                  </span>
                  {paymentProofFile ? (
                    <span className="mt-2 inline-flex rounded-full bg-[rgba(255,252,247,0.98)] px-3 py-2 text-xs font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)]">
                      {paymentProofFile.name}
                    </span>
                  ) : null}
                </label>

                <Field
                  label="Payment reference or note"
                  name="paymentReference"
                  type="text"
                  value={paymentReference}
                  onChange={(event) => setPaymentReference(event.target.value)}
                  placeholder="Optional transaction reference, sender name, or note"
                  controlClassName="min-h-12"
                />

                <Button type="submit" variant="primary" fullWidth loading={submittingAccessRequest}>
                  {submittingAccessRequest ? "Sending Access Request..." : "Send Access Request"}
                </Button>
              </form>
            </Card>
          ) : null}

          <Alert
            type={enrollmentFeedback.type}
            message={enrollmentFeedback.message}
            title="Enrollment update"
            className="mt-8"
          />

          {!isPaidCourse ? (
            <>
              <Button
                type="button"
                variant="primary"
                fullWidth
                className="mt-5"
                loading={enrolling}
                disabled={Boolean(enrollment)}
                onClick={handleEnrollment}
              >
                {enrollment
                  ? "Already Enrolled"
                  : enrolling
                    ? "Enrolling..."
                    : user
                      ? "Enroll"
                      : "Sign In To Enroll"}
              </Button>
              <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
                Enrollment opens after course access is approved.
              </p>
            </>
          ) : null}
        </Card>
      </Section>

      {freePreviewLectures.length ? (
        <Section spacing="md">
          <PageHeader
            kicker="Free preview"
            title="Try a lecture before you enroll"
            className="mb-6 max-w-none"
          />
          <div className="mb-4 flex flex-wrap gap-2">
            {freePreviewLectures.map((lecture) => (
              <Button
                key={lecture.id}
                type="button"
                size="sm"
                variant={activePreviewId === lecture.id ? "primary" : "ghost"}
                onClick={() => setActivePreviewId(lecture.id)}
              >
                {lecture.title || lecture.title_en}
              </Button>
            ))}
          </div>
          <LecturePlayerPanel
            lecture={
              freePreviewLectures.find((item) => item.id === activePreviewId) ||
              freePreviewLectures[0]
            }
            sectionTitle="Free preview"
            showComplete={false}
            hasPrev={false}
            hasNext={false}
            onPrev={() => {}}
            onNext={() => {}}
            onToggleComplete={() => {}}
          />
          {!enrollment ? (
            <p className="mt-4 text-center text-sm text-[var(--oman-ink)]/70">
              Enroll to unlock the full curriculum and track your progress.
            </p>
          ) : (
            <div className="mt-4 text-center">
              <Button to={`/learn/${course.slug}/`} variant="primary">
                Open full learning player
              </Button>
            </div>
          )}
        </Section>
      ) : null}

      {enrollment ? (
        <Section spacing="sm">
          <Card variant="soft" padding="md" rounded="lg" className="text-center">
            <p className="text-sm font-semibold text-[var(--oman-ink)]">
              You are enrolled. Continue learning with the full sectioned player.
            </p>
            <Button to={`/learn/${course.slug}/`} variant="secondary" className="mt-4">
              Go to course overview & player
            </Button>
          </Card>
        </Section>
      ) : null}

      <SiteFooter />
    </Page>
  );
}
