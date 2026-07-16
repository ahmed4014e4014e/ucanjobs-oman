import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field } from "../../../../components/ui";
import { requestAccountDeletion } from "../../../../lib/profileSettingsApi";
import SectionFrame from "../SectionFrame";

export default function CloseAccountSection({ user, signOut, meta }) {
  const navigate = useNavigate();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const expected = (user?.email || "").trim().toLowerCase();
      if (confirmEmail.trim().toLowerCase() !== expected) {
        throw new Error("Type your account email exactly to confirm closure.");
      }

      await requestAccountDeletion({
        userId: user.id,
        reason,
      });
      await signOut();
      navigate("/home/", { replace: true });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Request failed",
        message: error?.message || "Could not submit account closure request.",
      });
      setSubmitting(false);
    }
  };

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      <div className="rounded-3xl border border-[rgba(155,77,49,0.28)] bg-[rgba(155,77,49,0.08)] p-5">
        <p className="leading-7 text-[var(--oman-ink)]">
          Closing your account queues a deletion request for UcanJobs staff. You will be signed out
          immediately. Course access and personal data removal are completed after review. This
          cannot be undone from the website once processed.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Field
          as="textarea"
          label="Reason (optional)"
          name="reason"
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Tell us why you are leaving"
        />
        <Field
          label={`Type your email to confirm (${user?.email || "your email"})`}
          name="confirm_email"
          type="email"
          required
          value={confirmEmail}
          onChange={(event) => setConfirmEmail(event.target.value)}
        />
        <Button type="submit" variant="danger" loading={submitting} disabled={submitting}>
          Request account closure
        </Button>
      </form>
    </SectionFrame>
  );
}
