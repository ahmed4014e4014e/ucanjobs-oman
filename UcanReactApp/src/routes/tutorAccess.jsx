import AuthAccessPage from "./AuthAccessPage";
import TutorApplicationSignupPanel from "../components/TutorApplicationSignupPanel";
import { useLanguage } from "../context/LanguageContext";
import soharUniversityImage from "../assets/auth-images/sohar-university.jpg";

export default function TutorAccess() {
  const { t } = useLanguage();
  const copy = t("accessPages.tutor");

  return (
    <AuthAccessPage
      audienceLabel={copy.audienceLabel}
      title={copy.title}
      description={copy.description}
      signupHeading={copy.signupHeading}
      role="tutor"
      accessImage={soharUniversityImage}
      accessImageAlt={copy.imageAlt}
      signupPanel={<TutorApplicationSignupPanel />}
    />
  );
}
