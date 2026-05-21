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
};

export default function ActionFeedback({
  type = "info",
  message,
  title,
  className = "",
}) {
  if (!message) {
    return null;
  }

  const style = feedbackStyles[type] || feedbackStyles.info;

  return (
    <div className={`rounded-2xl px-4 py-4 text-sm leading-6 ${style.container} ${className}`.trim()}>
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${style.badge}`}
        >
          {type}
        </span>
        <div className="min-w-0">
          <p className="font-semibold">{title || style.title}</p>
          <p className="mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
