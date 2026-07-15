const feedbackStyles = {
  error: {
    container:
      "border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] text-[var(--oman-terracotta-dark)]",
    badge: "bg-[rgba(155,77,49,0.12)] text-[var(--oman-terracotta-dark)]",
    title: "Action failed",
  },
  success: {
    container:
      "border border-[rgba(82,101,74,0.22)] bg-[rgba(239,246,236,0.95)] text-[var(--oman-olive)]",
    badge: "bg-[rgba(82,101,74,0.12)] text-[var(--oman-olive)]",
    title: "Success",
  },
  info: {
    container:
      "border border-[rgba(197,154,68,0.24)] bg-[rgba(255,244,222,0.9)] text-[var(--oman-terracotta-dark)]",
    badge: "bg-[rgba(197,154,68,0.16)] text-[var(--oman-terracotta-dark)]",
    title: "Heads up",
  },
  warning: {
    container:
      "border border-[rgba(197,154,68,0.35)] bg-[rgba(255,248,230,0.95)] text-[var(--oman-terracotta-dark)]",
    badge: "bg-[rgba(197,154,68,0.2)] text-[var(--oman-terracotta-dark)]",
    title: "Warning",
  },
};

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Inline feedback banner. Prefer this over ActionFeedback for new UI.
 */
export default function Alert({
  type = "info",
  message,
  title,
  className = "",
  onClose,
}) {
  if (!message) {
    return null;
  }

  const style = feedbackStyles[type] || feedbackStyles.info;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={joinClasses("rounded-2xl px-4 py-4 text-sm leading-6", style.container, className)}
    >
      <div className="flex items-start gap-3">
        <span
          className={joinClasses(
            "inline-flex shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
            style.badge
          )}
        >
          {type}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title || style.title}</p>
          <p className="mt-1">{message}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide opacity-70 transition hover:opacity-100"
            aria-label="Dismiss"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
