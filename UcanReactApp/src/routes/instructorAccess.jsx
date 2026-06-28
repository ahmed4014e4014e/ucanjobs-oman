import AuthAccessPage from "./AuthAccessPage";
import InstructorApplicationSignupPanel from "../components/InstructorApplicationSignupPanel";
import { useLanguage } from "../context/LanguageContext";
import soharUniversityImage from "../assets/auth-images/sohar-university.jpg";

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
      accessImage={soharUniversityImage}
      accessImageAlt={copy.imageAlt}
      signupPanel={<InstructorApplicationSignupPanel />}
    />
  );
}
