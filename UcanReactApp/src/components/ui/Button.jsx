import { Link } from "react-router-dom";

const variantClass = {
  primary: "oman-button-primary",
  secondary: "oman-button-secondary",
  ghost:
    "border border-[rgba(111,49,29,0.14)] bg-[rgba(255,252,247,0.85)] text-[var(--oman-ink)] hover:bg-[rgba(197,154,68,0.12)]",
  danger:
    "border border-[rgba(155,77,49,0.28)] bg-[rgba(155,77,49,0.12)] text-[var(--oman-terracotta-dark)] hover:bg-[rgba(155,77,49,0.18)]",
};

const sizeClass = {
  sm: "rounded-xl px-4 py-2 text-sm",
  md: "rounded-2xl px-5 py-3 text-sm sm:text-base",
  lg: "rounded-2xl px-6 py-3.5 text-base",
};

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * UcanJobs design-system button.
 * Renders a <button>, <a>, or react-router <Link> when `to` / `href` is set.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  type = "button",
  loading = false,
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) {
  const classes = joinClasses(
    "inline-flex items-center justify-center font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]",
    variantClass[variant] || variantClass.primary,
    sizeClass[size] || sizeClass.md,
    fullWidth ? "w-full" : "",
    loading || disabled ? "cursor-not-allowed opacity-70" : "",
    className
  );

  const content = loading ? (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        aria-hidden="true"
      />
      <span>{children}</span>
    </span>
  ) : (
    children
  );

  if (to) {
    const { onClick, ...rest } = props;
    return (
      <Link
        to={to}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        onClick={(event) => {
          if (disabled || loading) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
}
