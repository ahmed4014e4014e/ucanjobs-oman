import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function TutorApplicationSignupPanel() {
  const { t } = useLanguage();
  const copy = t("tutorApplicationPanel");

  return (
    <>
      <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
        {copy.kicker}
      </p>
      <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
        {copy.title}
      </h2>
      <p className="mt-4 leading-7 text-[var(--oman-ink)]/75">
        {copy.text}
      </p>
      <div className="mt-6 rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-[var(--oman-ink)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
          {copy.needsTitle}
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--oman-ink)]/80">
          {copy.needs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <Link
        to="/tutor-application/"
        className="oman-button-primary mt-6 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition"
      >
        {copy.button}
      </Link>
    </>
  );
}
