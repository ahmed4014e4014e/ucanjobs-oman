import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { downloadStorageAttachment } from "../lib/adminDownloads";
import AdminAttachmentDownloadList from "../components/AdminAttachmentDownloadList";
import {
  fetchTutorTutoringRequests,
  updateTutoringRequestStatus,
} from "../lib/tutoringApi";
import {
  formatStatusLabel,
  isDashboardArchivedStatus,
  normalizeStatus,
  TUTORING_STATUS_OPTIONS,
} from "../lib/requestStatuses";

function formatSubmittedAt(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString("en-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TutorTutoringRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);
  const [feedback, setFeedback] = useState({
    type: "idle",
    message: "",
  });
  const [downloadingPaths, setDownloadingPaths] = useState({});
  const [statusDraft, setStatusDraft] = useState("pending");
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadRequests = async () => {
      if (!user?.id) {
        setRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const results = await fetchTutorTutoringRequests(user.id);

        if (!ignore) {
          setRequests(results);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message || "Unable to load tutoring requests right now.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!activeRequest) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveRequest(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeRequest]);

  useEffect(() => {
    if (!activeRequest) {
      setStatusDraft("pending");
      return;
    }

    setStatusDraft(normalizeStatus(activeRequest.status));
  }, [activeRequest]);

  const visibleRequests = useMemo(
    () => requests.filter((request) => !isDashboardArchivedStatus(request.status)),
    [requests]
  );

  const stats = useMemo(() => {
    return {
      totalRequests: visibleRequests.length,
      pendingRequests: visibleRequests.filter(
        (request) => normalizeStatus(request.status) === "pending"
      ).length,
      privateRequests: visibleRequests.filter((request) => request.session_type === "private").length,
    };
  }, [visibleRequests]);

  const handleAttachmentDownload = async ({ bucket, path, fileName }) => {
    setFeedback({
      type: "idle",
      message: "",
    });
    setDownloadingPaths((current) => ({
      ...current,
      [path]: true,
    }));

    try {
      await downloadStorageAttachment({ bucket, path, fileName });
      setFeedback({
        type: "success",
        message: `Downloaded ${fileName || "attachment"} successfully.`,
      });
    } catch (downloadError) {
      setFeedback({
        type: "error",
        message: downloadError.message || "Unable to download this attachment right now.",
      });
    } finally {
      setDownloadingPaths((current) => ({
        ...current,
        [path]: false,
      }));
    }
  };

  const handleStatusSave = async () => {
    if (!activeRequest) {
      return;
    }

    setStatusSaving(true);
    setFeedback({
      type: "idle",
      message: "",
    });

    try {
      const updatedRequest = await updateTutoringRequestStatus(activeRequest.id, statusDraft);
      const mergedRequest = {
        ...activeRequest,
        ...updatedRequest,
        status: normalizeStatus(updatedRequest.status),
      };

      if (isDashboardArchivedStatus(mergedRequest.status)) {
        setRequests((current) =>
          current.filter((request) => request.id !== mergedRequest.id)
        );
        setActiveRequest(null);
      } else {
        setRequests((current) =>
          current.map((request) => (request.id === mergedRequest.id ? mergedRequest : request))
        );
        setActiveRequest(mergedRequest);
      }
      setFeedback({
        type: "success",
        message: `Tutoring request marked as ${formatStatusLabel(statusDraft)}.`,
      });
    } catch (statusError) {
      setFeedback({
        type: "error",
        message: statusError.message || "Unable to update this tutoring request status right now.",
      });
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Tutor Records
              </p>
              <h1 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                Submitted Tutoring Requests
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                Open your assigned tutoring requests in separate popup windows, update their status,
                and download the attached study files directly from this page.
              </p>
            </div>
            <Link
              to="/tutor-dashboard/"
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Back to Tutor Dashboard
            </Link>
          </div>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title="Tutor request update"
            className="mt-6"
          />

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                Total
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.totalRequests}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                Pending
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.pendingRequests}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                Private
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.privateRequests}</p>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                Loading tutoring requests...
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Fetching the latest student requests assigned to your tutor account.
              </p>
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] p-6 text-[var(--oman-terracotta-dark)]">
              <h3 className="text-xl font-semibold">Unable to load tutoring requests</h3>
              <p className="mt-4 leading-7">{error}</p>
            </div>
          ) : visibleRequests.length === 0 ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                No active tutoring requests
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                Completed tutoring requests are hidden from the dashboard, but still remain stored
                in Supabase.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {visibleRequests.map((request) => (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setActiveRequest(request)}
                  className="rounded-3xl oman-outline-panel p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(73,39,27,0.08)] sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
                        {request.course?.code || "Course"}{" "}
                        <span className="text-[var(--oman-ink)]/60">
                          - {request.course?.title || "Unknown title"}
                        </span>
                      </h3>
                      <p className="mt-2 text-sm text-[var(--oman-ink)]/70">
                        Institute {request.institute_name_snapshot || "Not provided"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta-dark)]">
                        {request.session_type}
                      </span>
                      <span className="rounded-full bg-[rgba(155,77,49,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta-dark)]">
                        {formatStatusLabel(request.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--oman-ink)]/75 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">Submitted:</span>{" "}
                      {formatSubmittedAt(request.created_at)}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">Attachments:</span>{" "}
                      {Array.isArray(request.attachment_files) ? request.attachment_files.length : 0}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
                    Click to open this tutoring request in a separate popup window.
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeRequest && (
        <div className="oman-overlay fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] oman-card p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setActiveRequest(null)}
              className="absolute right-4 top-4 rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.2)]"
              aria-label="Close popup"
            >
              Close
            </button>

            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Tutoring Request
            </p>
            <h2 className="oman-title-accent mt-4 pr-16 text-2xl font-semibold sm:text-3xl">
              {activeRequest.course?.code || "Course"} -{" "}
              {activeRequest.course?.title || "Unknown title"}
            </h2>

            <div className="mt-6 grid gap-3 text-sm leading-6 text-[var(--oman-ink)]/75 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">Institute:</span>{" "}
                {activeRequest.institute_name_snapshot || "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">Session Type:</span>{" "}
                {activeRequest.session_type}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">Status:</span>{" "}
                {formatStatusLabel(activeRequest.status)}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">Submitted:</span>{" "}
                {formatSubmittedAt(activeRequest.created_at)}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.1)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Status Workflow
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    Update status
                  </span>
                  <select
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                  >
                    {TUTORING_STATUS_OPTIONS.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {formatStatusLabel(statusOption)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleStatusSave}
                  disabled={statusSaving || statusDraft === normalizeStatus(activeRequest.status)}
                  className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {statusSaving ? "Saving..." : "Save Status"}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.1)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                Topics Need Help With
              </p>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--oman-ink)]/80">
                {activeRequest.topics_needed_help_with}
              </p>
            </div>

            {(activeRequest.attachment_notes ||
              (Array.isArray(activeRequest.attachment_files) &&
                activeRequest.attachment_files.length > 0)) && (
              <div className="mt-4 rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-[var(--oman-ink)]">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                  Attachments
                </p>
                {activeRequest.attachment_notes && (
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--oman-ink)]/80">
                    {activeRequest.attachment_notes}
                  </p>
                )}
                <AdminAttachmentDownloadList
                  files={activeRequest.attachment_files}
                  bucket="tutoring-attachments"
                  downloadingPaths={downloadingPaths}
                  onDownload={handleAttachmentDownload}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
