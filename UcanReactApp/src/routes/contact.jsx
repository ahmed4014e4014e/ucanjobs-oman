import { useState } from "react";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { createContactMessage, uploadContactAttachments } from "../lib/contactApi";
import {
  ACCEPTED_UPLOAD_ATTRIBUTE,
  ACCEPTED_UPLOAD_TYPES,
  FILE_SIZE_LIMIT_MB,
  validateUploadSelection,
} from "../lib/fileUploadRules";
import { isSupabaseConfigured } from "../lib/supabase";
import { themeImages } from "../lib/themeImages";

function RequiredLabel({ children }) {
  return (
    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
      {children} <span aria-hidden="true" className="text-[var(--oman-terracotta)]">*</span>
    </span>
  );
}

export default function Contact() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const contactMethods = t("contact.methods");
  const acceptedFilesText = t("common.acceptedFiles")
    .replace("{types}", ACCEPTED_UPLOAD_TYPES.join(", "))
    .replace("{size}", FILE_SIZE_LIMIT_MB);
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());
  const [formValues, setFormValues] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || "",
    email: profile?.email || user?.email || "",
    institute: profile?.institute || user?.user_metadata?.institute || "",
    role: profile?.role || "",
    subject: "",
    message: "",
  });
  const [attachmentNotes, setAttachmentNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
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

    if (!isSupabaseConfigured) {
      setSubmitState({
        loading: false,
        type: "error",
        message: t("contact.notConfigured"),
      });
      return;
    }

    setSubmitState({
      loading: true,
      type: "idle",
      message: "",
    });

    try {
      const uploadedFiles = await uploadContactAttachments(selectedFiles);

      await createContactMessage({
        full_name: formValues.fullName.trim(),
        email: formValues.email.trim(),
        institute: formValues.institute.trim() || null,
        role: formValues.role || null,
        subject: formValues.subject.trim(),
        message: formValues.message.trim(),
        attachment_notes: attachmentNotes.trim() || null,
        attachment_files: uploadedFiles,
      });

      setSubmitState({
        loading: false,
        type: "success",
        message: t("contact.success"),
      });
      setFormValues((current) => ({
        ...current,
        subject: "",
        message: "",
      }));
      setAttachmentNotes("");
      setSelectedFiles([]);
    } catch (error) {
      setSubmitState({
        loading: false,
        type: "error",
        message: error.message || t("contact.error"),
      });
    }
  };

  return (
    <main className="contact-page oman-page min-h-screen overflow-x-hidden text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.studentsGroup})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="contact-mobile-grid grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="min-w-0 text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                {t("contact.heroKicker")}
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                {t("contact.heroTitle")}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                {t("contact.heroText")}
              </p>
            </div>

            <div className="min-w-0 oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={themeImages.heroFort}
                  alt="Traditional Omani fort tower under a bright sky"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                {t("contact.heroCardText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="contact-mobile-grid grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("contact.formKicker")}
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {t("contact.formTitle")}
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                {t("contact.formText")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 min-w-0 rounded-[1.75rem] oman-card p-6 sm:mt-12 sm:p-8">
              <p className="mb-5 text-sm leading-6 text-[var(--oman-ink)]/70">
                {t("common.fieldsRequired")}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <RequiredLabel>{t("contact.labels.fullName")}</RequiredLabel>
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
                  <RequiredLabel>{t("contact.labels.email")}</RequiredLabel>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4">
                <label className="flex flex-col gap-2">
                  <RequiredLabel>{t("contact.labels.institute")}</RequiredLabel>
                  <input
                    type="text"
                    name="institute"
                    value={formValues.institute}
                    onChange={handleChange}
                    placeholder={t("contact.placeholders.institute")}
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{t("contact.labels.role")}</RequiredLabel>
                  <select
                    name="role"
                    value={formValues.role}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  >
                    <option value="">{t("contact.placeholders.role")}</option>
                    <option value="student">{t("contact.roleStudent")}</option>
                    <option value="tutor">{t("contact.roleTutor")}</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{t("contact.labels.subject")}</RequiredLabel>
                  <input
                    type="text"
                    name="subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    required
                    placeholder={t("contact.placeholders.subject")}
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <RequiredLabel>{t("contact.labels.message")}</RequiredLabel>
                  <textarea
                    name="message"
                    value={formValues.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    placeholder={t("contact.placeholders.message")}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    {t("contact.labels.attachmentNotes")}
                  </span>
                  <textarea
                    value={attachmentNotes}
                    onChange={(event) => setAttachmentNotes(event.target.value)}
                    rows={3}
                    placeholder={t("contact.placeholders.attachmentNotes")}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    {t("contact.labels.attachFiles")}
                  </span>
                  <input
                    type="file"
                    multiple
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
              </div>

              <ActionFeedback
                type={submitState.type}
                message={submitState.message}
                title={t("contact.feedbackTitle")}
                className="mt-5"
              />

              <button
                type="submit"
                disabled={submitState.loading}
                className="oman-button-primary mt-6 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitState.loading ? t("contact.submitting") : t("contact.submit")}
              </button>
            </form>
          </div>

          <div className="min-w-0">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                {t("contact.methodsKicker")}
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {t("contact.methodsTitle")}
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8">
              {contactMethods.map((method) => (
                <article key={method.title} className="rounded-3xl oman-card p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{method.title}</h3>
                  <p className="mt-4 break-words text-lg font-medium text-[var(--oman-terracotta)]">
                    {method.value}
                  </p>
                  <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{method.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="contact-mobile-grid grid items-center gap-6 rounded-[1.75rem] oman-dark-panel px-6 py-10 text-white sm:px-8 sm:py-12 lg:grid-cols-[1fr_0.88fr]">
          <div className="min-w-0 text-center lg:text-left">
            <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
              {t("contact.ctaKicker")}
            </p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              {t("contact.ctaTitle")}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
              {t("contact.ctaText")}
            </p>
          </div>
          <div className="min-w-0 oman-photo-frame aspect-[5/4]">
            <img
              src={themeImages.contactBottomCampus}
              alt="University campus building with landscaped lawn"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        {footerText}
      </footer>
    </main>
  );
}
