import AuthAccessPage from "./AuthAccessPage";
import { useLanguage } from "../context/LanguageContext";
import adminLoginImage from "../assets/auth-images/admin-login-photo.jpg";

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
      accessImage={adminLoginImage}
      accessImageAlt={copy.imageAlt}
    />
  );
}
