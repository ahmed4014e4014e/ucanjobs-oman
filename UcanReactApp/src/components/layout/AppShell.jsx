import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { getDashboardPath, getUserRole } from "../../lib/authRouting";
import { Alert, Button } from "../ui";

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function getVisibleRoleLabel(role, t) {
  if (role === "student" || role === "learner") {
    return t("roles.learner");
  }

  if (role === "tutor" || role === "instructor") {
    return t("roles.instructor");
  }

  if (role === "admin") {
    return t("roles.admin");
  }

  return t("roles.member");
}

function getProfileInitials(profile, user) {
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "U";
  const parts = displayName.split(/[\s@._-]+/).filter(Boolean);

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
}

function getProfilePhotoUrl(profile, user) {
  return (
    profile?.avatar_url ||
    profile?.profile_photo_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    ""
  );
}

/**
 * Global chrome: fixed nav + main route outlet.
 */
export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const role = getUserRole(profile, user);
  const profilePhotoUrl = getProfilePhotoUrl(profile, user);
  const profileInitials = getProfileInitials(profile, user);

  const baseLinks = [
    { name: t("nav.home"), to: "/home/" },
    { name: t("nav.about"), to: "/about/" },
    { name: t("nav.services"), to: "/courses/" },
    { name: t("nav.contact"), to: "/contact/" },
    { name: t("nav.policies"), to: "/terms/" },
  ];
  const guestLinks = [
    { name: t("nav.studentAccess"), to: "/learner-access/" },
    { name: t("nav.tutorAccess"), to: "/instructor-access/" },
    { name: t("nav.adminAccess"), to: "/admin-access/" },
  ];
  const memberLinks = [{ name: t("nav.dashboard"), to: getDashboardPath(role) }];
  const adminLinks = role === "admin" ? [{ name: t("nav.adminDashboard"), to: "/admin-dashboard/" }] : [];
  const links = [...baseLinks, ...guestLinks, ...(user ? memberLinks : []), ...adminLinks];

  const navLinkClass = ({ isActive }) =>
    [
      "rounded-xl px-1 py-0.5 transition duration-200",
      isActive
        ? "text-[var(--oman-terracotta)]"
        : "text-[var(--oman-ink)] hover:text-[var(--oman-terracotta)]",
    ].join(" ");

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    setLogoutMessage(t("feedback.loggedOut"));
    navigate("/home/", { replace: true });
  };

  useEffect(() => {
    if (!logoutMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setLogoutMessage("");
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [logoutMessage]);

  const profileLinkClass =
    "flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(197,154,68,0.35)] bg-[rgba(244,232,214,0.72)] text-sm font-bold text-[var(--oman-terracotta-dark)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--oman-brass)]";

  return (
    <>
      <ScrollToTopOnRouteChange />
      {logoutMessage ? (
        <Alert
          type="success"
          message={logoutMessage}
          title={t("feedback.sessionUpdate")}
          className="fixed left-1/2 top-20 z-[80] w-[min(92vw,32rem)] -translate-x-1/2 px-5 py-4 shadow-lg backdrop-blur"
        />
      ) : null}

      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.92)] shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4">
          <Link to="/home/" className="min-w-0 shrink-0" onClick={() => setOpen(false)}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--oman-terracotta)] sm:text-xs sm:tracking-[0.35em]">
              {t("brand.kicker")}
            </p>
            <h1 className="text-lg font-bold text-[var(--oman-ink)] sm:text-2xl">{t("brand.name")}</h1>
          </Link>

          <div className="hidden items-center gap-3 lg:flex xl:gap-5">
            {user ? (
              <div className="rounded-full border border-[rgba(197,154,68,0.24)] bg-[rgba(197,154,68,0.12)] px-3 py-1.5 text-sm font-medium capitalize text-[var(--oman-terracotta-dark)]">
                {getVisibleRoleLabel(role, t)}
              </div>
            ) : null}

            <ul className="flex items-center gap-4 text-sm xl:gap-6 xl:text-base">
              {links.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {!loading && user ? (
              <>
                <Link to="/profile/" className={profileLinkClass} aria-label="Open profile" title="Profile">
                  {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span>{profileInitials}</span>
                  )}
                </Link>
                <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
                  {t("nav.logout")}
                </Button>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {!loading && user ? (
              <Link
                to="/profile/"
                onClick={() => setOpen(false)}
                className={profileLinkClass}
                aria-label="Open profile"
              >
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{profileInitials}</span>
                )}
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,252,247,0.85)] text-[var(--oman-ink)] transition hover:bg-[rgba(197,154,68,0.12)]"
              aria-expanded={open}
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            >
              <span className="sr-only">{open ? t("nav.closeMenu") : t("nav.openMenu")}</span>
              <span aria-hidden="true" className="relative h-4 w-5">
                <span
                  className={[
                    "absolute left-0 h-0.5 w-5 rounded-full bg-current transition",
                    open ? "top-2 rotate-45" : "top-0",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition",
                    open ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 h-0.5 w-5 rounded-full bg-current transition",
                    open ? "top-2 -rotate-45" : "top-4",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>
        </div>

        {open ? (
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.98)] px-4 py-4 shadow-md lg:hidden">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "rounded-2xl px-4 py-3 text-base font-medium transition",
                      isActive
                        ? "bg-[rgba(197,154,68,0.16)] text-[var(--oman-terracotta)]"
                        : "text-[var(--oman-ink)] hover:bg-[rgba(197,154,68,0.08)] hover:text-[var(--oman-terracotta)]",
                    ].join(" ")
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {!loading && user ? (
                <Button type="button" variant="secondary" fullWidth onClick={handleLogout}>
                  {t("nav.logout")}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </nav>

      <Outlet />
    </>
  );
}
