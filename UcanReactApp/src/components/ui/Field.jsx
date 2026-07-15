function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

const controlBase =
  "w-full rounded-2xl border border-[rgba(111,49,29,0.16)] bg-[rgba(255,252,247,0.92)] px-4 py-3 text-[var(--oman-ink)] shadow-sm outline-none transition placeholder:text-[var(--oman-ink)]/40 focus:border-[var(--oman-brass)] focus:ring-2 focus:ring-[rgba(197,154,68,0.28)] disabled:cursor-not-allowed disabled:opacity-70";

/**
 * Label + control + optional hint/error. Supports input, textarea, and select via `as`.
 */
export default function Field({
  as = "input",
  label,
  name,
  id,
  required = false,
  error = "",
  hint = "",
  className = "",
  controlClassName = "",
  children,
  ...props
}) {
  const fieldId = id || name;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
  const Control = as;

  return (
    <label className={joinClasses("block", className)} htmlFor={fieldId}>
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-[var(--oman-ink)]">
          {label}
          {required ? (
            <span className="ml-1 text-[var(--oman-terracotta)]" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      ) : null}

      <Control
        id={fieldId}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={joinClasses(
          controlBase,
          error ? "border-[rgba(155,77,49,0.45)] focus:ring-[rgba(155,77,49,0.2)]" : "",
          controlClassName
        )}
        {...props}
      >
        {as === "select" ? children : undefined}
      </Control>

      {error ? (
        <span id={`${fieldId}-error`} className="mt-2 block text-sm text-[var(--oman-terracotta-dark)]">
          {error}
        </span>
      ) : null}

      {!error && hint ? (
        <span id={`${fieldId}-hint`} className="mt-2 block text-sm text-[var(--oman-ink)]/65">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
