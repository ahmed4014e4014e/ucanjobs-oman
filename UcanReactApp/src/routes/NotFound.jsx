import { Link } from "react-router-dom";
import { themeImages } from "../lib/themeImages";

export default function NotFound() {
  return (
    <main className="oman-page min-h-screen text-slate-900">
      <section
        className="oman-hero text-white"
        style={{ backgroundImage: `url(${themeImages.brandJourney})` }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="oman-kicker mb-4 text-xs font-semibold uppercase sm:text-sm">
                Page Not Found
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                This page does not exist in Ucan.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                The link may be outdated, incomplete, or typed incorrectly. Use one of the buttons
                below to get back to the main platform safely.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                <Link
                  to="/home/"
                  className="oman-button-primary w-full rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
                >
                  Go to Home
                </Link>
                <Link
                  to="/courses/"
                  className="oman-button-secondary w-full rounded-2xl px-6 py-3 text-center font-semibold transition sm:w-auto"
                >
                  View Courses
                </Link>
              </div>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame oman-photo-frame--contain aspect-[16/10]">
                <img
                  src={themeImages.brandSlogan}
                  alt="UcanJobs employability slogan"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                Ucan is still available. Let&apos;s get you back to the right page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-[1.75rem] oman-card p-6 text-center sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Helpful Links
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            Choose where you want to go next.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link
              to="/about/"
              className="rounded-3xl oman-outline-panel px-5 py-6 font-semibold text-[var(--oman-ink)] transition hover:-translate-y-0.5 hover:text-[var(--oman-terracotta)]"
            >
              About Ucan
            </Link>
            <Link
              to="/learner-access/"
              className="rounded-3xl oman-outline-panel px-5 py-6 font-semibold text-[var(--oman-ink)] transition hover:-translate-y-0.5 hover:text-[var(--oman-terracotta)]"
            >
              Job Seeker Access
            </Link>
            <Link
              to="/instructor-access/"
              className="rounded-3xl oman-outline-panel px-5 py-6 font-semibold text-[var(--oman-ink)] transition hover:-translate-y-0.5 hover:text-[var(--oman-terracotta)]"
            >
              Instructor Access
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6">
        Copyright {new Date().getFullYear()} Ucan. Career-readiness for Oman.
      </footer>
    </main>
  );
}
