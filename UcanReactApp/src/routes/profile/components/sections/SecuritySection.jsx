import { useState } from "react";
import PasswordField from "../../../../components/PasswordField";
import { Button, Field } from "../../../../components/ui";
import { updateEmail, updatePassword } from "../../../../lib/profileSettingsApi";
import SectionFrame from "../SectionFrame";

export default function SecuritySection({ user, refreshProfile, meta }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const providers =
    user?.app_metadata?.providers ||
    user?.identities?.map((identity) => identity.provider) ||
    [];

  const handlePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setFeedback(null);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      await updatePassword(password);
      setPassword("");
      setConfirmPassword("");
      setFeedback({
        type: "success",
        title: "Password updated",
        message: "Use your new password the next time you sign in.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Password change failed",
        message: error?.message || "Could not update password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleEmail = async (event) => {
    event.preventDefault();
    setSavingEmail(true);
    setFeedback(null);

    try {
      await updateEmail(email);
      await refreshProfile();
      setFeedback({
        type: "success",
        title: "Email update started",
        message:
          "If confirmation is required, check your inbox (old and new address) to finish the change.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Email change failed",
        message: error?.message || "Could not update email.",
      });
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      <div className="space-y-8">
        <form className="space-y-4 rounded-3xl oman-outline-panel p-5" onSubmit={handlePassword}>
          <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Change password</h3>
          <PasswordField
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="At least 8 characters"
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <Button type="submit" loading={savingPassword} disabled={savingPassword}>
            Update password
          </Button>
        </form>

        <form className="space-y-4 rounded-3xl oman-outline-panel p-5" onSubmit={handleEmail}>
          <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Change email</h3>
          <Field
            label="Email address"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" loading={savingEmail} disabled={savingEmail}>
            Update email
          </Button>
        </form>

        <div className="rounded-3xl oman-outline-panel p-5">
          <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Sign-in methods</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--oman-ink)]/75">
            Linked providers on this account:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--oman-ink)]">
            {(providers.length ? providers : ["email"]).map((provider) => (
              <li key={provider} className="capitalize">
                {provider}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}
