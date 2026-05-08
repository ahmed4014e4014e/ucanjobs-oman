import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createContactMessage, uploadContactAttachments } from "../lib/contactApi";
import { isSupabaseConfigured } from "../lib/supabase";
import { themeImages } from "../lib/themeImages";

const contactMethods = [
  {
    title: "Email",
    value: "20258971@mcbs.edu.om",
    description: "Reach out with questions about tutoring, study resources, or joining the Ucan Oman student community.",
  },
  {
    title: "Phone",
    value: "+968 9575 9446",
    description: "Contact us directly for help with free tutoring sessions, course support, and platform guidance.",
  },
  {
    title: "Location",
    value: "Qurum Beach, Muscat, Oman",
    description: "Ucan Oman serves students online while supporting a growing college learning community from Oman.",
  },
];

export default function Contact() {
  const { user, profile } = useAuth();
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
    setSelectedFiles(incomingFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setSubmitState({
        loading: false,
        type: "error",
        message: "Supabase is not configured yet, so the contact form cannot submit right now.",
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
        message: "Your message was submitted successfully. We will review it through Supabase.",
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
        message: error.message || "We could not submit your message right now.",
      });
    }
  };

  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.studentsGroup})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                Contact Ucan Oman
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                Reach a support platform that feels welcoming, local, and student-centered.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                Whether you want help finding tutoring, study resources, or the
                right course community, here are the best ways to reach Ucan Oman.
              </p>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={themeImages.heroFort}
                  alt="Traditional Omani fort tower under a bright sky"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                We want the platform to feel as dependable and recognizable as the landmarks that shape Oman’s identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10">
          <div>
            <div className="max-w-2xl text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Contact Form
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                Send your message directly to Ucan Oman.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                Fill in the form below and your message will be saved in Supabase so the team can
                review it properly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 rounded-[1.75rem] oman-card p-6 sm:mt-12 sm:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Full name
                  </span>
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
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Email
                  </span>
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
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Institute
                  </span>
                  <input
                    type="text"
                    name="institute"
                    value={formValues.institute}
                    onChange={handleChange}
                    placeholder="Example: MCBS"
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Role
                  </span>
                  <select
                    name="role"
                    value={formValues.role}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Subject
                  </span>
                  <input
                    type="text"
                    name="subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Message
                  </span>
                  <textarea
                    name="message"
                    value={formValues.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    placeholder="Write your message here..."
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Attachment Notes
                  </span>
                  <textarea
                    value={attachmentNotes}
                    onChange={(event) => setAttachmentNotes(event.target.value)}
                    rows={3}
                    placeholder="Optional: add a short note about the files you attached."
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Attach Files
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-sm text-[var(--oman-ink)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[rgba(197,154,68,0.16)] file:px-4 file:py-2 file:font-semibold file:text-[var(--oman-terracotta-dark)] hover:file:bg-[rgba(197,154,68,0.24)]"
                  />
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

              {submitState.message && (
                <div
                  className={[
                    "mt-5 rounded-2xl px-4 py-3 text-sm leading-6",
                    submitState.type === "error"
                      ? "border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] text-[var(--oman-terracotta-dark)]"
                      : "border border-[rgba(82,101,74,0.22)] bg-[rgba(239,246,236,0.95)] text-[var(--oman-olive)]",
                  ].join(" ")}
                >
                  {submitState.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitState.loading}
                className="oman-button-primary mt-6 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitState.loading ? "Submitting..." : "Submit Contact Form"}
              </button>
            </form>
          </div>

          <div>
            <div className="max-w-2xl text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Other Ways to Reach Us
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                Clear ways to connect with the Ucan Oman team.
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
        <div className="grid items-center gap-6 rounded-[1.75rem] oman-dark-panel px-6 py-10 text-white sm:px-8 sm:py-12 lg:grid-cols-[1fr_0.88fr]">
          <div className="text-center lg:text-left">
            <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
              We Are Here to Help
            </p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              Reach out whenever you need better support for your college courses.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
              Ucan Oman is here to help students connect with free tutoring,
              stronger learning resources, and course communities that make studying easier.
            </p>
          </div>
          <div className="oman-photo-frame aspect-[5/4]">
            <img
              src={themeImages.contactBottomCampus}
              alt="University campus building with landscaped lawn"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        Copyright {new Date().getFullYear()} Ucan Oman. Free learning support for everyone.
      </footer>
    </main>
  );
}
