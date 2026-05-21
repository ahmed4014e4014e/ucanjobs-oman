/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  buildInstructorCards,
  createLearningRequest,
  fetchInstructorDirectory,
  uploadLearningAttachments,
} from "../lib/learningRequestsApi";
import {
  ACCEPTED_UPLOAD_ATTRIBUTE,
  ACCEPTED_UPLOAD_TYPES,
  FILE_SIZE_LIMIT_MB,
  validateUploadSelection,
} from "../lib/fileUploadRules";
import { themeImages } from "../lib/themeImages";

const services = [
  {
    title: "Free Individual Tutoring",
    description:
      "Students can schedule individualized tutoring sessions for free when they need focused help in a course.",
  },
  {
    title: "Free Group Tutoring",
    description:
      "Students can attend group tutoring sessions for free and learn together around shared course topics.",
  },
  {
    title: "Online Learner Community",
    description:
      "College students can ask questions, explain ideas, and help each other understand coursework in a supportive space.",
  },
  {
    title: "Document Library",
    description:
      "Access a free library of documents that helps students review lessons, assignments, and course concepts more clearly.",
  },
  {
    title: "Useful Videos",
    description:
      "Find useful videos that improve understanding of college course material and make difficult topics easier to follow.",
  },
  {
    title: "Course WhatsApp Groups",
    description:
      "Access collections of WhatsApp group chats made for specific college courses so students can get help more easily.",
  },
];

const serviceHighlights = [
  { number: "Live", label: "tutors, courses, and filters loaded from database" },
  { number: "2", label: "session types for private and group support" },
  { number: "Saved", label: "tutoring requests stored in the database" },
];

function getInstructorInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function filterInstructorCards(instructors, selectedInstitute, selectedCourse) {
  if (!selectedInstitute) {
    return [];
  }

  return instructors.filter((instructor) => {
    const instituteMatches = instructor.institutes.includes(selectedInstitute);
    const courseMatches =
      selectedCourse === "All Courses" ||
      instructor.courses.some((course) => course.label === selectedCourse);

    return instituteMatches && courseMatches;
  });
}

function RequiredLabel({ children }) {
  return (
    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
      {children} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
    </span>
  );
}

function formatCopy(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function InstructorSection({
  id,
  label,
  title,
  description,
  instructors,
  selectedInstitute,
  setSelectedInstitute,
  selectedCourse,
  setSelectedCourse,
  onInstructorClick,
  canBook,
  institutes,
  loading,
  authLoading,
  requiresProfileCompletion,
  copy,
}) {
  const hasSelectedInstitute = Boolean(selectedInstitute);
  const availableCourses = useMemo(() => {
    if (!selectedInstitute) {
      return [];
    }

    const relevantInstructors = instructors.filter((instructor) =>
      instructor.institutes.includes(selectedInstitute)
    );

    const uniqueCourses = Array.from(
      new Set(relevantInstructors.flatMap((instructor) => instructor.courses.map((course) => course.label)))
    ).sort();

    return ["All Courses", ...uniqueCourses];
  }, [selectedInstitute, instructors]);

  const hasCourseOptions = availableCourses.length > 1;
  const showLoginPrompt = !canBook;
  const showDirectoryLoading = canBook && (authLoading || loading);

  const filteredInstructors = useMemo(() => {
    if (!selectedInstitute) {
      return [];
    }

    return instructors.filter((instructor) => {
      const instituteMatches = instructor.institutes.includes(selectedInstitute);
      const courseMatches =
        selectedCourse === "All Courses" ||
        instructor.courses.some((course) => course.label === selectedCourse);

      return instituteMatches && courseMatches;
    });
  }, [selectedCourse, selectedInstitute, instructors]);

  const totalCoursesAvailable = useMemo(() => {
    return filteredInstructors.reduce((count, instructor) => count + instructor.courses.length, 0);
  }, [filteredInstructors]);

  useEffect(() => {
    if (!selectedInstitute) {
      if (selectedCourse) {
        setSelectedCourse("");
      }
      return;
    }

    if (!availableCourses.includes(selectedCourse)) {
      setSelectedCourse("All Courses");
    }
  }, [availableCourses, selectedCourse, selectedInstitute, setSelectedCourse]);

  return (
    <section
      id={id}
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-4 sm:scroll-mt-28 sm:px-6 sm:py-8"
    >
      <div className="max-w-2xl text-center lg:text-left">
        <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
          {label}
        </p>
        <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
          {description}
        </p>
      </div>

      <div className="mt-10 rounded-[1.75rem] oman-card p-6 sm:mt-12 sm:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
              {copy.institute}
            </span>
            <select
              value={selectedInstitute}
              onChange={(event) => {
                setSelectedInstitute(event.target.value);
                setSelectedCourse(event.target.value ? "All Courses" : "");
              }}
              className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
            >
              <option value="">{copy.selectUniversity}</option>
              {institutes.map((institute) => (
                <option key={institute} value={institute}>
                  {institute}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
              {copy.course}
            </span>
            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              disabled={!hasSelectedInstitute || !hasCourseOptions}
              className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {!hasSelectedInstitute ? (
                <option value="">{copy.selectUniversityFirst}</option>
              ) : hasCourseOptions ? (
                availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course === "All Courses" ? copy.allCourses : course}
                  </option>
                ))
              ) : (
                <option value="All Courses">{copy.noCourses}</option>
              )}
            </select>
          </label>
        </div>

        {hasSelectedInstitute && !loading && filteredInstructors.length > 0 && (
          <div className="mt-6 rounded-3xl border border-[rgba(197,154,68,0.24)] bg-[rgba(255,244,222,0.74)] p-5 text-[var(--oman-ink)] shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--oman-terracotta)]">
              {copy.availableNow}
            </p>
            <p className="mt-3 text-lg font-semibold sm:text-xl">
              {formatCopy(copy.tutorsAvailable, {
                count: filteredInstructors.length,
                plural: filteredInstructors.length === 1 ? "" : "s",
                title: title.toLowerCase(),
              })}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75 sm:text-base">
              {formatCopy(copy.courseOfferings, {
                count: totalCoursesAvailable,
                plural: totalCoursesAvailable === 1 ? "" : "s",
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {filteredInstructors.map((instructor) => (
                <span
                  key={`${id}-summary-${instructor.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,252,247,0.96)] px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(197,154,68,0.18)] text-xs font-bold text-[var(--oman-terracotta-dark)]">
                    {getInstructorInitials(instructor.name)}
                  </span>
                  {instructor.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {showLoginPrompt ? (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              {requiresProfileCompletion ? (
                <>
                  <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                    {copy.profileRequiredTitle}
                  </h3>
                  <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                    {copy.profileRequiredText}
                  </p>
                  <Link
                    to="/learner-dashboard/"
                    className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                  >
                    {copy.profileRequiredButton}
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                    {copy.loginTitle}
                  </h3>
                  <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                    {copy.loginText}
                  </p>
                </>
              )}
            </div>
          ) : showDirectoryLoading ? (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                {copy.loadingTitle}
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                {copy.loadingText}
              </p>
            </div>
          ) : !hasSelectedInstitute ? (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                {copy.selectInstituteTitle}
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                {copy.selectInstituteText}
              </p>
            </div>
          ) : filteredInstructors.length > 0 ? (
            filteredInstructors.map((instructor) => (
              <article
                key={`${id}-${instructor.id}`}
                className="rounded-3xl border-2 border-[rgba(197,154,68,0.22)] bg-[rgba(255,252,247,0.96)] p-6 shadow-[0_16px_38px_rgba(73,39,27,0.1)] transition hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(73,39,27,0.12)] sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(197,154,68,0.24),rgba(155,77,49,0.22))] text-lg font-bold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]">
                      {getInstructorInitials(instructor.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                        {instructor.name}
                      </h3>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--oman-brass)]">
                        {copy.profileLabel}
                      </p>
                    </div>
                  </div>

                  <span className="oman-chip self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                    {instructor.institutes.length === 1 ? instructor.institutes[0] : copy.multiInstitute}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{instructor.bio}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]/80">
                      {copy.sessionType}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--oman-ink)]">
                      {instructor.sessionType === "private"
                        ? copy.privateSession
                        : copy.groupSession}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]/80">
                      {copy.availability}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--oman-olive)]">
                      {instructor.availability}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]/80">
                    {copy.courses}
                  </p>
                  <span className="rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                    {formatCopy(copy.offered, { count: instructor.courses.length })}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {instructor.courses.map((course) => (
                    <span
                      key={`${id}-${instructor.id}-${course.id}`}
                      className="rounded-full bg-[rgba(255,252,247,0.98)] px-3 py-2 text-sm font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)]"
                    >
                      {course.label}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!canBook}
                  onClick={() => onInstructorClick(instructor)}
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto",
                    canBook
                      ? "oman-button-primary"
                      : "cursor-not-allowed border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] text-[var(--oman-terracotta-dark)] opacity-70",
                  ].join(" ")}
                >
                  {canBook ? copy.sendRequest : copy.loginToSend}
                </button>
                {!canBook && (
                  <p className="mt-3 text-sm leading-6 text-[var(--oman-ink)]/70">
                    {copy.loginNote}
                  </p>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                {copy.emptyTitle}
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                {copy.emptyText}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const page = t("servicesPage");
  const instructorSectionCopy = page.tutorSection;
  const requestModalCopy = page.requestModal;
  const servicesCopy = page.services;
  const serviceHighlightsCopy = page.highlights;
  const serviceCardsCopy = page.cards;
  const acceptedFilesText = t("common.acceptedFiles")
    .replace("{types}", ACCEPTED_UPLOAD_TYPES.join(", "))
    .replace("{size}", FILE_SIZE_LIMIT_MB);
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());
  const [privateInstitute, setPrivateInstitute] = useState("");
  const [privateCourse, setPrivateCourse] = useState("");
  const [groupInstitute, setGroupInstitute] = useState("");
  const [groupCourse, setGroupCourse] = useState("");
  const [privateInstructors, setPrivateInstructors] = useState([]);
  const [groupInstructors, setGroupInstructors] = useState([]);
  const [rawOfferingCount, setRawOfferingCount] = useState(0);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState("");
  const [activeInstructor, setActiveInstructor] = useState(null);
  const [requestTitle, setRequestTitle] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [learnerInstitute, setLearnerInstitute] = useState("");
  const [topicsNeededHelpWith, setTopicsNeededHelpWith] = useState("");
  const [attachmentNotes, setAttachmentNotes] = useState("");
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMessageType, setRequestMessageType] = useState("info");
  const location = useLocation();
  const needsStudentProfileCompletion = Boolean(
    user?.id &&
      (profile?.role === "learner" || profile?.role === "student") &&
      (!profile?.full_name?.trim() || !profile?.institute?.trim())
  );
  const canBook = Boolean(user?.id && profile?.role && !needsStudentProfileCompletion);
  const learnerAccountName = profile?.full_name || user?.user_metadata?.full_name || t("common.notAvailable");
  const learnerAccountEmail = profile?.email || user?.email || t("common.notAvailable");

  const instituteOptions = useMemo(() => {
    const instituteCodes = new Set();

    [...privateInstructors, ...groupInstructors].forEach((instructor) => {
      instructor.institutes.forEach((institute) => instituteCodes.add(institute));
    });

    return Array.from(instituteCodes).sort();
  }, [groupInstructors, privateInstructors]);

  const visiblePrivateInstructors = useMemo(
    () => filterInstructorCards(privateInstructors, privateInstitute, privateCourse),
    [privateCourse, privateInstitute, privateInstructors]
  );

  const visibleGroupInstructors = useMemo(
    () => filterInstructorCards(groupInstructors, groupInstitute, groupCourse),
    [groupCourse, groupInstitute, groupInstructors]
  );

  useEffect(() => {
    if (!location.hash) return;

    const element = document.querySelector(location.hash);
    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  useEffect(() => {
    let ignore = false;

    const loadDirectory = async () => {
      if (!isSupabaseConfigured) {
        setDirectoryError(page.messages.directoryNotConfigured);
        setDirectoryLoading(false);
        return;
      }

      setDirectoryLoading(true);
      setDirectoryError("");

      try {
        const offerings = await fetchInstructorDirectory();

        if (ignore) return;

        setRawOfferingCount(offerings.length);
        setPrivateInstructors(buildInstructorCards(offerings, "private"));
        setGroupInstructors(buildInstructorCards(offerings, "group"));
      } catch (error) {
        if (!ignore) {
          setRawOfferingCount(0);
          setDirectoryError(error.message || "Unable to load the instructor directory right now.");
        }
      } finally {
        if (!ignore) {
          setDirectoryLoading(false);
        }
      }
    };

    loadDirectory();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!activeInstructor) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveInstructor(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeInstructor]);

  useEffect(() => {
    if (!activeInstructor) return;

    const firstCourse = activeInstructor.courses[0];
    setRequestTitle("");
    setSelectedCourseId(firstCourse?.id || "");
    setLearnerInstitute(profile?.institute || user?.user_metadata?.institute || "");
    setTopicsNeededHelpWith("");
    setAttachmentNotes("");
    setSelectedAttachments([]);
    setRequestLoading(false);
    setRequestMessage("");
    setRequestMessageType("info");
  }, [activeInstructor, profile?.institute, user?.user_metadata?.institute]);

  const handleInstructorClick = (instructor) => {
    setActiveInstructor(instructor);
  };

  const handleAttachmentChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);
    const { validFiles, errorMessage } = validateUploadSelection(incomingFiles);

    setSelectedAttachments(validFiles);

    if (errorMessage) {
      event.target.value = "";
      setRequestMessageType("error");
      setRequestMessage(errorMessage);
    }
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();

    if (!user || !activeInstructor || !selectedCourseId) {
      setRequestMessageType("error");
      setRequestMessage(page.messages.loginAndCourse);
      return;
    }

    if (!requestTitle.trim() || !learnerInstitute.trim()) {
      setRequestMessageType("error");
      setRequestMessage(page.messages.requiredTitleInstitute);
      return;
    }

    if (selectedAttachments.length === 0) {
      setRequestMessageType("error");
      setRequestMessage(page.messages.attachmentRequired);
      return;
    }

    const selectedCourse = activeInstructor.courses.find((course) => course.id === selectedCourseId);

    if (!selectedCourse) {
      setRequestMessageType("error");
      setRequestMessage(page.messages.validCourse);
      return;
    }

    setRequestLoading(true);
    setRequestMessage("");

    try {
      const attachmentFiles = await uploadLearningAttachments({
        files: selectedAttachments,
        userId: user.id,
        instructorId: activeInstructor.instructorId,
        sessionType: activeInstructor.sessionType,
      });

      await createLearningRequest({
        learner_id: user.id,
        instructor_id: activeInstructor.instructorId,
        course_id: selectedCourseId,
        session_type: activeInstructor.sessionType,
        institute_name_snapshot: learnerInstitute.trim(),
        topics_needed_help_with: [
          `Title: ${requestTitle.trim()}`,
          `Learner Institute: ${learnerInstitute.trim()}`,
          "",
          "Topics Need Help With:",
          topicsNeededHelpWith.trim(),
        ].join("\n"),
        attachment_notes: attachmentNotes || null,
        attachment_files: attachmentFiles,
      });

      setRequestMessageType("success");
      setRequestMessage(
        page.messages.requestSuccess
      );
      setRequestTitle("");
      setLearnerInstitute(profile?.institute || user?.user_metadata?.institute || "");
      setTopicsNeededHelpWith("");
      setAttachmentNotes("");
      setSelectedAttachments([]);
    } catch (error) {
      setRequestMessageType("error");
      setRequestMessage(error.message || page.messages.requestError);
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.mountainFort})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                {page.heroKicker}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {page.heroTitle}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {page.heroText}
              </p>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={themeImages.studentsGroup}
                  alt="Students gathering around laptops and books"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                {page.heroCardText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 rounded-[1.75rem] oman-card p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          {serviceHighlightsCopy.map((item) => (
            <div key={item.label} className="rounded-2xl oman-outline-panel p-5 text-center sm:p-6">
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
        <div className="grid gap-4 md:grid-cols-3">
          {serviceCardsCopy.map((card) => (
            <div key={card.kicker} className="rounded-[1.6rem] oman-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--oman-terracotta)]">
                {card.kicker}
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {directoryError && (
        <section className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
          <div className="rounded-[1.75rem] border border-[rgba(155,77,49,0.2)] bg-[rgba(255,239,232,0.92)] px-6 py-5 text-[var(--oman-terracotta-dark)] shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">{page.directoryStatus}</p>
            <p className="mt-3 max-w-3xl text-base leading-7">{directoryError}</p>
          </div>
        </section>
      )}

      {!canBook && (
        <section className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
          <div className="rounded-[1.75rem] border border-[rgba(197,154,68,0.28)] bg-[rgba(255,244,222,0.82)] px-6 py-5 text-[var(--oman-terracotta-dark)] shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">{page.requestAccess}</p>
            <p className="mt-3 max-w-3xl text-base leading-7">
              {page.requestAccessText}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/learner-access/"
                className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
              >
                {page.studentLogin}
              </Link>
              <Link
                to="/instructor-access/"
                className="oman-button-primary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
              >
                {page.tutorLogin}
              </Link>
            </div>
          </div>
        </section>
      )}

      <InstructorSection
        id="instructor-directory"
        label={page.private.label}
        title={page.private.title}
        description={page.private.description}
        instructors={privateInstructors}
        selectedInstitute={privateInstitute}
        setSelectedInstitute={setPrivateInstitute}
        selectedCourse={privateCourse}
        setSelectedCourse={setPrivateCourse}
        onInstructorClick={handleInstructorClick}
        canBook={canBook}
        institutes={instituteOptions}
        loading={directoryLoading}
        authLoading={authLoading}
        requiresProfileCompletion={needsStudentProfileCompletion}
        copy={instructorSectionCopy}
      />

      <InstructorSection
        id="group-tutoring"
        label={page.group.label}
        title={page.group.title}
        description={page.group.description}
        instructors={groupInstructors}
        selectedInstitute={groupInstitute}
        setSelectedInstitute={setGroupInstitute}
        selectedCourse={groupCourse}
        setSelectedCourse={setGroupCourse}
        onInstructorClick={handleInstructorClick}
        canBook={canBook}
        institutes={instituteOptions}
        loading={directoryLoading}
        authLoading={authLoading}
        requiresProfileCompletion={needsStudentProfileCompletion}
        copy={instructorSectionCopy}
      />

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {page.otherKicker}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            {page.otherTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {servicesCopy.map((service) => (
            <article key={service.title} className="rounded-3xl oman-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{service.title}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {page.whyKicker}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            {page.whyTitle}
          </h2>
        </div>

        <div className="space-y-5 rounded-[1.75rem] oman-card p-6 text-base leading-7 text-[var(--oman-ink)]/75 sm:p-8 sm:text-lg sm:leading-8">
          <p>
            {page.whyTextOne}
          </p>
          <p>
            {page.whyTextTwo}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[1.75rem] oman-dark-panel px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
            {page.ctaKicker}
          </p>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            {page.ctaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
            {page.ctaText}
          </p>
          <button className="oman-button-primary mt-8 w-full rounded-2xl px-8 py-3 font-semibold transition sm:w-auto">
            {page.ctaButton}
          </button>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>

      {activeInstructor && (
        <div className="oman-overlay fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] oman-card p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setActiveInstructor(null)}
              className="absolute right-4 top-4 rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.2)]"
              aria-label={t("common.close")}
            >
              {t("common.close")}
            </button>

            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              {requestModalCopy.kicker}
            </p>
            <h3 className="oman-title-accent mt-4 pr-16 text-2xl font-semibold sm:text-3xl">
              {formatCopy(requestModalCopy.title, { name: activeInstructor.name })}
            </h3>

            <div className="mt-6 rounded-3xl oman-outline-panel p-5 sm:p-6">
              <p className="text-base leading-7 text-[var(--oman-ink)]">
                {requestModalCopy.intro}
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleRequestSubmit}>
                <p className="text-sm leading-6 text-[var(--oman-ink)]/70">
                  {t("common.fieldsRequired")}
                </p>

                <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]/80 ring-1 ring-[rgba(111,49,29,0.1)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    {requestModalCopy.studentAccount}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">{requestModalCopy.name}</span>{" "}
                      {learnerAccountName}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">{requestModalCopy.email}</span>{" "}
                      {learnerAccountEmail}
                    </p>
                  </div>
                  <p className="mt-3 text-[var(--oman-ink)]/70">
                    {requestModalCopy.accountNote}
                  </p>
                </div>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{requestModalCopy.titleLabel}</RequiredLabel>
                  <input
                    type="text"
                    value={requestTitle}
                    onChange={(event) => setRequestTitle(event.target.value)}
                    placeholder={requestModalCopy.titlePlaceholder}
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{requestModalCopy.instituteLabel}</RequiredLabel>
                  <input
                    type="text"
                    value={learnerInstitute}
                    onChange={(event) => setLearnerInstitute(event.target.value)}
                    placeholder={requestModalCopy.institutePlaceholder}
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{requestModalCopy.courseLabel}</RequiredLabel>
                  <select
                    value={selectedCourseId}
                    onChange={(event) => setSelectedCourseId(event.target.value)}
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                    required
                  >
                    {activeInstructor.courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{requestModalCopy.topicsLabel}</RequiredLabel>
                  <textarea
                    value={topicsNeededHelpWith}
                    onChange={(event) => setTopicsNeededHelpWith(event.target.value)}
                    rows={4}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                    placeholder={requestModalCopy.topicsPlaceholder}
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{requestModalCopy.attachFiles}</RequiredLabel>
                  <input
                    type="file"
                    multiple
                    required
                    accept={ACCEPTED_UPLOAD_ATTRIBUTE}
                    onChange={handleAttachmentChange}
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-sm text-[var(--oman-ink)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(197,154,68,0.16)] file:px-4 file:py-2 file:font-semibold file:text-[var(--oman-terracotta-dark)] focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                  <p className="text-sm leading-6 text-[var(--oman-ink)]/70">
                    {acceptedFilesText}
                  </p>
                  {selectedAttachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedAttachments.map((file) => (
                        <span
                          key={`${file.name}-${file.size}`}
                          className="rounded-full bg-[rgba(255,252,247,0.98)] px-3 py-2 text-sm font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)]"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    {requestModalCopy.attachmentNotes}
                  </span>
                  <textarea
                    value={attachmentNotes}
                    onChange={(event) => setAttachmentNotes(event.target.value)}
                    rows={3}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                    placeholder={requestModalCopy.attachmentPlaceholder}
                  />
                </label>

                <ActionFeedback
                  type={requestMessageType}
                  message={requestMessage}
                  title={requestModalCopy.feedbackTitle}
                />

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="oman-button-secondary inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {requestLoading ? requestModalCopy.saving : requestModalCopy.save}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
