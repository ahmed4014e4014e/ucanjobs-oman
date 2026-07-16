import { useRef, useState } from "react";
import { Button } from "../../../../components/ui";
import { removeAvatar, uploadAvatar } from "../../../../lib/profileSettingsApi";
import { getProfilePhotoUrl } from "../../profileDisplay";
import ProfileAvatar from "../ProfileAvatar";
import SectionFrame from "../SectionFrame";

export default function PhotoSection({ user, profile, refreshProfile, displayName, meta }) {
  const inputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const photoUrl = getProfilePhotoUrl(profile, user);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setSaving(true);
    setFeedback(null);

    try {
      await uploadAvatar({ userId: user.id, file });
      await refreshProfile();
      setFeedback({
        type: "success",
        title: "Photo updated",
        message: "Your profile photo is now live in the header and profile page.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Upload failed",
        message: error?.message || "Could not upload photo.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      await removeAvatar({ userId: user.id, currentUrl: photoUrl });
      await refreshProfile();
      setFeedback({
        type: "success",
        title: "Photo removed",
        message: "Your profile now shows initials instead of a photo.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Remove failed",
        message: error?.message || "Could not remove photo.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <ProfileAvatar
          photoUrl={photoUrl}
          displayName={displayName}
          email={user?.email}
          size="lg"
        />
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleUpload}
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              loading={saving}
              disabled={saving}
              onClick={() => inputRef.current?.click()}
            >
              Upload photo
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={saving || !photoUrl}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--oman-ink)]/70">
            JPEG, PNG, WebP, or GIF up to 5 MB. Square photos work best.
          </p>
        </div>
      </div>
    </SectionFrame>
  );
}
