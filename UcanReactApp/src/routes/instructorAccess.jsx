import AuthAccessPage from "./AuthAccessPage";
import InstructorApplicationSignupPanel from "../components/InstructorApplicationSignupPanel";
import { useLanguage } from "../context/LanguageContext";
import { themeImages } from "../lib/themeImages";

export default function InstructorAccess() {
  const { t } = useLanguage();
  const copy = t("accessPages.tutor");

  return (
    <AuthAccessPage
      audienceLabel={copy.audienceLabel}
      title={copy.title}
      description={copy.description}
      signupHeading={copy.signupHeading}
      role="instructor"
      accessImage={themeImages.brandWorkers}
      accessImageAlt={copy.imageAlt}
      signupPanel={<InstructorApplicationSignupPanel />}
    />
  );
}
