import { useState } from "react";
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
import { Alert, Button, Card, Field } from "../components/ui";
import { Hero, Page, PageHeader, Section, SiteFooter } from "../components/layout";

export default function Contact() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const contactMethods = t("contact.methods");
  const acceptedFilesText = t("common.acceptedFiles")
    .replace("{types}", ACCEPTED_UPLOAD_TYPES.join(", "))
    .replace("{size}", FILE_SIZE_LIMIT_MB);
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
    <Page className="contact-page overflow-x-hidden">
      <Hero backgroundImage={themeImages.brandJourney}>
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

          <Card variant="default" padding="sm" rounded="xl" className="min-w-0 text-[var(--oman-ink)]">
            <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
              <img src={themeImages.brandWordmark} alt="UcanJobs employability bridge visual" />
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
              {t("contact.heroCardText")}
            </p>
          </Card>
        </div>
      </Hero>

      <Section spacing="md">
        <div className="contact-mobile-grid grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <PageHeader
              kicker={t("contact.formKicker")}
              title={t("contact.formTitle")}
              description={t("contact.formText")}
              className="max-w-none"
            />

            <Card as="form" onSubmit={handleSubmit} variant="default" padding="lg" rounded="xl" className="mt-10 min-w-0 sm:mt-12">
              <p className="mb-5 text-sm leading-6 text-[var(--oman-ink)]/70">
                {t("common.fieldsRequired")}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t("contact.labels.fullName")}
                  name="fullName"
                  type="text"
                  value={formValues.fullName}
                  onChange={handleChange}
                  required
                  controlClassName="min-h-12"
                />
                <Field
                  label={t("contact.labels.email")}
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  controlClassName="min-h-12"
                />
              </div>

              <div className="mt-4 grid gap-4">
                <Field
                  label={t("contact.labels.institute")}
                  name="institute"
                  type="text"
                  value={formValues.institute}
                  onChange={handleChange}
                  placeholder={t("contact.placeholders.institute")}
                  required
                  controlClassName="min-h-12"
                />
                <Field
                  as="select"
                  label={t("contact.labels.role")}
                  name="role"
                  value={formValues.role}
                  onChange={handleChange}
                  required
                  controlClassName="min-h-12"
                >
                  <option value="">{t("contact.placeholders.role")}</option>
                  <option value="learner">{t("contact.roleStudent")}</option>
                  <option value="instructor">{t("contact.roleTutor")}</option>
                </Field>
                <Field
                  label={t("contact.labels.subject")}
                  name="subject"
                  type="text"
                  value={formValues.subject}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.placeholders.subject")}
                  controlClassName="min-h-12"
                />
                <Field
                  as="textarea"
                  label={t("contact.labels.message")}
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder={t("contact.placeholders.message")}
                />
                <Field
                  as="textarea"
                  label={t("contact.labels.attachmentNotes")}
                  name="attachmentNotes"
                  value={attachmentNotes}
                  onChange={(event) => setAttachmentNotes(event.target.value)}
                  rows={3}
                  placeholder={t("contact.placeholders.attachmentNotes")}
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--oman-ink)]">
                    {t("contact.labels.attachFiles")}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept={ACCEPTED_UPLOAD_ATTRIBUTE}
                    onChange={handleFileChange}
                    className="w-full rounded-2xl border border-[rgba(111,49,29,0.16)] bg-[rgba(255,252,247,0.92)] px-4 py-3 text-sm text-[var(--oman-ink)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(197,154,68,0.16)] file:px-4 file:py-2 file:font-semibold file:text-[var(--oman-terracotta-dark)] hover:file:bg-[rgba(197,154,68,0.24)]"
                  />
                  <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/70">{acceptedFilesText}</p>
                  {selectedFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedFiles.map((file) => (
                        <span
                          key={`${file.name}-${file.size}`}
                          className="rounded-full bg-[rgba(244,232,214,0.44)] px-3 py-2 text-sm font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)]"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </label>
              </div>

              <Alert
                type={submitState.type}
                message={submitState.message}
                title={t("contact.feedbackTitle")}
                className="mt-5"
              />

              <Button type="submit" variant="primary" loading={submitState.loading} className="mt-6 w-full sm:w-auto">
                {submitState.loading ? t("contact.submitting") : t("contact.submit")}
              </Button>
            </Card>
          </div>

          <div className="min-w-0">
            <PageHeader
              kicker={t("contact.methodsKicker")}
              title={t("contact.methodsTitle")}
              className="max-w-none"
            />
            <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8">
              {contactMethods.map((method) => (
                <Card key={method.title} as="article" variant="default" padding="lg" rounded="lg">
                  <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{method.title}</h3>
                  <p className="mt-4 break-words text-lg font-medium text-[var(--oman-terracotta)]">
                    {method.value}
                  </p>
                  <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{method.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="tightBottom">
        <Card
          variant="dark"
          padding="xl"
          rounded="xl"
          className="contact-mobile-grid grid items-center gap-6 lg:grid-cols-[1fr_0.88fr]"
        >
          <div className="min-w-0 text-center lg:text-left">
            <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
              {t("contact.ctaKicker")}
            </p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">{t("contact.ctaTitle")}</h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
              {t("contact.ctaText")}
            </p>
          </div>
          <div className="min-w-0 oman-photo-frame oman-photo-frame--top aspect-[5/4]">
            <img
              src={themeImages.contactBottomCampus}
              alt="University campus building with landscaped lawn"
            />
          </div>
        </Card>
      </Section>

      <SiteFooter />
    </Page>
  );
}
