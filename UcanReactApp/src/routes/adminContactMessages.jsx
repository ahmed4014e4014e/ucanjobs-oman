import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useLanguage } from "../context/LanguageContext";
import { fetchContactMessages, updateContactMessageStatus } from "../lib/contactApi";
import { downloadStorageAttachment } from "../lib/adminDownloads";
import AdminAttachmentDownloadList from "../components/AdminAttachmentDownloadList";
import {
  CONTACT_STATUS_OPTIONS,
  formatStatusLabel,
  isDashboardArchivedStatus,
  normalizeStatus,
} from "../lib/requestStatuses";

function formatSubmittedAt(value) {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleString("en-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCopy(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export default function AdminContactMessages() {
  const { t } = useLanguage();
  const copy = t("records");
  const page = copy.contact;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMessage, setActiveMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState({
    type: "idle",
    message: "",
  });
  const [downloadingPaths, setDownloadingPaths] = useState({});
  const [statusDraft, setStatusDraft] = useState("pending");
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadMessages = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await fetchContactMessages();

        if (!ignore) {
          setMessages(results);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message || page.fetchError);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!activeMessage) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveMessage(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeMessage]);

  useEffect(() => {
    if (!activeMessage) {
      setStatusDraft("pending");
      return;
    }

    setStatusDraft(normalizeStatus(activeMessage.status));
  }, [activeMessage]);

  const visibleMessages = useMemo(
    () => messages.filter((message) => !isDashboardArchivedStatus(message.status)),
    [messages]
  );

  const stats = useMemo(() => {
    return {
      totalMessages: visibleMessages.length,
      pendingMessages: visibleMessages.filter(
        (message) => normalizeStatus(message.status) === "pending"
      ).length,
      messageInstitutes: new Set(
        visibleMessages.map((message) => message.institute).filter(Boolean)
      ).size,
    };
  }, [visibleMessages]);

  const filteredMessages = useMemo(() => {
    if (statusFilter === "all") {
      return visibleMessages;
    }

    return visibleMessages.filter((message) => normalizeStatus(message.status) === statusFilter);
  }, [statusFilter, visibleMessages]);

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
        message: formatCopy(copy.downloaded, { fileName: fileName || copy.attachment }),
      });
    } catch (downloadError) {
      setFeedback({
        type: "error",
        message: downloadError.message || copy.downloadError,
      });
    } finally {
      setDownloadingPaths((current) => ({
        ...current,
        [path]: false,
      }));
    }
  };

  const handleStatusSave = async () => {
    if (!activeMessage) {
      return;
    }

    setStatusSaving(true);
    setFeedback({
      type: "idle",
      message: "",
    });

    try {
      const updatedMessage = await updateContactMessageStatus(activeMessage.id, statusDraft);
      const normalizedMessage = {
        ...updatedMessage,
        status: normalizeStatus(updatedMessage.status),
      };

      if (isDashboardArchivedStatus(normalizedMessage.status)) {
        setMessages((current) =>
          current.filter((message) => message.id !== normalizedMessage.id)
        );
        setActiveMessage(null);
      } else {
        setMessages((current) =>
          current.map((message) => (message.id === normalizedMessage.id ? normalizedMessage : message))
        );
        setActiveMessage(normalizedMessage);
      }
      setFeedback({
        type: "success",
        message: formatCopy(page.statusSaved, { status: formatStatusLabel(statusDraft) }),
      });
    } catch (statusError) {
      setFeedback({
        type: "error",
        message: statusError.message || page.statusError,
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
                {page.kicker}
              </p>
              <h1 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
                {page.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--oman-ink)]/75 sm:text-lg sm:leading-8">
                {page.description}
              </p>
            </div>
            <Link
              to="/admin-dashboard/"
              className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              {page.back}
            </Link>
          </div>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title={page.feedbackTitle}
            className="mt-6"
          />

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                {copy.total}
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.totalMessages}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                {copy.pending}
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.pendingMessages}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(244,232,214,0.42)] px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                {copy.institutes}
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--oman-ink)]">{stats.messageInstitutes}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl oman-outline-panel p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                  {page.workflowTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--oman-ink)]/75">
                  {page.workflowText}
                </p>
              </div>
              <label className="flex flex-col gap-2 lg:min-w-56">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                  {page.filter}
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                >
                  <option value="all">{page.allStatuses}</option>
                  {CONTACT_STATUS_OPTIONS.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {formatStatusLabel(statusOption)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{page.loadingTitle}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                {page.loadingText}
              </p>
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] p-6 text-[var(--oman-terracotta-dark)]">
              <h3 className="text-xl font-semibold">{page.errorTitle}</h3>
              <p className="mt-4 leading-7">{error}</p>
            </div>
          ) : visibleMessages.length === 0 ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">{page.emptyTitle}</h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                {page.emptyText}
              </p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h3 className="text-xl font-semibold text-[var(--oman-ink)]">
                {formatCopy(page.noFilteredTitle, { status: formatStatusLabel(statusFilter).toLowerCase() })}
              </h3>
              <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
                {page.noFilteredText}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {filteredMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => setActiveMessage(message)}
                  className="rounded-3xl oman-outline-panel p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(73,39,27,0.08)] sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--oman-ink)]">{message.subject}</h3>
                      <p className="mt-2 text-sm text-[var(--oman-ink)]/70">
                        {formatCopy(page.fromLine, {
                          name: message.full_name,
                          email: message.email,
                        })}
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta-dark)]">
                      {formatStatusLabel(message.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--oman-ink)]/75 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">{copy.institute}</span>{" "}
                      {message.institute || copy.notProvided}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">{copy.role}</span>{" "}
                      {message.role || copy.notProvided}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--oman-ink)]">{copy.submitted}</span>{" "}
                      {formatSubmittedAt(message.created_at) || copy.unknown}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--oman-ink)]/70">
                    {page.openHint}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeMessage && (
        <div className="oman-overlay fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] oman-card p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setActiveMessage(null)}
              className="absolute right-4 top-4 rounded-full bg-[rgba(197,154,68,0.12)] px-3 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.2)]"
              aria-label={copy.close}
            >
              {copy.close}
            </button>

            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              {page.popupKicker}
            </p>
            <h2 className="oman-title-accent mt-4 pr-16 text-2xl font-semibold sm:text-3xl">
              {activeMessage.subject}
            </h2>

            <div className="mt-6 grid gap-3 text-sm leading-6 text-[var(--oman-ink)]/75 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.from}</span>{" "}
                {activeMessage.full_name}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.email}</span>{" "}
                {activeMessage.email}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.institute}</span>{" "}
                {activeMessage.institute || copy.notProvided}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.role}</span>{" "}
                {activeMessage.role || copy.notProvided}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.status}</span>{" "}
                {formatStatusLabel(activeMessage.status)}
              </p>
              <p>
                <span className="font-semibold text-[var(--oman-ink)]">{copy.submitted}</span>{" "}
                {formatSubmittedAt(activeMessage.created_at) || copy.unknown}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.1)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                {copy.statusWorkflow}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1">
                  <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                    {copy.updateStatus}
                  </span>
                  <select
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)]"
                  >
                    {CONTACT_STATUS_OPTIONS.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {formatStatusLabel(statusOption)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleStatusSave}
                  disabled={statusSaving || statusDraft === normalizeStatus(activeMessage.status)}
                  className="oman-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {statusSaving ? copy.saving : copy.saveStatus}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[rgba(255,252,247,0.92)] px-4 py-4 text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.1)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                {page.message}
              </p>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--oman-ink)]/80">
                {activeMessage.message}
              </p>
            </div>

            {(activeMessage.attachment_notes ||
              (Array.isArray(activeMessage.attachment_files) && activeMessage.attachment_files.length > 0)) && (
              <div className="mt-4 rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-[var(--oman-ink)]">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
                  {copy.attachments}
                </p>
                {activeMessage.attachment_notes && (
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--oman-ink)]/80">
                    {activeMessage.attachment_notes}
                  </p>
                )}
                <AdminAttachmentDownloadList
                  files={activeMessage.attachment_files}
                  bucket="contact-attachments"
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
