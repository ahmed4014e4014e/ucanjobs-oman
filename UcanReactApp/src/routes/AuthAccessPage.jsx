import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ActionFeedback from "../components/ActionFeedback";
import PasswordField from "../components/PasswordField";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getDashboardPath, getUserRole } from "../lib/authRouting";
import { themeImages } from "../lib/themeImages";

function getVisibleRoleLabel(role) {
  if (role === "student" || role === "learner") return "learner";
  if (role === "tutor" || role === "instructor") return "instructor";
  if (role === "admin") return "admin";
  return role || "member";
}

function normalizeRole(role) {
  if (role === "student") return "learner";
  if (role === "tutor") return "instructor";
  return role;
}

function formatCopy(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export default function AuthAccessPage({
  audienceLabel,
  title,
  description,
  signupHeading,
  role,
  allowSignup = true,
  accessImage,
  accessImageAlt,
  signupPanel = null,
  requireTermsAgreement = false,
  collectSignupProfile = true,
  enableGoogleAuth = false,
}) {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const copy = t("authAccess");
  const loginSectionRef = useRef(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetCooldownSeconds, setResetCooldownSeconds] = useState(0);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupInstitute, setSignupInstitute] = useState("");
  const [signupAcceptedTerms, setSignupAcceptedTerms] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [roleCheckInProgress, setRoleCheckInProgress] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  useEffect(() => {
    const urlHasRecoveryToken =
      window.location.hash.includes("type=recovery") ||
      window.location.search.includes("type=recovery");

    if (urlHasRecoveryToken) {
      setRecoveryMode(true);
      showMessage("success", copy.recoveryStart);
    }

    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        showMessage("success", copy.recoveryStart);
      }
    });

    return () => subscription.unsubscribe();
  }, [copy.recoveryStart]);

  useEffect(() => {
    if (resetCooldownSeconds <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setResetCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resetCooldownSeconds]);

  const sendUserToLogin = (email, text) => {
    setLoginEmail(email);
    setLoginPassword("");
    setPendingConfirmationEmail(email);
    showMessage("success", text);

    window.requestAnimationFrame(() => {
      loginSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  useEffect(() => {
    const resolvedRole = getUserRole(profile, user);

    if (!loading && user && resolvedRole && !roleCheckInProgress) {
      navigate(getDashboardPath(resolvedRole), { replace: true });
    }
  }, [loading, navigate, profile, roleCheckInProgress, user]);

  const resolveAccountRole = async (authUser) => {
    if (!authUser) {
      return null;
    }

    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, email")
      .eq("id", authUser.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const resolvedRole = normalizeRole(data?.role ?? authUser.user_metadata?.role ?? role);

    if (!data || !data.role || !data.email) {
      const profilePayload = {
        id: authUser.id,
        role: resolvedRole,
        email: authUser.email || loginEmail,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
        institute: authUser.user_metadata?.institute || null,
      };

      const { error: upsertError } = await supabase.from("profiles").upsert(profilePayload);

      if (upsertError) {
        throw upsertError;
      }

      await supabase.auth.updateUser({
        data: {
          role: resolvedRole,
          ...(profilePayload.full_name ? { full_name: profilePayload.full_name } : {}),
          ...(profilePayload.institute ? { institute: profilePayload.institute } : {}),
        },
      });
    }

    return resolvedRole;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        copy.supabaseMissing
      );
      return;
    }

    setLoginLoading(true);
    setRoleCheckInProgress(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      const errorMessage = error.message || "";
      const shouldSuggestSignup =
        role === "learner" &&
        /invalid login credentials|invalid credentials|email not confirmed/i.test(errorMessage);

      showMessage(
        "error",
        shouldSuggestSignup
          ? copy.studentSignupFirst
          : errorMessage
      );
      setRoleCheckInProgress(false);
      setLoginLoading(false);
      return;
    }

    let actualRole = null;

    try {
      actualRole = await resolveAccountRole(data.user);
    } catch (roleError) {
      if (role === "admin") {
        await supabase.auth.signOut();
        showMessage("error", roleError?.message || copy.profileLoadError);
        setRoleCheckInProgress(false);
        setLoginLoading(false);
        return;
      }

      actualRole = normalizeRole(data.user?.user_metadata?.role ?? role);

      try {
        await supabase.auth.updateUser({
          data: {
            role: actualRole,
          },
        });
      } catch (_metadataError) {
        // A metadata refresh is useful, but learner/instructor login should not get stuck on it.
      }
    }

    if (!actualRole) {
      await supabase.auth.signOut();
      showMessage(
        "error",
        copy.profileLoadError
      );
      setRoleCheckInProgress(false);
      setLoginLoading(false);
      return;
    }

    if (actualRole !== normalizeRole(role)) {
      await supabase.auth.signOut();
      showMessage(
        "error",
        formatCopy(copy.wrongRole, { role: getVisibleRoleLabel(actualRole) })
      );
      setRoleCheckInProgress(false);
      setLoginLoading(false);
      return;
    }

    showMessage("success", copy.loginSuccess);
    setRoleCheckInProgress(false);
    setLoginLoading(false);
    navigate(getDashboardPath(actualRole), { replace: true });
  };

  const handleForgotPassword = async () => {
    if (resetCooldownSeconds > 0) {
      showMessage(
        "error",
        formatCopy(copy.resetCooldown, { seconds: resetCooldownSeconds })
      );
      return;
    }

    if (!loginEmail) {
      showMessage("error", copy.enterEmailFirst);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        copy.supabaseMissing
      );
      return;
    }

    setResetLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: `${window.location.origin}/reset-password/`,
    });

    if (error) {
      showMessage("error", error.message);
      setResetLoading(false);
      return;
    }

    showMessage(
      "success",
      formatCopy(copy.resetSent, { email: loginEmail })
    );
    setResetCooldownSeconds(60);
    setResetLoading(false);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (!resetPassword || resetPassword.length < 6) {
      showMessage("error", copy.shortPassword);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        copy.supabaseMissing
      );
      return;
    }

    setResetLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: resetPassword,
    });

    if (error) {
      showMessage("error", error.message);
      setResetLoading(false);
      return;
    }

    setResetPassword("");
    setRecoveryMode(false);
    showMessage("success", copy.passwordUpdated);
    navigate(getDashboardPath(role), { replace: true });
    setResetLoading(false);
  };

  const handleResendConfirmation = async () => {
    const emailToConfirm = pendingConfirmationEmail || signupEmail || loginEmail;

    if (!emailToConfirm) {
      showMessage("error", copy.confirmationEmailFirst);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        copy.supabaseMissing
      );
      return;
    }

    setResendLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: emailToConfirm,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      showMessage("error", error.message);
      setResendLoading(false);
      return;
    }

    setPendingConfirmationEmail(emailToConfirm);
    showMessage(
      "success",
      formatCopy(copy.confirmationResent, { email: emailToConfirm })
    );
    setResendLoading(false);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (requireTermsAgreement && !signupAcceptedTerms) {
      showMessage(
        "error",
        copy.termsRequired
      );
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        copy.supabaseMissing
      );
      return;
    }

    setSignupLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          role,
          ...(collectSignupProfile
            ? {
                full_name: signupName,
                institute: signupInstitute,
              }
            : {}),
        },
      },
    });

    if (error) {
      if (error.message?.toLowerCase().includes("already registered")) {
        sendUserToLogin(
          signupEmail,
          formatCopy(copy.existingAccount, { email: signupEmail })
        );
        setSignupLoading(false);
        return;
      }

      showMessage("error", error.message);
      setSignupLoading(false);
      return;
    }

    const isExistingConfirmedAccount =
      !data.session &&
      data.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0;

    if (isExistingConfirmedAccount) {
      sendUserToLogin(
        signupEmail,
        formatCopy(copy.existingAccount, { email: signupEmail })
      );
      setSignupLoading(false);
      return;
    }

    setPendingConfirmationEmail(signupEmail);

    const userId = data.user?.id;
    const hasSession = Boolean(data.session);

    if (userId && hasSession) {
      const profilePayload = {
        id: userId,
        role,
        email: signupEmail,
        ...(collectSignupProfile
          ? {
              full_name: signupName,
              institute: signupInstitute,
            }
          : {}),
      };

      const { error: profileError } = await supabase.from("profiles").upsert(profilePayload);

      if (profileError) {
        showMessage(
          "error",
          formatCopy(copy.profileSyncFailed, { message: profileError.message })
        );
        setSignupLoading(false);
        return;
      }
    }

    if (data.session) {
      showMessage("success", copy.accountCreated);
      navigate(getDashboardPath(role), { replace: true });
    } else {
      showMessage(
        "success",
        formatCopy(copy.accountCreatedConfirm, { email: signupEmail })
      );
    }

    setSignupLoading(false);
  };

  const handleGoogleAuth = async () => {
    if (requireTermsAgreement && !signupAcceptedTerms) {
      showMessage(
        "error",
        copy.termsRequiredGoogle
      );
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        copy.supabaseMissing
      );
      return;
    }

    setGoogleLoading(true);
    setMessage("");

    try {
      window.localStorage.setItem("ucan_pending_oauth_role", role);
    } catch (_error) {
      // If storage is unavailable, the database auth flow can still complete Google auth.
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${getDashboardPath(role)}`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      try {
        window.localStorage.removeItem("ucan_pending_oauth_role");
      } catch (_storageError) {
        // Ignore storage access issues after a failed OAuth attempt.
      }
      showMessage("error", error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-5xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{
            backgroundImage: `url(${role === "instructor" ? themeImages.heroFort : themeImages.studentsGroup})`,
          }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
                {audienceLabel}
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
                {description}
              </p>
            </div>
            <div className="oman-card rounded-3xl p-4 text-[var(--oman-ink)]">
              <div className="oman-photo-frame aspect-[4/3]">
                <img
                  src={
                    accessImage ||
                    (role === "instructor" ? themeImages.mountainFort : themeImages.studentsStudyHall)
                  }
                  alt={
                    accessImageAlt ||
                    (role === "instructor"
                      ? "Traditional Omani fort scenery"
                      : "Students in a quiet study space")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        {!isSupabaseConfigured && (
          <div className="rounded-3xl border border-[rgba(197,154,68,0.28)] bg-[rgba(255,244,222,0.9)] px-5 py-4 text-sm leading-6 text-[var(--oman-terracotta-dark)]">
            {copy.supabaseNotice}
          </div>
        )}

        <ActionFeedback
          type={messageType}
          message={message}
          title={
            messageType === "error"
              ? copy.feedbackErrorTitle
              : recoveryMode
                ? copy.feedbackRecoveryTitle
                : copy.feedbackAccessTitle
          }
          className="mt-6 rounded-3xl px-5 py-4"
        />

        {!loading && !user && pendingConfirmationEmail && (
          <div className="mt-4 rounded-3xl oman-card px-5 py-4">
            <p className="text-sm leading-6 text-[var(--oman-ink)]/75">
              {copy.confirmationQuestion}{" "}
              <span className="font-semibold text-[var(--oman-ink)]">{pendingConfirmationEmail}</span>?
            </p>
            <button
              type="button"
              onClick={handleResendConfirmation}
              disabled={resendLoading}
              className="oman-button-secondary mt-4 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resendLoading ? copy.resending : copy.resendConfirmation}
            </button>
          </div>
        )}
      </section>

      <section
        className={[
          "mx-auto mt-10 grid max-w-5xl gap-8",
          allowSignup ? "lg:grid-cols-2" : "lg:grid-cols-1",
        ].join(" ")}
      >
        <div
          ref={loginSectionRef}
          className="rounded-[1.75rem] oman-card p-6 sm:p-8"
        >
          <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
            {recoveryMode ? copy.resetPassword : copy.logIn}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            {recoveryMode ? copy.createNewPassword : copy.welcomeBack}
          </h2>

          {recoveryMode ? (
            <form className="mt-6 space-y-4" onSubmit={handleUpdatePassword}>
              <PasswordField
                label={copy.newPassword}
                placeholder={copy.newPasswordPlaceholder}
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                required
              />
              <button
                type="submit"
                disabled={resetLoading}
                className="oman-button-primary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetLoading ? copy.updatingPassword : copy.updatePassword}
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">{copy.email}</span>
                <input
                  type="email"
                  placeholder={copy.emailPlaceholder}
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <PasswordField
                label={copy.password}
                placeholder={copy.passwordPlaceholder}
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="oman-button-secondary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading ? copy.loggingIn : copy.logIn}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading || resetCooldownSeconds > 0}
                className="w-full rounded-2xl px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.08)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetLoading
                  ? copy.sendingReset
                  : resetCooldownSeconds > 0
                    ? formatCopy(copy.tryAgain, { seconds: resetCooldownSeconds })
                    : copy.forgotPassword}
              </button>
            </form>
          )}
        </div>

        {allowSignup && (
          <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
            {signupPanel || (
              <>
                <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                  {copy.signUp}
                </p>
                <h2 className="oman-title-accent mt-4 text-2xl font-semibold">{signupHeading}</h2>
                <form className="mt-6 space-y-4" onSubmit={handleSignup}>
                  {collectSignupProfile && (
                    <>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">{copy.fullName}</span>
                        <input
                          type="text"
                          placeholder={copy.fullNamePlaceholder}
                          value={signupName}
                          onChange={(event) => setSignupName(event.target.value)}
                          className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                          required
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">{copy.institute}</span>
                        <input
                          type="text"
                          placeholder={copy.institutePlaceholder}
                          value={signupInstitute}
                          onChange={(event) => setSignupInstitute(event.target.value)}
                          className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                          required
                        />
                      </label>
                    </>
                  )}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">{copy.email}</span>
                    <input
                      type="email"
                      placeholder={copy.emailPlaceholder}
                      value={signupEmail}
                      onChange={(event) => setSignupEmail(event.target.value)}
                      className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                      required
                    />
                  </label>
                  <PasswordField
                    label={copy.password}
                    placeholder={copy.createPasswordPlaceholder}
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    required
                  />
                  {requireTermsAgreement && (
                    <label className="flex items-start gap-3 rounded-2xl bg-[rgba(244,232,214,0.34)] px-4 py-4 text-sm leading-6 text-[var(--oman-ink)]">
                      <input
                        type="checkbox"
                        checked={signupAcceptedTerms}
                        onChange={(event) => setSignupAcceptedTerms(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-[rgba(111,49,29,0.24)] text-[var(--oman-terracotta)] focus:ring-[var(--oman-brass)]"
                        required
                      />
                      <span>
                        {copy.termsAgreementPrefix}{" "}
                        <a
                          href="/terms/"
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[var(--oman-terracotta)] underline"
                        >
                          {copy.termsAgreementLink}
                        </a>
                        .
                      </span>
                    </label>
                  )}
                  {enableGoogleAuth && (
                    <>
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={googleLoading}
                        className="inline-flex w-full items-center justify-center rounded-2xl border border-[rgba(111,49,29,0.14)] bg-white px-6 py-3 text-center font-semibold text-[var(--oman-ink)] shadow-sm transition hover:bg-[rgba(244,232,214,0.32)] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {googleLoading ? copy.openingGoogle : copy.continueWithGoogle}
                      </button>
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-ink)]/45">
                        <span className="h-px flex-1 bg-[rgba(111,49,29,0.14)]" />
                        <span>{copy.or}</span>
                        <span className="h-px flex-1 bg-[rgba(111,49,29,0.14)]" />
                      </div>
                    </>
                  )}
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="oman-button-primary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {signupLoading ? copy.creatingAccount : copy.createAccount}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
