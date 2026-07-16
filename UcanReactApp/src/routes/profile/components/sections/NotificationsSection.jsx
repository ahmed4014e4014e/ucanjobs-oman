import { useEffect, useState } from "react";
import { Button, Field } from "../../../../components/ui";
import {
  fetchProfilePreferences,
  upsertProfilePreferences,
} from "../../../../lib/profileSettingsApi";
import SectionFrame from "../SectionFrame";

function ToggleRow({ id, label, hint, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl oman-outline-panel p-5"
    >
      <span>
        <span className="block font-semibold text-[var(--oman-ink)]">{label}</span>
        {hint ? (
          <span className="mt-1 block text-sm text-[var(--oman-ink)]/70">{hint}</span>
        ) : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 rounded border-[rgba(111,49,29,0.3)] text-[var(--oman-terracotta)] focus:ring-[var(--oman-brass)]"
      />
    </label>
  );
}

export default function NotificationsSection({ user, meta }) {
  const [values, setValues] = useState({
    email_course_updates: true,
    email_payment_updates: true,
    email_marketing: false,
    email_product_announcements: true,
    preferred_language: "en",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fullPrefs, setFullPrefs] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const prefs = await fetchProfilePreferences(user.id);
        if (!active) return;
        setFullPrefs(prefs);
        setValues({
          email_course_updates: Boolean(prefs.email_course_updates),
          email_payment_updates: Boolean(prefs.email_payment_updates),
          email_marketing: Boolean(prefs.email_marketing),
          email_product_announcements: Boolean(prefs.email_product_announcements),
          preferred_language: prefs.preferred_language === "ar" ? "ar" : "en",
        });
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: "error",
          title: "Load failed",
          message: error?.message || "Could not load notification preferences.",
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const base = fullPrefs || (await fetchProfilePreferences(user.id));
      const saved = await upsertProfilePreferences(user.id, { ...base, ...values });
      setFullPrefs(saved);
      setFeedback({
        type: "success",
        title: "Saved",
        message:
          "Notification preferences saved. Email delivery workers will use these flags when enabled.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Save failed",
        message: error?.message || "Could not save notification preferences.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      {loading ? (
        <p className="text-[var(--oman-ink)]/75">Loading notification preferences…</p>
      ) : (
        <form className="space-y-3" onSubmit={handleSave}>
          <ToggleRow
            id="email_course_updates"
            label="Course updates"
            hint="Enrollment, new lessons, and learning reminders."
            checked={values.email_course_updates}
            onChange={(checked) =>
              setValues((current) => ({ ...current, email_course_updates: checked }))
            }
          />
          <ToggleRow
            id="email_payment_updates"
            label="Payment updates"
            hint="Payment proof received, approved, or rejected."
            checked={values.email_payment_updates}
            onChange={(checked) =>
              setValues((current) => ({ ...current, email_payment_updates: checked }))
            }
          />
          <ToggleRow
            id="email_product_announcements"
            label="Product announcements"
            hint="Important UcanJobs platform updates."
            checked={values.email_product_announcements}
            onChange={(checked) =>
              setValues((current) => ({
                ...current,
                email_product_announcements: checked,
              }))
            }
          />
          <ToggleRow
            id="email_marketing"
            label="Marketing emails"
            hint="Optional tips and promotional content."
            checked={values.email_marketing}
            onChange={(checked) =>
              setValues((current) => ({ ...current, email_marketing: checked }))
            }
          />
          <Field
            as="select"
            label="Preferred language for emails"
            name="preferred_language"
            value={values.preferred_language}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                preferred_language: event.target.value,
              }))
            }
            className="mt-4"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </Field>
          <Button type="submit" loading={saving} disabled={saving} className="mt-4">
            Save notification preferences
          </Button>
        </form>
      )}
    </SectionFrame>
  );
}
