function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Full-bleed hero band with optional background image and content width.
 */
export default function Hero({
  backgroundImage,
  className = "",
  contentClassName = "",
  children,
  ...props
}) {
  return (
    <section
      className={joinClasses("oman-hero text-white", className)}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      {...props}
    >
      <div
        className={joinClasses(
          "mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
