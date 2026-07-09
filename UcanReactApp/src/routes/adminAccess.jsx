import AuthAccessPage from "./AuthAccessPage";
import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";

export default function AdminAccess() {
  const { t } = useLanguage();
  const copy = t("accessPages.admin");

  return (
    <AuthAccessPage
      audienceLabel={copy.audienceLabel}
      title={copy.title}
      description={copy.description}
      role="admin"
      allowSignup={false}
      accessImage={themeImages.brandWordmark}
      accessImageAlt={copy.imageAlt}
    />
  );
}
