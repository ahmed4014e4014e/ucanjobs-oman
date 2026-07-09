import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import {
  fetchAdminCourseProposals,
  reviewInstructorCourseProposal,
} from "../lib/courseProposalApi";

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-OM", { dateStyle: "medium" }).format(new Date(value));
}

export default function AdminCourseProposals() {
  const [proposals, setProposals] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const rows = await fetchAdminCourseProposals();
        if (!ignore) setProposals(rows);
      } catch (error) {
        if (!ignore) {
          setFeedback({
            type: "error",
            message: error.message || "Unable to load course proposals.",
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const review = async (proposal, status) => {
    setReviewingId(proposal.id);
    setFeedback({ type: "idle", message: "" });

    try {
      const approvedCourseId = await reviewInstructorCourseProposal({
        proposalId: proposal.id,
        status,
        adminNotes: notes[proposal.id] || "",
      });

      setProposals((current) =>
        current.map((item) =>
          item.id === proposal.id
            ? {
                ...item,
                status,
                admin_notes: notes[proposal.id] || null,
                approved_course_id: approvedCourseId || item.approved_course_id,
                reviewed_at: new Date().toISOString(),
              }
            : item
        )
      );
      setFeedback({
        type: "success",
        message:
          status === "approved"
            ? "Proposal approved and an instructor draft course was created."
            : `Proposal marked as ${status.replace("_", " ")}.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to review this proposal.",
      });
    } finally {
      setReviewingId("");
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <header className="oman-card rounded-[1.75rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase">Admin Review</p>
              <h1 className="oman-title-accent mt-3 text-3xl font-semibold">Course Proposals</h1>
              <p className="mt-4 max-w-3xl leading-7 text-[var(--oman-ink)]/75">
                Approving a proposal automatically creates a private draft owned by its instructor.
              </p>
            </div>
            <Link to="/admin-dashboard/" className="oman-button-secondary rounded-2xl px-5 py-3 font-semibold">
              Back to Dashboard
            </Link>
          </div>
          <ActionFeedback {...feedback} title="Proposal review update" className="mt-6" />
        </header>

        {loading ? (
          <p className="mt-8 text-center">Loading course proposals...</p>
        ) : proposals.length === 0 ? (
          <div className="oman-card mt-8 rounded-[1.75rem] p-6 text-center">
            No instructor course proposals have been submitted.
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {proposals.map((proposal) => (
              <article key={proposal.id} className="oman-card rounded-[1.75rem] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[var(--oman-terracotta)]">
                      {proposal.course_category} · {proposal.target_level}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[var(--oman-ink)]">
                      {proposal.course_title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--oman-ink)]/65">
                      {proposal.instructor_name || proposal.instructor_email} · Submitted{" "}
                      {formatDate(proposal.submitted_at)}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-2 text-xs font-semibold uppercase text-[var(--oman-terracotta-dark)]">
                    {proposal.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="oman-outline-panel rounded-2xl p-4">
                    <h3 className="font-semibold">Course summary</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--oman-ink)]/75">
                      {proposal.course_summary}
                    </p>
                  </div>
                  <div className="oman-outline-panel rounded-2xl p-4">
                    <h3 className="font-semibold">Career outcome</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                      {proposal.career_outcome}
                    </p>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Admin notes
                  </span>
                  <textarea
                    value={notes[proposal.id] ?? proposal.admin_notes ?? ""}
                    onChange={(event) =>
                      setNotes((current) => ({ ...current, [proposal.id]: event.target.value }))
                    }
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 outline-none"
                  />
                </label>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={reviewingId === proposal.id || proposal.status === "approved"}
                    onClick={() => review(proposal, "approved")}
                    className="oman-button-secondary rounded-2xl px-5 py-3 font-semibold disabled:opacity-50"
                  >
                    Approve and Create Draft
                  </button>
                  <button
                    type="button"
                    disabled={reviewingId === proposal.id}
                    onClick={() => review(proposal, "changes_requested")}
                    className="rounded-2xl bg-white px-5 py-3 font-semibold ring-1 ring-[rgba(111,49,29,0.14)] disabled:opacity-50"
                  >
                    Request Changes
                  </button>
                  <button
                    type="button"
                    disabled={reviewingId === proposal.id}
                    onClick={() => review(proposal, "rejected")}
                    className="rounded-2xl bg-white px-5 py-3 font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.14)] disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
