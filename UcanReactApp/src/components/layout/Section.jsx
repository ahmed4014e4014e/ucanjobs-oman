function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

const spacingClass = {
  none: "",
  sm: "py-4 sm:py-8",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-20",
  tightBottom: "pb-16 sm:pb-20",
};

/**
 * Centered content section with standard page gutters.
 */
export default function Section({
  as: Component = "section",
  spacing = "md",
  className = "",
  innerClassName = "",
  children,
  ...props
}) {
  return (
    <Component
      className={joinClasses(
        "mx-auto max-w-6xl px-4 sm:px-6",
        spacingClass[spacing] ?? spacingClass.md,
        className
      )}
      {...props}
    >
      {innerClassName ? <div className={innerClassName}>{children}</div> : children}
    </Component>
  );
}
