import AuthAccessPage from "./AuthAccessPage";
import middleEastCollegeImage from "../assets/auth-images/middle-east-college.jpg";

export default function StudentAccess() {
  return (
    <AuthAccessPage
      audienceLabel="Student Access"
      title="Log in or sign up to access student support on Ucan Oman."
      description="This page is designed for students who want to create an account, log in, and access tutoring, course support, and the wider learning community."
      signupHeading="Create a student account"
      role="student"
      requireTermsAgreement
      collectSignupProfile={false}
      enableGoogleAuth
      accessImage={middleEastCollegeImage}
      accessImageAlt="Middle East College campus in Oman"
    />
  );
}
