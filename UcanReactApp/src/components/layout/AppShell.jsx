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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const role = getUserRole(profile, user);
  const profilePhotoUrl = getProfilePhotoUrl(profile, user);
  const profileInitials = getProfileInitials(profile, user);
  const isLoggedIn = Boolean(!loading && user);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
  const memberLinks = isLoggedIn
    ? [
        { name: t("nav.dashboard"), to: getDashboardPath(role) },
        { name: t("nav.profile"), to: "/profile/" },
        ...(role === "admin" ? [{ name: t("nav.adminDashboard"), to: "/admin-dashboard/" }] : []),
      ]
    : [];

  // Guests see login links; members do not — they get dashboard/profile instead.
  const desktopLinks = [...baseLinks, ...(isLoggedIn ? memberLinks : guestLinks)];
  const mobileLinks = desktopLinks;

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
    "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(197,154,68,0.35)] bg-[rgba(244,232,214,0.72)] text-sm font-bold text-[var(--oman-terracotta-dark)] shadow-sm transition hover:border-[var(--oman-brass)]";

  return (
    <>
      <ScrollToTopOnRouteChange />
      {logoutMessage ? (
        <Alert
          type="success"
          message={logoutMessage}
          title={t("feedback.sessionUpdate")}
          className="fixed left-1/2 top-20 z-[110] w-[min(92vw,32rem)] -translate-x-1/2 px-5 py-4 shadow-lg backdrop-blur"
        />
      ) : null}

      <nav
        className="app-shell-nav border-b border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.97)] shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,248,238,0.92)]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div
          className={[
            "app-shell-nav-inner mx-auto max-w-7xl py-3 sm:py-4",
            isLoggedIn ? "" : "app-shell-nav-inner--guest",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Brand: constrained so it never pushes past the phone width */}
          <Link to="/home/" className="min-w-0 overflow-hidden" onClick={() => setOpen(false)}>
            <p className="hidden truncate text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--oman-terracotta)] sm:block sm:text-xs sm:tracking-[0.28em]">
              {t("brand.kicker")}
            </p>
            <h1 className="truncate text-lg font-bold leading-tight text-[var(--oman-ink)] sm:text-2xl">
              {t("brand.name")}
            </h1>
          </Link>

          {/* Desktop navigation only */}
          <div className="hidden min-w-0 items-center gap-3 lg:flex xl:gap-5">
            {isLoggedIn ? (
              <div className="shrink-0 rounded-full border border-[rgba(197,154,68,0.24)] bg-[rgba(197,154,68,0.12)] px-3 py-1.5 text-sm font-medium capitalize text-[var(--oman-terracotta-dark)]">
                {getVisibleRoleLabel(role, t)}
              </div>
            ) : null}

            <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm xl:gap-x-6 xl:text-base">
              {desktopLinks.map((link) => (
                <li key={`${link.to}-${link.name}`}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {isLoggedIn ? (
              <>
                <Link to="/profile/" className={profileLinkClass} aria-label={t("nav.profile")} title={t("nav.profile")}>
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
        </div>
      </nav>

      {/*
        Outside the nav so overflow clipping / wide page content cannot hide them.
        Fixed to the real phone viewport top-right corner.
      */}
      <div className="app-shell-mobile-actions lg:hidden">
        {isLoggedIn ? (
          <Link
            to="/profile/"
            onClick={() => setOpen(false)}
            className={profileLinkClass}
            aria-label={t("nav.profile")}
            title={t("nav.profile")}
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
          className="app-shell-menu-btn inline-flex items-center justify-center rounded-xl border border-[rgba(111,49,29,0.18)] bg-[rgba(255,252,247,0.98)] text-[var(--oman-ink)] shadow-sm transition hover:bg-[rgba(197,154,68,0.14)]"
          aria-expanded={open}
          aria-controls="app-mobile-menu"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        >
          <span className="sr-only">{open ? t("nav.closeMenu") : t("nav.openMenu")}</span>
          <span aria-hidden="true" className="relative block h-4 w-5">
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

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[110] bg-black/25 lg:hidden"
            aria-label={t("nav.closeMenu")}
            onClick={() => setOpen(false)}
          />
          <div
            id="app-mobile-menu"
            className="app-shell-mobile-menu fixed inset-x-0 z-[115] max-h-[min(75vh,calc(100dvh-4.5rem))] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain border-b border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.99)] px-3 py-4 shadow-md sm:px-4 lg:hidden"
            style={{ top: "max(4.25rem, calc(env(safe-area-inset-top, 0px) + 3.75rem))" }}
          >
            {isLoggedIn ? (
              <div className="mb-3 rounded-2xl border border-[rgba(197,154,68,0.22)] bg-[rgba(197,154,68,0.1)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                  {getVisibleRoleLabel(role, t)}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-[var(--oman-ink)]">
                  {profile?.full_name || user?.email || t("nav.profile")}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              {mobileLinks.map((link) => (
                <NavLink
                  key={`${link.to}-${link.name}`}
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

              {isLoggedIn ? (
                <Button type="button" variant="secondary" fullWidth className="mt-2" onClick={handleLogout}>
                  {t("nav.logout")}
                </Button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      <Outlet />
    </>
  );
}
