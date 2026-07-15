import { useLanguage } from "../../context/LanguageContext";

/**
 * Shared public-site footer.
 */
export default function SiteFooter({ className = "" }) {
  const { t } = useLanguage();
  const footerText = t("common.footer").replace("{year}", new Date().getFullYear());

  return (
    <footer
      className={[
        "border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.9)] px-4 py-8 text-center text-sm text-[var(--oman-ink)]/70 sm:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {footerText}
    </footer>
  );
}
