import { themeImages } from "../lib/themeImages";

export default function Terms() {
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
                Platform Policies
              </p>
              <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:mx-0 lg:text-5xl">
                Ucan Oman Platform Policies
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f4e8d6] sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                These policies apply to student access, tutor applications, academic support, and
                responsible use of the Ucan Oman platform.
              </p>
            </div>

            <div className="oman-card rounded-[1.75rem] p-4 text-[var(--oman-ink)] sm:p-5">
              <div className="oman-photo-frame aspect-[4/5]">
                <img
                  src={themeImages.policiesCampus}
                  alt="University campus walkway for the Ucan Oman policies page"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--oman-ink)]/80">
                Please review these policies carefully before creating a student account or applying
                to become a tutor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Policy Document
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
            Read the platform rules and responsibilities
          </h2>
          <div className="mt-8 space-y-8 text-[var(--oman-ink)]/85">
            <section className="rounded-3xl oman-outline-panel p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Professional Conduct Policy
              </h3>
              <p className="mt-4 leading-7">
                All tutors registered under Ucan Oman are expected to maintain professional
                behavior while interacting with students, administrators, and other tutors.
              </p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Tutors Must
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    <li>Treat all students respectfully and professionally.</li>
                    <li>Communicate politely and appropriately at all times.</li>
                    <li>Arrive on time for tutoring sessions.</li>
                    <li>Provide honest academic support to the best of their abilities.</li>
                    <li>Maintain a positive and supportive learning environment.</li>
                    <li>Dress and behave appropriately during online or physical sessions.</li>
                    <li>Follow the rules and regulations of their educational institution.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Tutors Must Not
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    <li>Use offensive, discriminatory, or inappropriate language.</li>
                    <li>Share harmful, illegal, or unethical content.</li>
                    <li>Mislead students regarding qualifications or academic abilities.</li>
                    <li>Request inappropriate personal information from students.</li>
                    <li>Engage in behavior that damages the reputation of Ucan Oman.</li>
                  </ul>
                </div>
              </div>
              <p className="mt-5 leading-7">
                Violation of this policy may result in suspension or permanent removal from the
                Ucan Oman platform.
              </p>
            </section>

            <section className="rounded-3xl oman-outline-panel p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Anti-Harassment Policy
              </h3>
              <p className="mt-4 leading-7">
                Ucan Oman is committed to providing a safe, respectful, and inclusive environment
                for all users. Harassment of any kind is strictly prohibited.
              </p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Prohibited Behavior Includes
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>Bullying or intimidation</li>
                <li>Sexual harassment or inappropriate comments</li>
                <li>Discriminatory remarks related to gender, nationality, religion, race, or disability</li>
                <li>Repeated unwanted communication</li>
                <li>Threats, abusive language, or hostile behavior</li>
                <li>Sharing offensive or explicit content</li>
              </ul>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Reporting Harassment
              </p>
              <p className="mt-3 leading-7">
                Users may report incidents directly to the Ucan Oman administration team. All
                reports will be treated seriously and investigated confidentially.
              </p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Consequences
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>Warning notices</li>
                <li>Temporary suspension</li>
                <li>Permanent account termination</li>
                <li>Reporting to educational institutions if necessary</li>
              </ul>
            </section>

            <section className="rounded-3xl oman-outline-panel p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Academic Honesty Policy
              </h3>
              <p className="mt-4 leading-7">
                Ucan Oman promotes ethical learning and academic integrity.
              </p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Tutors Must
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>Guide students in understanding academic concepts.</li>
                <li>Encourage independent learning and problem solving.</li>
                <li>Avoid completing assignments, exams, or quizzes on behalf of students.</li>
                <li>Avoid sharing unauthorized exam materials or answer keys.</li>
                <li>Provide accurate and truthful academic assistance.</li>
              </ul>
              <p className="mt-5 leading-7">
                Academic dishonesty, cheating assistance, plagiarism, or exam misconduct is
                strictly prohibited. Violations may lead to immediate removal from the platform.
              </p>
            </section>

            <section className="rounded-3xl oman-outline-panel p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Privacy & Confidentiality Policy
              </h3>
              <p className="mt-4 leading-7">
                Ucan Oman respects the privacy of all users and protects submitted information.
              </p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Collected Information May Include
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    <li>Omani ID</li>
                    <li>University ID</li>
                    <li>Academic transcripts</li>
                    <li>Contact information</li>
                    <li>Tutoring qualifications</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                    Ucan Oman Will
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    <li>Use submitted documents only for tutor verification purposes.</li>
                    <li>Restrict access to sensitive information to authorized administrators only.</li>
                    <li>Avoid sharing personal information with third parties without permission.</li>
                    <li>Take reasonable measures to protect user data and confidentiality.</li>
                  </ul>
                </div>
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Users Must
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>Respect the privacy of students and tutors.</li>
                <li>Avoid recording or sharing tutoring sessions without permission.</li>
                <li>Avoid distributing personal or academic information belonging to others.</li>
              </ul>
              <p className="mt-5 leading-7">
                Violation of confidentiality expectations may result in disciplinary action.
              </p>
            </section>

            <section className="rounded-3xl oman-outline-panel p-5">
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                When agreement is required
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                <li>Student users must agree before creating a student account.</li>
                <li>Tutor applicants must agree before submitting the tutor application form.</li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
