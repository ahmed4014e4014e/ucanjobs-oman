export function getUserRole(profile, user, fallbackRole = null) {
  const role =
    profile?.role ??
    user?.user_metadata?.role ??
    user?.app_metadata?.role ??
    fallbackRole;

  if (role === "student") {
    return "learner";
  }

  if (role === "tutor") {
    return "instructor";
  }

  return role;
}

export function getDashboardPath(role) {
  if (role === "admin") {
    return "/admin-dashboard/";
  }

  if (role === "instructor" || role === "tutor") {
    return "/instructor-dashboard/";
  }

  return "/learner-dashboard/";
}
