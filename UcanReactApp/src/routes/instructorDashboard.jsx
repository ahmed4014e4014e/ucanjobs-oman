import { useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { submitInstructorCourseProposal } from "../lib/courseProposalApi";
import { isSupabaseConfigured } from "../lib/supabase";
import { themeImages } from "../lib/themeImages";

const creationKit = [
  "Course title and target learner level",
  "Career outcome the course supports",
  "Course summary and learning outcomes",
  "Module-by-module course outline",
  "Required tools, software, and resources",
  "Portfolio project or final practical task",
];

const publicationChecklist = [
  "The course teaches a clear employability skill",
  "Modules are structured and practical",
  "Learning outcomes are specific and measurable",
  "Any third-party materials are properly licensed",
  "The course avoids misleading job guarantees",
  "Admin review is completed before publication",
];

const reviewSteps = [
  "Prepare your course proposal and teaching materials.",
  "Submit your course proposal from this dashboard.",
  "Ucan reviews the instructor profile and course fit.",
  "Admin requests edits if the proposal needs refinement.",
  "Approved courses are prepared for learner enrollment.",
];

const futureTools = [
  "Course publishing dashboard",
  "Learner enrollment overview",
  "Course performance analytics",
  "AI-assisted topic recommendations",
];

const initialProposalForm = {
  courseTitle: "",
  courseCategory: "Software Engineering",
  targetLevel: "Beginner",
  careerOutcome: "",
  courseSummary: "",
  learningOutcomes: "",
  moduleOutline: "",
  requiredTools: "",
  finalProject: "",
  suggestedDuration: "",
  suggestedPriceOmr: "",
  additionalNotes: "",
};

const courseCategories = [
  "Software Engineering",
  "Frontend Development",
  "Backend Development",
  "AI and Machine Learning",
  "Cyber Security",
  "Data Analytics",
  "Cloud and DevOps",
  "Career Readiness",
];

const targetLevels = ["Beginner", "Beginner to Intermediate", "Intermediate", "Advanced"];

export default function InstructorDashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const copy = t("tutorDashboard");
  const name = profile?.full_name || user?.user_metadata?.full_name || copy.fallbackName;
  const institute = profile?.institute || user?.user_metadata?.institute || copy.notSet;
  const [proposalForm, setProposalForm] = useState(initialProposalForm);
  const [proposalSaving, setProposalSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const updateProposalField = (field, value) => {
    setProposalForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProposalSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setFeedback({
        type: "error",
        message: "Please log in as an instructor before submitting a course proposal.",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      setFeedback({
        type: "error",
        message: "database is not configured yet, so the proposal cannot be submitted.",
      });
      return;
    }

    const requiredFields = [
      "courseTitle",
      "courseCategory",
      "targetLevel",
      "careerOutcome",
      "courseSummary",
      "learningOutcomes",
      "moduleOutline",
      "suggestedPriceOmr",
    ];
    const missingRequiredField = requiredFields.some((field) => !proposalForm[field].trim());

    if (missingRequiredField) {
      setFeedback({
        type: "error",
        message: "Please complete the required course proposal fields before submitting.",
      });
      return;
    }

    const suggestedPrice = Number(proposalForm.suggestedPriceOmr);

    if (!Number.isFinite(suggestedPrice) || suggestedPrice < 5 || suggestedPrice > 15) {
      setFeedback({
        type: "error",
        message: "Please enter a suggested price between 5 OMR and 15 OMR.",
      });
      return;
    }

    setProposalSaving(true);
    setFeedback({ type: "idle", message: "" });

    try {
      await submitInstructorCourseProposal({
        instructor_id: user.id,
        instructor_email: user.email,
        instructor_name: name,
        course_title: proposalForm.courseTitle.trim(),
        course_category: proposalForm.courseCategory.trim(),
        target_level: proposalForm.targetLevel.trim(),
        career_outcome: proposalForm.careerOutcome.trim(),
        course_summary: proposalForm.courseSummary.trim(),
        learning_outcomes: proposalForm.learningOutcomes.trim(),
        module_outline: proposalForm.moduleOutline.trim(),
        required_tools: proposalForm.requiredTools.trim() || null,
        final_project: proposalForm.finalProject.trim() || null,
        suggested_duration: proposalForm.suggestedDuration.trim() || null,
        suggested_price_omr: suggestedPrice,
        additional_notes: proposalForm.additionalNotes.trim() || null,
        status: "pending",
      });

      setProposalForm(initialProposalForm);
      setFeedback({
        type: "success",
        message: "Your course proposal was submitted successfully for admin review.",
      });
    } catch (submitError) {
      setFeedback({
        type: "error",
        message:
          submitError.message ||
          "Unable to submit this course proposal right now. Please try again.",
      });
    } finally {
      setProposalSaving(false);
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{ backgroundImage: `url(${themeImages.heroFort})` }}
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
                <img src={themeImages.mountainFort} alt="Historic Omani fort with mountain scenery" />
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
          <div className="mt-6 space-y-4 text-[var(--oman-ink)]/80">
            <p>
              <span className="font-semibold">{copy.labels.fullName}</span> {name}
            </p>
            <p>
              <span className="font-semibold">{copy.labels.email}</span> {user?.email || copy.notSet}
            </p>
            <p>
              <span className="font-semibold">{copy.labels.institute}</span> {institute}
            </p>
            <p>
              <span className="font-semibold">{copy.labels.role}</span> {copy.role}
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Instructor Publishing
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Build career-preparation courses for Oman&apos;s next tech workforce.
          </h2>
          <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
            Ucan is moving toward a controlled course marketplace. At this stage,
            instructors submit course proposals while admin review keeps publishing
            quality consistent before courses go live.
          </p>
          <Link
            to="/instructor-courses/"
            className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
          >
            Open My Courses
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl oman-outline-panel p-5">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                Course Creation Kit
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                {creationKit.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl oman-outline-panel p-5">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                Publication Checklist
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                {publicationChecklist.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl oman-outline-panel p-5">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                Review Workflow
              </h3>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--oman-ink)]/75">
                {reviewSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(197,154,68,0.16)] text-xs font-bold text-[var(--oman-terracotta-dark)]">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-3xl oman-outline-panel p-5">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                Instructor Tools Coming Soon
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {futureTools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-2 text-xs font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.1)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
                For now, publishing remains admin-reviewed so the platform can grow with
                a strong quality standard.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <form onSubmit={handleProposalSubmit} className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Course Proposal Submission
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            Submit a course idea for admin review
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--oman-ink)]/75">
            Use this form to propose a practical course for Ucan. Fields marked with * are
            required, and detailed module/outcome text helps admin assess the course faster.
          </p>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title="Course proposal update"
            className="mt-6"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Course title *
              </span>
              <input
                type="text"
                value={proposalForm.courseTitle}
                onChange={(event) => updateProposalField("courseTitle", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Course category *
              </span>
              <select
                value={proposalForm.courseCategory}
                onChange={(event) => updateProposalField("courseCategory", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              >
                {courseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Target level *
              </span>
              <select
                value={proposalForm.targetLevel}
                onChange={(event) => updateProposalField("targetLevel", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              >
                {targetLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Career outcome *
              </span>
              <input
                type="text"
                value={proposalForm.careerOutcome}
                onChange={(event) => updateProposalField("careerOutcome", event.target.value)}
                placeholder="Example: Prepare learners for junior frontend developer roles"
                className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Course summary *
              </span>
              <textarea
                value={proposalForm.courseSummary}
                onChange={(event) => updateProposalField("courseSummary", event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Learning outcomes *
              </span>
              <textarea
                value={proposalForm.learningOutcomes}
                onChange={(event) => updateProposalField("learningOutcomes", event.target.value)}
                rows={6}
                placeholder="One outcome per line"
                className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Module outline *
              </span>
              <textarea
                value={proposalForm.moduleOutline}
                onChange={(event) => updateProposalField("moduleOutline", event.target.value)}
                rows={6}
                placeholder="One module per line"
                className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Required tools
              </span>
              <textarea
                value={proposalForm.requiredTools}
                onChange={(event) => updateProposalField("requiredTools", event.target.value)}
                rows={4}
                placeholder="Example: VS Code, GitHub, Figma, Python, Excel"
                className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Final project
              </span>
              <textarea
                value={proposalForm.finalProject}
                onChange={(event) => updateProposalField("finalProject", event.target.value)}
                rows={4}
                placeholder="Describe the portfolio task or final assignment"
                className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Number of hours of course delivered video content (approximated)
              </span>
              <input
                type="text"
                value={proposalForm.suggestedDuration}
                onChange={(event) => updateProposalField("suggestedDuration", event.target.value)}
                placeholder="Example: 8 hours"
                className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Suggested price OMR * (5-15 OMR)
              </span>
              <input
                type="number"
                min="5"
                max="15"
                step="0.001"
                value={proposalForm.suggestedPriceOmr}
                onChange={(event) => updateProposalField("suggestedPriceOmr", event.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                required
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                Additional notes
              </span>
              <textarea
                value={proposalForm.additionalNotes}
                onChange={(event) => updateProposalField("additionalNotes", event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={proposalSaving}
              className="oman-button-primary inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {proposalSaving ? "Submitting..." : "Submit Course Proposal"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
