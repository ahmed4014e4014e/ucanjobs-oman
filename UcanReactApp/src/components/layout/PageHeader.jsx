function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Section / page heading block with optional kicker, description, and actions.
 */
export default function PageHeader({
  kicker,
  title,
  description,
  actions,
  align = "left",
  tone = "default",
  className = "",
  titleAs: TitleTag = "h2",
}) {
  const isCenter = align === "center";
  const isOnDark = tone === "onDark";

  return (
    <div
      className={joinClasses(
        isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-center lg:text-left",
        className
      )}
    >
      {kicker ? (
        <p
          className={joinClasses(
            "text-xs font-semibold uppercase sm:text-sm",
            isOnDark ? "oman-kicker" : "oman-section-kicker"
          )}
        >
          {kicker}
        </p>
      ) : null}

      {title ? (
        <TitleTag
          className={joinClasses(
            "mt-4 text-2xl font-semibold sm:text-3xl",
            isOnDark ? "text-white" : "oman-title-accent"
          )}
        >
          {title}
        </TitleTag>
      ) : null}

      {description ? (
        <p
          className={joinClasses(
            "mt-4 text-base leading-7 sm:text-lg sm:leading-8",
            isOnDark ? "text-[#eadfcf]" : "text-[var(--oman-ink)]/75"
          )}
        >
          {description}
        </p>
      ) : null}

      {actions ? (
        <div
          className={joinClasses(
            "mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
            isCenter ? "sm:justify-center" : "lg:justify-start"
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
