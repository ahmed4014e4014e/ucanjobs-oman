import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import PasswordField from "../components/PasswordField";
import { useLanguage } from "../context/LanguageContext";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { themeImages } from "../lib/themeImages";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const copy = t("resetPasswordPage");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        showMessage("success", copy.recoveryPrompt);
      }
    });

    return () => subscription.unsubscribe();
  }, [copy.recoveryPrompt]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      showMessage("error", copy.supabaseMissing);
      return;
    }

    if (password.length < 6) {
      showMessage("error", copy.shortPassword);
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showMessage("error", error.message);
      setLoading(false);
      return;
    }

    showMessage("success", copy.success);
    setPassword("");
    setLoading(false);

    window.setTimeout(() => {
      navigate("/admin-access/", { replace: true });
    }, 1600);
  };

  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-5xl">
        <div
          className="oman-hero overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-xl sm:px-8 sm:py-12"
          style={{ backgroundImage: `url(${themeImages.studentsGroup})` }}
        >
          <p className="oman-kicker text-xs font-semibold uppercase sm:text-sm">
            {copy.heroKicker}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#f4e8d6] sm:text-lg sm:leading-8">
            {copy.heroText}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] oman-card p-6 sm:p-8">
        <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
          {copy.formKicker}
        </p>
        <h2 className="oman-title-accent mt-4 text-2xl font-semibold">
          {copy.formTitle}
        </h2>

        <ActionFeedback
          type={messageType}
          message={message}
          title={copy.feedbackTitle}
          className="mt-6 rounded-3xl px-5 py-4"
        />

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <PasswordField
            label={copy.label}
            placeholder={copy.placeholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="oman-button-primary inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? copy.updating : copy.update}
          </button>
        </form>

        <Link
          to="/admin-access/"
          className="oman-button-secondary mt-4 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold transition"
        >
          {copy.back}
        </Link>
      </section>
    </main>
  );
}
