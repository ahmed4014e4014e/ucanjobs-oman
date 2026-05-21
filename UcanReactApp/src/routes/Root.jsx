import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getDashboardPath, getUserRole } from "../lib/authRouting";

function LanguageToggle({ compact = false }) {
  const { isArabic, t, toggleLanguage } = useLanguage();
  const label = isArabic ? t("language.switchToEnglish") : t("language.switchToArabic");

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={[
        "inline-flex items-center justify-center rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,252,247,0.86)] font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(197,154,68,0.12)]",
        compact ? "px-4 py-3 text-base" : "px-3 py-2 text-sm",
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {isArabic ? "EN" : "عربي"}
    </button>
  );
}

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const role = getUserRole(profile, user);

  const baseLinks = [
    { name: t("nav.home"), to: "/home/" },
    { name: t("nav.about"), to: "/about/" },
    { name: t("nav.services"), to: "/courses/" },
    { name: t("nav.contact"), to: "/contact/" },
    { name: t("nav.policies"), to: "/terms/" },
  ];
  const guestLinks = [
    { name: t("nav.studentAccess"), to: "/student-access/" },
    { name: t("nav.tutorAccess"), to: "/tutor-access/" },
    { name: t("nav.adminAccess"), to: "/admin-access/" },
  ];
  const memberLinks = [{ name: t("nav.dashboard"), to: getDashboardPath(role) }];
  const adminLinks = role === "admin" ? [{ name: t("nav.adminDashboard"), to: "/admin-dashboard/" }] : [];
  const links = [...baseLinks, ...guestLinks, ...(user ? memberLinks : []), ...adminLinks];

  const navLinkClass = ({ isActive }) =>
    [
      "transition duration-200",
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

  return (
    <>
      <ScrollToTopOnRouteChange />
      {logoutMessage && (
        <ActionFeedback
          type="success"
          message={logoutMessage}
          title={t("feedback.sessionUpdate")}
          className="fixed left-1/2 top-20 z-[80] w-[min(92vw,32rem)] -translate-x-1/2 rounded-2xl px-5 py-4 shadow-lg backdrop-blur"
        />
      )}
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.88)] shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--oman-terracotta)] sm:text-xs">
              {t("brand.kicker")}
            </p>
            <h1 className="text-lg font-bold text-[var(--oman-ink)] sm:text-2xl">{t("brand.name")}</h1>
          </div>

          <div className="hidden items-center gap-4 lg:flex xl:gap-6">
            {user && (
              <div className="rounded-full border border-[rgba(197,154,68,0.24)] bg-[rgba(197,154,68,0.12)] px-4 py-2 text-sm font-medium capitalize text-[var(--oman-terracotta-dark)]">
                {profile?.role || t("roles.member")}
              </div>
            )}

            <ul className="flex items-center gap-5 text-base xl:gap-8 xl:text-lg">
              {links.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.to} className={navLinkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {!loading && user && (
              <button
                type="button"
                onClick={handleLogout}
                className="oman-button-secondary rounded-2xl px-4 py-2 text-sm font-semibold transition"
              >
                {t("nav.logout")}
              </button>
            )}
            <LanguageToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
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

        {open && (
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-[rgba(111,49,29,0.12)] bg-[rgba(255,248,238,0.96)] px-4 py-4 shadow-md lg:hidden">
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

              {!loading && user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="oman-button-secondary rounded-2xl px-4 py-3 text-base font-medium transition"
                >
                  {t("nav.logout")}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
}
