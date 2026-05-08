import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { themeImages } from "../lib/themeImages";

const tutorActions = [
  {
    title: "Submitted Tutoring Requests",
    description:
      "Open a separate tutor page to review your assigned requests, update their status, and download attached files.",
    to: "/tutor-tutoring-requests/",
    action: "View Tutoring Requests",
  },
  {
    title: "View Tutoring Services",
    description: "Review how tutoring appears on the public services page.",
    to: "/services/#tutor-directory",
    action: "Open Services",
  },
  {
    title: "Contact Website Admin",
    description: "Use the contact page if you want to coordinate new tutoring support or updates.",
    to: "/contact/",
    action: "Open Contact",
  },
];

export default function TutorDashboard() {
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.user_metadata?.full_name || "Tutor";
  const institute = profile?.institute || user?.user_metadata?.institute || "Not set yet";

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
                Tutor Dashboard
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Welcome, {name}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
                This protected dashboard gives you a clean place to manage your tutoring request
                workflow, review how your tutoring appears, and coordinate platform updates.
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
            Profile
          </p>
          <div className="mt-6 space-y-4 text-[var(--oman-ink)]/80">
            <p>
              <span className="font-semibold">Full name:</span> {name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email || "Not set"}
            </p>
            <p>
              <span className="font-semibold">Institute:</span> {institute}
            </p>
            <p>
              <span className="font-semibold">Role:</span> Tutor
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            Tutor Actions
          </p>
          <div className="mt-6 grid gap-4">
            {tutorActions.map((item) => (
              <article key={item.title} className="rounded-3xl oman-outline-panel p-5">
                <h2 className="text-lg font-semibold text-[var(--oman-ink)]">{item.title}</h2>
                <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">{item.description}</p>
                <Link
                  to={item.to}
                  className="oman-button-secondary mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
                >
                  {item.action}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
