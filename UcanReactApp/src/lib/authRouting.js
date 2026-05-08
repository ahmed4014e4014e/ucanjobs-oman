export function getUserRole(profile, _user, fallbackRole = null) {
  return profile?.role ?? fallbackRole;
}

export function getDashboardPath(role) {
  if (role === "admin") {
    return "/admin-dashboard/";
  }

  if (role === "tutor") {
    return "/tutor-dashboard/";
  }

  return "/student-dashboard/";
}
