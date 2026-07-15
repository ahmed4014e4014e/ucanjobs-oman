function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

const widthClass = {
  default: "",
  full: "",
};

/**
 * Page shell: oman-page background + min height. Content sections manage max-width.
 */
export default function Page({
  as: Component = "main",
  width = "default",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={joinClasses(
        "oman-page min-h-screen text-[var(--color-text)]",
        widthClass[width],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
