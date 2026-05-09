import { Link } from "react-router-dom";
import { themeImages } from "../lib/themeImages";
import ucanLogo from "../assets/campus-images/ucan-logo.png";
import googleMeetLogo from "../assets/tool-logos/google-meet.svg";
import zoomLogo from "../assets/tool-logos/zoom.jpg";
import microsoftTeamsLogo from "../assets/tool-logos/microsoft-teams.svg";
import microsoftWhiteboardLogo from "../assets/tool-logos/microsoft-whiteboard.svg";
import clickUpLogo from "../assets/tool-logos/clickup.svg";
import miroLogo from "../assets/tool-logos/miro.svg";

const features = [
  {
    title: "Free For Everyone",
    description:
      "Ucan Oman is completely free of charge, so every college student can access help without worrying about cost.",
  },
  {
    title: "Student Community",
    description:
      "The platform hosts an online community of college students helping each other in college courses every day.",
  },
  {
    title: "Better Course Support",
    description:
      "Students can find tutoring, study materials, useful videos, and course WhatsApp groups in one place.",
  },
];

const stats = [
  { number: "100%", label: "free access for all students" },
  { number: "1:1", label: "individual tutoring sessions" },
  { number: "Group", label: "shared tutoring and course communities" },
];

const steps = [
  {
    title: "Join The Community",
    description:
      "Connect with college students who are ready to help each other understand assignments, lectures, and exams.",
  },
  {
    title: "Book Free Tutoring",
    description:
      "Schedule individualized tutoring sessions for free or attend free group tutoring sessions for shared learning.",
  },
  {
    title: "Study Smarter",
    description:
      "Access documents, useful videos, and course-based WhatsApp groups to improve your understanding of course material.",
  },
];

const tutoringToolGroups = [
  {
    title: "Live Session Platforms",
    description:
      "Run tutoring sessions smoothly through trusted meeting tools for video, voice, and screen sharing.",
    tools: [
      { name: "Google Meet", logo: googleMeetLogo },
      { name: "Zoom", logo: zoomLogo },
      { name: "Microsoft Teams", logo: microsoftTeamsLogo },
    ],
  },
  {
    title: "Collaboration Tools",
    description:
      "Explain ideas visually, organize tutoring workflows, and brainstorm concepts together in real time.",
    tools: [
      { name: "Microsoft Whiteboard", logo: microsoftWhiteboardLogo },
      { name: "ClickUp", logo: clickUpLogo },
      { name: "Miro", logo: miroLogo },
    ],
  },
];

export default function Home() {
  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.heroFort})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                Welcome to Ucan Oman
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                Rooted in Omani heritage and built for a modern student community.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                Ucan Oman is an online platform that brings students together to
                support each other in college courses through free tutoring,
                shared resources, and course communities.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                <Link
                  to="/services#tutor-directory"
                  className="oman-button-primary w-full rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={ucanLogo}
                  alt="Ucan logo"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--oman-terracotta)] sm:text-sm">
                Omani Spirit, Modern Learning
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-8 sm:text-2xl sm:leading-9">
                A learning platform shaped by generosity, belonging, and ambitious study culture.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 rounded-[1.75rem] oman-card p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl oman-outline-panel p-5 text-center sm:p-6">
              <p className="oman-stat-number text-2xl font-bold sm:text-3xl">{item.number}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Why Choose Ucan Oman
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            A free support network that feels culturally grounded and academically useful.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl oman-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{feature.title}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            How It Works
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            Three simple ways to get better support in your courses.
          </h2>
          <div className="oman-photo-frame mt-8 aspect-[5/6]">
            <img
              src={themeImages.mountainFort}
              alt="Traditional Omani fort architecture against a mountain backdrop"
            />
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {steps.map((step) => (
            <div key={step.title} className="rounded-3xl oman-card p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{step.title}</h3>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="rounded-[1.75rem] oman-card px-6 py-10 sm:px-8 sm:py-12">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Tutoring Tools
            </p>
            <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
              Familiar platforms that make online tutoring easier to run.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
              Ucan Oman tutoring can be supported through meeting and collaboration tools that help
              students connect, explain concepts, and work through course material clearly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-2">
            {tutoringToolGroups.map((group) => (
              <article key={group.title} className="rounded-3xl oman-outline-panel p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--oman-terracotta)]">
                  {group.title}
                </p>
                <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75">
                  {group.description}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {group.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="rounded-[1.5rem] bg-[rgba(255,252,247,0.95)] p-4 text-center shadow-[0_14px_34px_rgba(73,39,27,0.07)] ring-1 ring-[rgba(111,49,29,0.1)]"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white ring-1 ring-[rgba(111,49,29,0.08)]">
                        <img
                          src={tool.logo}
                          alt={`${tool.name} logo`}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold leading-6 text-[var(--oman-ink)] sm:text-base">
                        {tool.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="rounded-[1.75rem] oman-card px-6 py-10 sm:px-8 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Join Our Tutor Team
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                Become a Tutor and join a growing network of free academic support.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                We are welcoming more tutors from different institutes to help
                students through private tutoring, group tutoring, and shared
                academic support.
              </p>
            </div>

            <div className="rounded-3xl oman-dark-panel p-6 text-white sm:p-8">
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                Tutor Access
              </p>
              <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                Log in or sign up to create your tutor account.
              </h3>
              <p className="mt-4 leading-7 text-[#eadfcf]">
                Use the tutor page to register, enter your protected dashboard,
                and prepare to serve students across supported courses.
              </p>
              <Link
                to="/tutor-access/"
                className="oman-button-primary mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
              >
                Tutor Login / Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="rounded-[1.75rem] oman-card px-6 py-10 sm:px-8 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Student Access
              </p>
              <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                Join as a student and access tutoring support with your own account.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                Students can create an account to log in, access tutoring
                services, and stay connected with academic support, resources,
                and course communities across the platform.
              </p>
            </div>

            <div className="rounded-3xl oman-dark-panel p-6 text-white sm:p-8">
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                Student Access
              </p>
              <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                Log in or sign up to create your student account.
              </h3>
              <p className="mt-4 leading-7 text-[#eadfcf]">
                Use the student account page to create your profile and get
                ready to use the Ucan Oman platform more easily.
              </p>
              <Link
                to="/student-access/"
                className="oman-button-primary mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
              >
                Student Login / Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[1.75rem] oman-dark-panel px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
            Start For Free
          </p>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            Join a learning hub where tutoring, resources, and community support cost nothing.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#eadfcf] sm:text-lg sm:leading-8">
            Ucan Oman gives students free access to individualized tutoring,
            group sessions, helpful documents, useful videos, and course WhatsApp groups.
          </p>
          <Link
            to="/services#tutor-directory"
            className="oman-button-primary mt-8 inline-flex rounded-2xl px-8 py-3 text-center font-semibold transition"
          >
            Join Now
          </Link>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        Copyright {new Date().getFullYear()} Ucan Oman. Free learning support for everyone.
      </footer>
    </main>
  );
}
