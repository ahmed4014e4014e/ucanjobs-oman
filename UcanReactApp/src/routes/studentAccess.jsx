import AuthAccessPage from "./AuthAccessPage";
import { useLanguage } from "../context/LanguageContext";
import middleEastCollegeImage from "../assets/auth-images/middle-east-college.jpg";

export default function StudentAccess() {
  const { t } = useLanguage();
  const copy = t("accessPages.student");

  return (
    <AuthAccessPage
      audienceLabel={copy.audienceLabel}
      title={copy.title}
      description={copy.description}
      signupHeading={copy.signupHeading}
      role="student"
      requireTermsAgreement
      collectSignupProfile={false}
      enableGoogleAuth
      accessImage={middleEastCollegeImage}
      accessImageAlt={copy.imageAlt}
    />
  );
}
