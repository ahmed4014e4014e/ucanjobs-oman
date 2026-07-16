import { getProfileInitials } from "../profileDisplay";

export default function ProfileAvatar({
  photoUrl,
  displayName,
  email,
  size = "lg",
}) {
  const initials = getProfileInitials(displayName, email);
  const sizeClass =
    size === "sm"
      ? "h-16 w-16 text-lg"
      : size === "md"
        ? "h-24 w-24 text-2xl"
        : "h-32 w-32 text-3xl";

  return (
    <div
      className={[
        "mx-auto flex items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(111,49,29,0.12)] bg-[rgba(244,232,214,0.62)] font-bold text-[var(--oman-terracotta-dark)] shadow-sm",
        sizeClass,
      ].join(" ")}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${displayName || "Member"} profile photo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
