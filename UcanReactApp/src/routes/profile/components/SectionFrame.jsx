import { Alert } from "../../../components/ui";

export default function SectionFrame({
  title,
  description,
  feedback,
  children,
}) {
  return (
    <div>
      <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
        Account settings
      </p>
      <h2 className="oman-title-accent mt-4 text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-3xl leading-7 text-[var(--oman-ink)]/75">
          {description}
        </p>
      ) : null}

      {feedback?.message ? (
        <Alert
          type={feedback.type || "info"}
          message={feedback.message}
          title={feedback.title}
          className="mt-5"
        />
      ) : null}

      <div className="mt-8">{children}</div>
    </div>
  );
}
