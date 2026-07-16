import { useEffect, useState } from "react";
import { Button, Field } from "../../../../components/ui";
import { getUserRole } from "../../../../lib/authRouting";
import { updateProfileBasics } from "../../../../lib/profileSettingsApi";
import { formatRoleLabel } from "../../profileDisplay";
import SectionFrame from "../SectionFrame";

export default function ProfileDetailsSection({
  user,
  profile,
  refreshProfile,
  meta,
}) {
  const role = getUserRole(profile, user);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [institute, setInstitute] = useState("");
  const [targetJobRole, setTargetJobRole] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setFullName(profile?.full_name || user?.user_metadata?.full_name || "");
    setHeadline(profile?.headline || user?.user_metadata?.headline || "");
    setBio(profile?.bio || "");
    setInstitute(profile?.institute || user?.user_metadata?.institute || "");
    setTargetJobRole(
      profile?.target_job_role || user?.user_metadata?.target_job_role || ""
    );
    setPhone(profile?.phone || user?.user_metadata?.phone || "");
    setWebsiteUrl(profile?.website_url || "");
  }, [profile, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (!fullName.trim()) {
        throw new Error("Full name is required.");
      }

      await updateProfileBasics({
        userId: user.id,
        email: user.email || profile?.email,
        role: role || undefined,
        fullName,
        institute,
        targetJobRole,
        headline,
        bio,
        phone,
        websiteUrl,
      });
      await refreshProfile();
      setFeedback({
        type: "success",
        title: "Saved",
        message: "Your profile details were updated.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Could not save",
        message: error?.message || "Something went wrong while saving.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionFrame
      title={meta.title}
      description={meta.description}
      feedback={feedback}
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <Field
          label="Full name"
          name="full_name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="sm:col-span-2"
        />
        <Field
          label="Headline"
          name="headline"
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          placeholder="e.g. Job seeker · Business graduate"
          className="sm:col-span-2"
        />
        <Field
          as="textarea"
          label="Bio"
          name="bio"
          rows={4}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="A short introduction about you"
          className="sm:col-span-2"
        />
        <Field
          label="Institute / university"
          name="institute"
          value={institute}
          onChange={(event) => setInstitute(event.target.value)}
        />
        <Field
          label="Target job role"
          name="target_job_role"
          value={targetJobRole}
          onChange={(event) => setTargetJobRole(event.target.value)}
          placeholder="e.g. Marketing associate"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <Field
          label="Website"
          name="website_url"
          type="url"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
          placeholder="https://"
        />

        <div className="rounded-3xl oman-outline-panel p-5 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
            Account (read-only)
          </p>
          <p className="mt-3 text-[var(--oman-ink)]">
            <span className="font-semibold">Email:</span>{" "}
            {user?.email || profile?.email || "Not set"}
          </p>
          <p className="mt-2 text-[var(--oman-ink)]">
            <span className="font-semibold">Role:</span> {formatRoleLabel(role)}
          </p>
          <p className="mt-2 text-sm text-[var(--oman-ink)]/70">
            Change email under Account Security. Role is managed by UcanJobs admins.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" loading={saving} disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </form>
    </SectionFrame>
  );
}
