import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getDashboardPath, getUserRole } from "../lib/authRouting";
import { themeImages } from "../lib/themeImages";

export default function AuthAccessPage({
  audienceLabel,
  title,
  description,
  signupHeading,
  role,
  allowSignup = true,
  accessImage,
  accessImageAlt,
}) {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
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
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
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
      showMessage("success", "Enter a new password below to finish resetting your account.");
    }

    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        showMessage("success", "Enter a new password below to finish resetting your account.");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    if (!loading && user && profile?.role && !roleCheckInProgress) {
      navigate(getDashboardPath(profile.role), { replace: true });
    }
  }, [loading, navigate, profile, roleCheckInProgress, user]);

  const resolveAccountRole = async (authUser) => {
    if (!authUser) {
      return null;
    }

    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authUser.id)
      .maybeSingle();

    return data?.role ?? null;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local."
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
      showMessage("error", error.message);
      setRoleCheckInProgress(false);
      setLoginLoading(false);
      return;
    }

    const actualRole = await resolveAccountRole(data.user);

    if (!actualRole) {
      await supabase.auth.signOut();
      showMessage(
        "error",
        "We could not load your account profile yet. Please try again in a moment."
      );
      setRoleCheckInProgress(false);
      setLoginLoading(false);
      return;
    }

    if (actualRole !== role) {
      await supabase.auth.signOut();
      showMessage(
        "error",
        `This account is registered as a ${actualRole}. Please use the ${actualRole} access page instead.`
      );
      setRoleCheckInProgress(false);
      setLoginLoading(false);
      return;
    }

    showMessage("success", "Login successful.");
    setRoleCheckInProgress(false);
    navigate(getDashboardPath(actualRole), { replace: true });
    setLoginLoading(false);
  };

  const handleForgotPassword = async () => {
    if (resetCooldownSeconds > 0) {
      showMessage(
        "error",
        `Please wait ${resetCooldownSeconds} seconds before requesting another reset email.`
      );
      return;
    }

    if (!loginEmail) {
      showMessage("error", "Enter your email first, then click forgot password again.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local."
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
      `A password reset link was sent to ${loginEmail}. Please check your email and spam folder.`
    );
    setResetCooldownSeconds(60);
    setResetLoading(false);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (!resetPassword || resetPassword.length < 6) {
      showMessage("error", "Your new password must be at least 6 characters.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local."
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
    showMessage("success", "Your password was updated successfully. You can now log in.");
    navigate(getDashboardPath(role), { replace: true });
    setResetLoading(false);
  };

  const handleResendConfirmation = async () => {
    const emailToConfirm = pendingConfirmationEmail || signupEmail || loginEmail;

    if (!emailToConfirm) {
      showMessage("error", "Enter your email first so we can resend the confirmation link.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local."
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
      `A new confirmation email was sent to ${emailToConfirm}. Please also check your spam folder.`
    );
    setResendLoading(false);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      showMessage(
        "error",
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local."
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
          full_name: signupName,
          role,
          institute: signupInstitute,
        },
      },
    });

    if (error) {
      if (error.message?.toLowerCase().includes("already registered")) {
        sendUserToLogin(
          signupEmail,
          `An account with ${signupEmail} already exists. Please log in with your existing account instead.`
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
        `An account with ${signupEmail} already exists. Please log in with your existing account instead.`
      );
      setSignupLoading(false);
      return;
    }

    setPendingConfirmationEmail(signupEmail);

    const userId = data.user?.id;
    const hasSession = Boolean(data.session);

    if (userId && hasSession) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: signupName,
        role,
        institute: signupInstitute,
        email: signupEmail,
      });

      if (profileError) {
        showMessage(
          "error",
          `Account created, but profile sync failed: ${profileError.message}`
        );
        setSignupLoading(false);
        return;
      }
    }

    if (data.session) {
      showMessage("success", "Account created successfully.");
      navigate(getDashboardPath(role), { replace: true });
    } else {
      showMessage(
        "success",
        `Account created. Check ${signupEmail} for your confirmation email before logging in.`
      );
    }

    setSignupLoading(false);
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-5xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{
            backgroundImage: `url(${role === "tutor" ? themeImages.heroFort : themeImages.studentsGroup})`,
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
                    (role === "tutor" ? themeImages.mountainFort : themeImages.studentsStudyHall)
                  }
                  alt={
                    accessImageAlt ||
                    (role === "tutor"
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
            Supabase is not configured yet. Add `VITE_SUPABASE_URL` and
            `VITE_SUPABASE_ANON_KEY` to `.env.local` before testing auth.
          </div>
        )}

        {message && (
          <div
            className={[
              "mt-6 rounded-3xl px-5 py-4 text-sm leading-6",
              messageType === "error"
                ? "border border-[rgba(155,77,49,0.22)] bg-[rgba(255,239,232,0.95)] text-[var(--oman-terracotta-dark)]"
                : "border border-[rgba(82,101,74,0.22)] bg-[rgba(239,246,236,0.95)] text-[var(--oman-olive)]",
            ].join(" ")}
          >
            {message}
          </div>
        )}

        {!loading && !user && pendingConfirmationEmail && (
          <div className="mt-4 rounded-3xl oman-card px-5 py-4">
            <p className="text-sm leading-6 text-[var(--oman-ink)]/75">
              Did not receive the confirmation email for{" "}
              <span className="font-semibold text-[var(--oman-ink)]">{pendingConfirmationEmail}</span>?
            </p>
            <button
              type="button"
              onClick={handleResendConfirmation}
              disabled={resendLoading}
              className="oman-button-secondary mt-4 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resendLoading ? "Resending..." : "Resend Confirmation Email"}
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
            {recoveryMode ? "Reset Password" : "Log In"}
          </p>
          <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
            {recoveryMode ? "Create a new password" : "Welcome back"}
          </h2>

          {recoveryMode ? (
            <form className="mt-6 space-y-4" onSubmit={handleUpdatePassword}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">
                  New Password
                </span>
                <input
                  type="password"
                  placeholder="Enter a new password"
                  value={resetPassword}
                  onChange={(event) => setResetPassword(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={resetLoading}
                className="oman-button-primary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loginLoading}
                className="oman-button-secondary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading ? "Logging In..." : "Log In"}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading || resetCooldownSeconds > 0}
                className="w-full rounded-2xl px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.08)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetLoading
                  ? "Sending Reset Link..."
                  : resetCooldownSeconds > 0
                    ? `Try again in ${resetCooldownSeconds}s`
                    : "Forgot password?"}
              </button>
            </form>
          )}
        </div>

        {allowSignup && (
          <div className="rounded-[1.75rem] oman-card p-6 sm:p-8">
            <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
              Sign Up
            </p>
            <h2 className="oman-title-accent mt-4 text-2xl font-semibold">{signupHeading}</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSignup}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">Full Name</span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">Institute</span>
                <input
                  type="text"
                  placeholder="Enter your institute name"
                  value={signupInstitute}
                  onChange={(event) => setSignupInstitute(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">Password</span>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  className="min-h-12 rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={signupLoading}
                className="oman-button-primary mt-2 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signupLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
