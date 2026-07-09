import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { fetchInstructorCourseProposals } from "../lib/courseProposalApi";
import { fetchInstructorCourses } from "../lib/instructorCourseApi";

export default function InstructorCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [courseRows, proposalRows] = await Promise.all([
          fetchInstructorCourses(user?.id),
          fetchInstructorCourseProposals(user?.id),
        ]);
        if (!ignore) {
          setCourses(courseRows);
          setProposals(proposalRows);
        }
      } catch (error) {
        if (!ignore) {
          setFeedback({
            type: "error",
            message: error.message || "Unable to load your course workspace.",
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (user?.id) load();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <header className="oman-card rounded-[1.75rem] p-6 sm:p-8">
          <p className="oman-section-kicker text-xs font-semibold uppercase">Instructor Studio</p>
          <h1 className="oman-title-accent mt-3 text-3xl font-semibold">My Courses</h1>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--oman-ink)]/75">
            Approved proposals become private course drafts here. Build the learning content,
            preview the structure, then confirm publication when it is ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/instructor-dashboard/" className="rounded-2xl bg-white px-5 py-3 font-semibold ring-1 ring-[rgba(111,49,29,0.14)]">
              Back to Dashboard
            </Link>
          </div>
          <ActionFeedback {...feedback} title="Course workspace update" className="mt-6" />
        </header>

        {loading ? (
          <p className="mt-8 text-center">Loading your course workspace...</p>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[var(--oman-ink)]">Course creation kit</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {courses.length === 0 ? (
                  <div className="oman-card rounded-[1.75rem] p-6 md:col-span-2">
                    No approved course drafts yet. Submit a proposal and wait for admin approval.
                  </div>
                ) : (
                  courses.map((course) => (
                    <article key={course.id} className="oman-card rounded-[1.75rem] p-6">
                      <p className="text-xs font-semibold uppercase text-[var(--oman-terracotta)]">
                        {course.publication_status}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">{course.title_en}</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--oman-ink)]/70">
                        {course.summary_en || "Add a course summary in the creation kit."}
                      </p>
                      <Link
                        to={`/instructor-course-kit/${course.id}/`}
                        className="oman-button-secondary mt-5 inline-flex rounded-2xl px-5 py-3 font-semibold"
                      >
                        Open Course Kit
                      </Link>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-[var(--oman-ink)]">Proposal status</h2>
              <div className="mt-4 grid gap-3">
                {proposals.map((proposal) => (
                  <article key={proposal.id} className="oman-card rounded-2xl p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold">{proposal.course_title}</h3>
                      <span className="w-fit rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-1 text-xs font-semibold uppercase">
                        {proposal.status.replace("_", " ")}
                      </span>
                    </div>
                    {proposal.admin_notes ? (
                      <p className="mt-3 text-sm text-[var(--oman-ink)]/70">
                        Admin notes: {proposal.admin_notes}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
