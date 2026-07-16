import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui";
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

export default function PrivacySection({ user, meta }) {
  const [values, setValues] = useState({
    show_public_profile: false,
    show_email_on_profile: false,
    show_institute_on_profile: true,
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
          show_public_profile: Boolean(prefs.show_public_profile),
          show_email_on_profile: Boolean(prefs.show_email_on_profile),
          show_institute_on_profile: Boolean(prefs.show_institute_on_profile),
        });
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: "error",
          title: "Load failed",
          message: error?.message || "Could not load privacy settings.",
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
        message: "Privacy preferences were updated.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Save failed",
        message: error?.message || "Could not save privacy settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      {loading ? (
        <p className="text-[var(--oman-ink)]/75">Loading privacy settings…</p>
      ) : (
        <form className="space-y-3" onSubmit={handleSave}>
          <ToggleRow
            id="show_public_profile"
            label="Allow public profile"
            hint="When enabled, other members may view a public version of your profile in the future."
            checked={values.show_public_profile}
            onChange={(checked) =>
              setValues((current) => ({ ...current, show_public_profile: checked }))
            }
          />
          <ToggleRow
            id="show_email_on_profile"
            label="Show email on profile"
            hint="Only applies if a public profile is available."
            checked={values.show_email_on_profile}
            onChange={(checked) =>
              setValues((current) => ({ ...current, show_email_on_profile: checked }))
            }
          />
          <ToggleRow
            id="show_institute_on_profile"
            label="Show institute on profile"
            checked={values.show_institute_on_profile}
            onChange={(checked) =>
              setValues((current) => ({
                ...current,
                show_institute_on_profile: checked,
              }))
            }
          />
          <Button type="submit" loading={saving} disabled={saving} className="mt-4">
            Save privacy settings
          </Button>
        </form>
      )}
    </SectionFrame>
  );
}
