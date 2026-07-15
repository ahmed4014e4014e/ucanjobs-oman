import { useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ACCEPTED_UPLOAD_ATTRIBUTE,
  ACCEPTED_UPLOAD_TYPES,
  FILE_SIZE_LIMIT_MB,
  validateUploadSelection,
} from "../lib/fileUploadRules";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  createInstructorApplicant,
  uploadInstructorApplicantAttachments,
} from "../lib/instructorApplicantsApi";
import { themeImages } from "../lib/themeImages";

function formatCopy(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function RequiredLabel({ children }) {
  return (
    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
      {children} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
    </span>
  );
}

export default function InstructorApplication() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const copy = t("tutorApplicationPage");
  const requiredAttachments = copy.attachments;
  const acceptedFilesText = t("common.acceptedFiles")
    .replace("{types}", ACCEPTED_UPLOAD_TYPES.join(", "))
    .replace("{size}", FILE_SIZE_LIMIT_MB);
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    professionalBackground: "",
    portfolioUrl: "",
    courseTopicProposal: "",
    teachingExperience: "",
    paymentDetails: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitState, setSubmitState] = useState({
    loading: false,
    type: "idle",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);
    const { validFiles, errorMessage } = validateUploadSelection(incomingFiles);

    setSelectedFiles(validFiles);

    if (errorMessage) {
      event.target.value = "";
      setSubmitState({
        loading: false,
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      setSubmitState({
        loading: false,
        type: "error",
        message: copy.messages.terms,
      });
      return;
    }

    if (!isSupabaseConfigured) {
      setSubmitState({
        loading: false,
        type: "error",
        message: copy.messages.notConfigured,
      });
      return;
    }

    if (selectedFiles.length === 0) {
      setSubmitState({
        loading: false,
        type: "error",
        message: copy.messages.files,
      });
      return;
    }

    setSubmitState({
      loading: true,
      type: "idle",
      message: "",
    });

    try {
      const uploadedFiles = await uploadInstructorApplicantAttachments(selectedFiles);

      await createInstructorApplicant({
        applicant_profile_id: user?.id || null,
        full_name: formValues.fullName.trim(),
        email: formValues.email.trim(),
        professional_background: formValues.professionalBackground.trim(),
        portfolio_url: formValues.portfolioUrl.trim(),
        course_topic_proposal: formValues.courseTopicProposal.trim(),
        teaching_experience: formValues.teachingExperience.trim(),
        payment_details: formValues.paymentDetails.trim() || null,
        application_message: [
          formatCopy(copy.messages.applicationSubmittedBy, { name: formValues.fullName.trim() }),
          formatCopy(copy.messages.email, { email: formValues.email.trim() }),
          formatCopy(copy.messages.courseTopic, { topic: formValues.courseTopicProposal.trim() }),
          formatCopy(copy.messages.portfolio, { portfolio: formValues.portfolioUrl.trim() }),
        ].join("\n"),
        attachment_notes: requiredAttachments.join("\n"),
        attachment_files: uploadedFiles,
      });

      setSubmitState({
        loading: false,
        type: "success",
        message:
          copy.messages.success,
      });
      setFormValues({
        fullName: "",
        email: "",
        professionalBackground: "",
        portfolioUrl: "",
        courseTopicProposal: "",
        teachingExperience: "",
        paymentDetails: "",
      });
      setSelectedFiles([]);
    } catch (error) {
      setSubmitState({
        loading: false,
        type: "error",
        message: error.message || copy.messages.error,
      });
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
                {copy.heroKicker}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {copy.heroTitle}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {copy.heroText}
              </p>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={themeImages.studentsStudyHall}
                  alt="Learners in a bright workspace"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                {copy.heroCardText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                {copy.formKicker}
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {copy.formTitle}
              </h2>
            </div>
            <Link
              to="/instructor-access/"
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              {copy.back}
            </Link>
          </div>

          <ActionFeedback
            type={submitState.type}
            message={submitState.message}
            title={copy.feedbackTitle}
            className="mt-6"
          />

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-[var(--oman-ink)]/70">
              {t("common.fieldsRequired")}
            </p>
            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.fullName}</RequiredLabel>
              <input
                type="text"
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.email}</RequiredLabel>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.professionalBackground}</RequiredLabel>
              <textarea
                name="professionalBackground"
                value={formValues.professionalBackground}
                onChange={handleChange}
                rows={4}
                required
                placeholder={copy.professionalBackgroundPlaceholder}
                className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.portfolioUrl}</RequiredLabel>
              <input
                type="url"
                name="portfolioUrl"
                value={formValues.portfolioUrl}
                onChange={handleChange}
                required
                placeholder={copy.portfolioUrlPlaceholder}
                className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.courseTopicProposal}</RequiredLabel>
              <textarea
                name="courseTopicProposal"
                value={formValues.courseTopicProposal}
                onChange={handleChange}
                rows={4}
                required
                placeholder={copy.courseTopicPlaceholder}
                className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.teachingExperience}</RequiredLabel>
              <textarea
                name="teachingExperience"
                value={formValues.teachingExperience}
                onChange={handleChange}
                rows={4}
                required
                placeholder={copy.teachingExperiencePlaceholder}
                className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                {copy.paymentDetails}
              </span>
              <textarea
                name="paymentDetails"
                value={formValues.paymentDetails}
                onChange={handleChange}
                rows={3}
                placeholder={copy.paymentDetailsPlaceholder}
                className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
              />
            </label>

            <div className="rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-[var(--oman-ink)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                {copy.requiredAttachments}
              </p>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/80">
                {requiredAttachments.map((item, index) => (
                  <li key={item}>
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </div>

            <label className="flex flex-col gap-2">
              <RequiredLabel>{copy.attachFiles}</RequiredLabel>
              <input
                type="file"
                multiple
                required
                accept={ACCEPTED_UPLOAD_ATTRIBUTE}
                onChange={handleFileChange}
                className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-sm text-[var(--oman-ink)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(197,154,68,0.16)] file:px-4 file:py-2 file:font-semibold file:text-[var(--oman-terracotta-dark)] hover:file:bg-[rgba(197,154,68,0.24)]"
              />
              <p className="text-sm leading-6 text-[var(--oman-ink)]/70">
                {acceptedFilesText}
              </p>
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedFiles.map((file) => (
                    <span
                      key={`${file.name}-${file.size}`}
                      className="rounded-full bg-[rgba(244,232,214,0.44)] px-3 py-2 text-sm font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)]"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </label>

            <label className="flex items-start gap-3 rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[rgba(111,49,29,0.24)] text-[var(--oman-terracotta)] focus:ring-[var(--oman-brass)]"
                required
              />
              <span>
                {copy.termsPrefix}{" "}
                <Link
                  to="/terms/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--oman-terracotta)] underline"
                >
                  {copy.termsLink}
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={submitState.loading}
              className="oman-button-primary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState.loading ? copy.submitting : copy.submit}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
