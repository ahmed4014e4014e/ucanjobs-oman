import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath, getUserRole } from "../lib/authRouting";

export default function Account() {
  const { user, profile } = useAuth();
  const role = getUserRole(profile, user, "student");

  return <Navigate to={getDashboardPath(role)} replace />;
}
