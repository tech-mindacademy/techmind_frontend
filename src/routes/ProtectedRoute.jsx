import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsInitialized,
} from "../store/slices/authSlice";

// Role to default dashboard mapping
export const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  creator: "/creator/dashboard",
  admin: "/admin/dashboard",
};

const SessionLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Restoring your session...</p>
    </div>
  </div>
);

/**
 * ProtectedRoute
 * - allowedRoles: string[] — if provided, only these roles can access
 * - If not authenticated → redirect to /login (saves intended URL)
 * - If wrong role → redirect to that user's own dashboard
 * - If session not yet initialized → show spinner
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const isInitialized = useSelector(selectIsInitialized);
  const location = useLocation();

  // Wait for session restoration before deciding
  if (!isInitialized) {
    return <SessionLoader />;
  }

  // Not logged in → go to login, remember where they wanted to go
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role check: if allowedRoles specified and user's role not in list
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const ownDashboard = ROLE_DASHBOARDS[role] || "/";
    return <Navigate to={ownDashboard} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
