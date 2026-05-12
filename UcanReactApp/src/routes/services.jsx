/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  buildTutorCards,
  createTutoringRequest,
  fetchTutorDirectory,
  uploadTutoringAttachments,
} from "../lib/tutoringApi";
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
    title: "Online Student Community",
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
  { number: "Live", label: "tutors, courses, and filters loaded from Supabase" },
  { number: "2", label: "session types for private and group support" },
  { number: "Saved", label: "tutoring requests stored in the database" },
];

function getTutorInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function filterTutorCards(tutors, selectedInstitute, selectedCourse) {
  return tutors.filter((tutor) => {
    const instituteMatches =
      selectedInstitute === "All Institutes" || tutor.institutes.includes(selectedInstitute);
    const courseMatches =
      selectedCourse === "All Courses" ||
      tutor.courses.some((course) => course.label === selectedCourse);

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

function TutorSection({
  id,
  label,
  title,
  description,
  tutors,
  selectedInstitute,
  setSelectedInstitute,
  selectedCourse,
  setSelectedCourse,
  onTutorClick,
  canBook,
  institutes,
  loading,
  authLoading,
}) {
  const availableCourses = useMemo(() => {
    const relevantTutors =
      selectedInstitute === "All Institutes"
        ? tutors
        : tutors.filter((tutor) => tutor.institutes.includes(selectedInstitute));

    const uniqueCourses = Array.from(
      new Set(relevantTutors.flatMap((tutor) => tutor.courses.map((course) => course.label)))
    ).sort();

    return ["All Courses", ...uniqueCourses];
  }, [selectedInstitute, tutors]);

  const hasCourseOptions = availableCourses.length > 1;
  const shouldHideDirectory = !canBook;
  const showLoginPrompt = !canBook;
  const showDirectoryLoading = canBook && (authLoading || loading);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const instituteMatches =
        selectedInstitute === "All Institutes" || tutor.institutes.includes(selectedInstitute);
      const courseMatches =
        selectedCourse === "All Courses" ||
        tutor.courses.some((course) => course.label === selectedCourse);

      return instituteMatches && courseMatches;
    });
  }, [selectedCourse, selectedInstitute, tutors]);

  const totalCoursesAvailable = useMemo(() => {
    return filteredTutors.reduce((count, tutor) => count + tutor.courses.length, 0);
  }, [filteredTutors]);

  useEffect(() => {
    if (!availableCourses.includes(selectedCourse)) {
      setSelectedCourse("All Courses");
    }
  }, [availableCourses, selectedCourse, setSelectedCourse]);

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
              Institute
            </span>
            <select
              value={selectedInstitute}
              onChange={(event) => setSelectedInstitute(event.target.value)}
              className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
            >
              {institutes.map((institute) => (
                <option key={institute} value={institute}>
                  {institute}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
              Course
            </span>
            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              disabled={!hasCourseOptions}
              className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {hasCourseOptions ? (
                availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))
              ) : (
                <option value="All Courses">No courses available yet</option>
              )}
            </select>
          </label>
        </div>

        {!loading && filteredTutors.length > 0 && (
          <div className="mt-6 rounded-3xl border border-[rgba(197,154,68,0.24)] bg-[rgba(255,244,222,0.74)] p-5 text-[var(--oman-ink)] shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--oman-terracotta)]">
              Available Now
            </p>
            <p className="mt-3 text-lg font-semibold sm:text-xl">
              {filteredTutors.length} tutor{filteredTutors.length === 1 ? "" : "s"} available for{" "}
              {title.toLowerCase()}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75 sm:text-base">
              {totalCoursesAvailable} course offering
              {totalCoursesAvailable === 1 ? "" : "s"} currently match your selected filters.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {filteredTutors.map((tutor) => (
                <span
                  key={`${id}-summary-${tutor.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,252,247,0.96)] px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.12)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(197,154,68,0.18)] text-xs font-bold text-[var(--oman-terracotta-dark)]">
                    {getTutorInitials(tutor.name)}
                  </span>
                  {tutor.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {showLoginPrompt ? (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Please login / sign up to view available tutors
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Create an account or log in first to access the private and group tutoring
                directory and send a tutoring request.
              </p>
            </div>
          ) : showDirectoryLoading ? (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Loading tutor directory...
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Fetching tutors, courses, and available session types from Supabase.
              </p>
            </div>
          ) : filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <article
                key={`${id}-${tutor.id}`}
                className="rounded-3xl border-2 border-[rgba(197,154,68,0.22)] bg-[rgba(255,252,247,0.96)] p-6 shadow-[0_16px_38px_rgba(73,39,27,0.1)] transition hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(73,39,27,0.12)] sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(197,154,68,0.24),rgba(155,77,49,0.22))] text-lg font-bold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]">
                      {getTutorInitials(tutor.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                        {tutor.name}
                      </h3>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--oman-brass)]">
                        Free tutoring tutor profile
                      </p>
                    </div>
                  </div>

                  <span className="oman-chip self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                    {tutor.institutes.length === 1 ? tutor.institutes[0] : "Multi Institute"}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{tutor.bio}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]/80">
                      Session Type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--oman-ink)]">
                      {tutor.sessionType === "private"
                        ? "Private one-on-one tutoring"
                        : "Group tutoring session"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]/80">
                      Availability
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--oman-olive)]">
                      {tutor.availability}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--oman-terracotta)]/80">
                    Courses
                  </p>
                  <span className="rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                    {tutor.courses.length} offered
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tutor.courses.map((course) => (
                    <span
                      key={`${id}-${tutor.id}-${course.id}`}
                      className="rounded-full bg-[rgba(255,252,247,0.98)] px-3 py-2 text-sm font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)]"
                    >
                      {course.label}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!canBook}
                  onClick={() => onTutorClick(tutor)}
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto",
                    canBook
                      ? "oman-button-primary"
                      : "cursor-not-allowed border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] text-[var(--oman-terracotta-dark)] opacity-70",
                  ].join(" ")}
                >
                  {canBook ? "Send Tutoring Request" : "Log in to send tutoring request"}
                </button>
                {!canBook && (
                  <p className="mt-3 text-sm leading-6 text-[var(--oman-ink)]/70">
                    Please log in to your student or tutor account before sending a tutoring
                    session.
                  </p>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-3xl oman-outline-panel p-6 text-center sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                No tutor listed yet for this selection
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Once more tutors and course offerings are added in Supabase, this directory will
                update automatically.
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
  const [privateInstitute, setPrivateInstitute] = useState("All Institutes");
  const [privateCourse, setPrivateCourse] = useState("All Courses");
  const [groupInstitute, setGroupInstitute] = useState("All Institutes");
  const [groupCourse, setGroupCourse] = useState("All Courses");
  const [privateTutors, setPrivateTutors] = useState([]);
  const [groupTutors, setGroupTutors] = useState([]);
  const [rawOfferingCount, setRawOfferingCount] = useState(0);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState("");
  const [activeTutor, setActiveTutor] = useState(null);
  const [requestTitle, setRequestTitle] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentInstitute, setStudentInstitute] = useState("");
  const [topicsNeededHelpWith, setTopicsNeededHelpWith] = useState("");
  const [attachmentNotes, setAttachmentNotes] = useState("");
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMessageType, setRequestMessageType] = useState("info");
  const location = useLocation();
  const canBook = Boolean(user?.id && profile?.role);
  const studentAccountName = profile?.full_name || user?.user_metadata?.full_name || "Not available";
  const studentAccountEmail = profile?.email || user?.email || "Not available";

  const instituteOptions = useMemo(() => {
    const instituteCodes = new Set();

    [...privateTutors, ...groupTutors].forEach((tutor) => {
      tutor.institutes.forEach((institute) => instituteCodes.add(institute));
    });

    return ["All Institutes", ...Array.from(instituteCodes).sort()];
  }, [groupTutors, privateTutors]);

  const visiblePrivateTutors = useMemo(
    () => filterTutorCards(privateTutors, privateInstitute, privateCourse),
    [privateCourse, privateInstitute, privateTutors]
  );

  const visibleGroupTutors = useMemo(
    () => filterTutorCards(groupTutors, groupInstitute, groupCourse),
    [groupCourse, groupInstitute, groupTutors]
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
        setDirectoryError(
          "Supabase is not configured yet. Add your environment variables before using the live tutor directory."
        );
        setDirectoryLoading(false);
        return;
      }

      setDirectoryLoading(true);
      setDirectoryError("");

      try {
        const offerings = await fetchTutorDirectory();

        if (ignore) return;

        setRawOfferingCount(offerings.length);
        setPrivateTutors(buildTutorCards(offerings, "private"));
        setGroupTutors(buildTutorCards(offerings, "group"));
      } catch (error) {
        if (!ignore) {
          setRawOfferingCount(0);
          setDirectoryError(error.message || "Unable to load the tutor directory right now.");
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
    if (!activeTutor) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveTutor(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeTutor]);

  useEffect(() => {
    if (!activeTutor) return;

    const firstCourse = activeTutor.courses[0];
    setRequestTitle("");
    setSelectedCourseId(firstCourse?.id || "");
    setStudentInstitute(profile?.institute || user?.user_metadata?.institute || "");
    setTopicsNeededHelpWith("");
    setAttachmentNotes("");
    setSelectedAttachments([]);
    setRequestLoading(false);
    setRequestMessage("");
    setRequestMessageType("info");
  }, [activeTutor, profile?.institute, user?.user_metadata?.institute]);

  const handleTutorClick = (tutor) => {
    setActiveTutor(tutor);
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

    if (!user || !activeTutor || !selectedCourseId) {
      setRequestMessageType("error");
      setRequestMessage("Please log in and choose a course before submitting a request.");
      return;
    }

    if (!requestTitle.trim() || !studentInstitute.trim()) {
      setRequestMessageType("error");
      setRequestMessage("Please complete the required title and student institute fields.");
      return;
    }

    if (selectedAttachments.length === 0) {
      setRequestMessageType("error");
      setRequestMessage("Please attach at least one file before submitting your tutoring request.");
      return;
    }

    const selectedCourse = activeTutor.courses.find((course) => course.id === selectedCourseId);

    if (!selectedCourse) {
      setRequestMessageType("error");
      setRequestMessage("Please choose a valid course for this tutor.");
      return;
    }

    setRequestLoading(true);
    setRequestMessage("");

    try {
      const attachmentFiles = await uploadTutoringAttachments({
        files: selectedAttachments,
        userId: user.id,
        tutorId: activeTutor.tutorId,
        sessionType: activeTutor.sessionType,
      });

      await createTutoringRequest({
        student_id: user.id,
        tutor_id: activeTutor.tutorId,
        course_id: selectedCourseId,
        session_type: activeTutor.sessionType,
        institute_name_snapshot: studentInstitute.trim(),
        topics_needed_help_with: [
          `Title: ${requestTitle.trim()}`,
          `Student Institute: ${studentInstitute.trim()}`,
          "",
          "Topics Need Help With:",
          topicsNeededHelpWith.trim(),
        ].join("\n"),
        attachment_notes: attachmentNotes || null,
        attachment_files: attachmentFiles,
      });

      setRequestMessageType("success");
      setRequestMessage(
        "Your tutoring request was saved successfully. The tutor can now contact you directly to arrange the session."
      );
      setRequestTitle("");
      setStudentInstitute(profile?.institute || user?.user_metadata?.institute || "");
      setTopicsNeededHelpWith("");
      setAttachmentNotes("");
      setSelectedAttachments([]);
    } catch (error) {
      setRequestMessageType("error");
      setRequestMessage(error.message || "We could not save your tutoring request.");
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
                Our Services
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                Free tutoring and student support presented through a full-stack learning hub.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                Ucan Oman now loads tutor offerings from the community - based platform updated regularely with our rapid increasing fan base!
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
                Explore private tutoring, group sessions, and live course offerings to enhance your understanding and get better grades confidentely.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 rounded-[1.75rem] oman-card p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          {serviceHighlights.map((item) => (
            <div key={item.label} className="rounded-2xl oman-outline-panel p-5 text-center sm:p-6">
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.6rem] oman-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--oman-terracotta)]">
              Tutor Directory
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
              Browse live tutors by institute and course.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">
              Every tutor card below is regularely updated depending the new tutors on every institute.
            </p>
          </div>
          <div className="rounded-[1.6rem] oman-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--oman-terracotta)]">
              Student Requests
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
              Send a tutoring request directly to the tutor.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">
              Logged-in students can submit their request details, and tutors can then follow up directly.
            </p>
          </div>
          <div className="rounded-[1.6rem] oman-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--oman-terracotta)]">
              Dynamic Environment
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--oman-ink)]">
              Adding more tutors from different institutes covering a wide range of diversified courses collection.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">
              New tutors, institutes, and courses will slot directly into this directory structure.
            </p>
          </div>
        </div>
      </section>

      {directoryError && (
        <section className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
          <div className="rounded-[1.75rem] border border-[rgba(155,77,49,0.2)] bg-[rgba(255,239,232,0.92)] px-6 py-5 text-[var(--oman-terracotta-dark)] shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">Directory Status</p>
            <p className="mt-3 max-w-3xl text-base leading-7">{directoryError}</p>
          </div>
        </section>
      )}

      {!canBook && (
        <section className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
          <div className="rounded-[1.75rem] border border-[rgba(197,154,68,0.28)] bg-[rgba(255,244,222,0.82)] px-6 py-5 text-[var(--oman-terracotta-dark)] shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">Request Access</p>
            <p className="mt-3 max-w-3xl text-base leading-7">
              You can explore the tutor directory freely, but you need to log in before sending a
              tutoring request.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/student-access/"
                className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
              >
                Student Login
              </Link>
              <Link
                to="/tutor-access/"
                className="oman-button-primary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
              >
                Tutor Login
              </Link>
            </div>
          </div>
        </section>
      )}

      <TutorSection
        id="tutor-directory"
        label="Private Tutoring"
        title="Find available tutors for private one-on-one support."
        description="Select an institute and course to see which private tutors are currently available."
        tutors={privateTutors}
        selectedInstitute={privateInstitute}
        setSelectedInstitute={setPrivateInstitute}
        selectedCourse={privateCourse}
        setSelectedCourse={setPrivateCourse}
        onTutorClick={handleTutorClick}
        canBook={canBook}
        institutes={instituteOptions}
        loading={directoryLoading}
        authLoading={authLoading}
      />

      <TutorSection
        id="group-tutoring"
        label="Group Tutoring"
        title="Find available tutors for free group tutoring sessions."
        description="Use the same filters to explore group tutoring options for supported institutes and courses."
        tutors={groupTutors}
        selectedInstitute={groupInstitute}
        setSelectedInstitute={setGroupInstitute}
        selectedCourse={groupCourse}
        setSelectedCourse={setGroupCourse}
        onTutorClick={handleTutorClick}
        canBook={canBook}
        institutes={instituteOptions}
        loading={directoryLoading}
        authLoading={authLoading}
      />

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            What Else We Offer
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            More free ways for students to study better and support each other.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
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
            Why It Matters
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            Students need support that is free, practical, and connected to real coursework.
          </h2>
        </div>

        <div className="space-y-5 rounded-[1.75rem] oman-card p-6 text-base leading-7 text-[var(--oman-ink)]/75 sm:p-8 sm:text-lg sm:leading-8">
          <p>
            Our tutor directory can grow from the database as new
            tutors, institutes, and courses are added.
          </p>
          <p>
            Student tutoring requests are submited, tracked, and returned.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[1.75rem] oman-dark-panel px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
            Start Your Journey
          </p>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            Explore free tutoring, resources, and course communities today.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
            Ucan Oman is built to help students find support faster and improve their
            understanding across the courses they are taking.
          </p>
          <button className="oman-button-primary mt-8 w-full rounded-2xl px-8 py-3 font-semibold transition sm:w-auto">
            Explore Courses
          </button>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        Copyright {new Date().getFullYear()} Ucan Oman. Free learning support for everyone.
      </footer>

      {activeTutor && (
        <div className="oman-overlay fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] oman-card p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setActiveTutor(null)}
              className="absolute right-4 top-4 rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.2)]"
              aria-label="Close popup"
            >
              Close
            </button>

            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Tutoring Request
            </p>
            <h3 className="oman-title-accent mt-4 pr-16 text-2xl font-semibold sm:text-3xl">
              Send a tutoring request to {activeTutor.name}
            </h3>

            <div className="mt-6 rounded-3xl oman-outline-panel p-5 sm:p-6">
              <p className="text-base leading-7 text-[var(--oman-ink)]">
                Please save your tutoring request below and attach any helpful files so the tutor
                can contact you directly and arrange the session with you.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleRequestSubmit}>
                <p className="text-sm leading-6 text-[var(--oman-ink)]/70">
                  Fields marked with <span className="font-semibold text-[var(--oman-terracotta)]">*</span> are required.
                </p>

                <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]/80 ring-1 ring-[rgba(111,49,29,0.1)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Student account
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">Name:</span>{" "}
                      {studentAccountName}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">Email:</span>{" "}
                      {studentAccountEmail}
                    </p>
                  </div>
                  <p className="mt-3 text-[var(--oman-ink)]/70">
                    These details are pulled automatically from your logged-in student account and
                    shown to the tutor with this request.
                  </p>
                </div>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>Title</RequiredLabel>
                  <input
                    type="text"
                    value={requestTitle}
                    onChange={(event) => setRequestTitle(event.target.value)}
                    placeholder="Example: Help with MAT255 midterm review"
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>Student university name</RequiredLabel>
                  <input
                    type="text"
                    value={studentInstitute}
                    onChange={(event) => setStudentInstitute(event.target.value)}
                    placeholder="Example: MCBS"
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>Course</RequiredLabel>
                  <select
                    value={selectedCourseId}
                    onChange={(event) => setSelectedCourseId(event.target.value)}
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                    required
                  >
                    {activeTutor.courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>Topics need help with</RequiredLabel>
                  <textarea
                    value={topicsNeededHelpWith}
                    onChange={(event) => setTopicsNeededHelpWith(event.target.value)}
                    rows={4}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                    placeholder="Describe the topics, concepts, assignments, or exam areas you need help with."
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>Attach files</RequiredLabel>
                  <input
                    type="file"
                    multiple
                    required
                    accept={ACCEPTED_UPLOAD_ATTRIBUTE}
                    onChange={handleAttachmentChange}
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-sm text-[var(--oman-ink)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(197,154,68,0.16)] file:px-4 file:py-2 file:font-semibold file:text-[var(--oman-terracotta-dark)] focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                  <p className="text-sm leading-6 text-[var(--oman-ink)]/70">
                    Accepted files: {ACCEPTED_UPLOAD_TYPES.join(", ")}. Maximum size:{" "}
                    {FILE_SIZE_LIMIT_MB} MB per file.
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
                    Attachment notes
                  </span>
                  <textarea
                    value={attachmentNotes}
                    onChange={(event) => setAttachmentNotes(event.target.value)}
                    rows={3}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                    placeholder="Mention any files, screenshots, or notes you plan to include in your email."
                  />
                </label>

                <ActionFeedback
                  type={requestMessageType}
                  message={requestMessage}
                  title="Tutoring request update"
                />

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="oman-button-secondary inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {requestLoading ? "Saving Request..." : "Save Tutoring Request"}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
