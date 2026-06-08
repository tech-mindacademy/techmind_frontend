import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsInitialized,
  selectUser,  // ← add this
} from "../store/slices/authSlice";

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

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const isInitialized = useSelector(selectIsInitialized);
  const user = useSelector(selectUser);  // ← add this
  const location = useLocation();

  // Wait for session restoration AND user object to be populated
  if (!isInitialized || (isAuthenticated && !user)) {  // ← add user check
    return <SessionLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const ownDashboard = ROLE_DASHBOARDS[role] || "/";
    return <Navigate to={ownDashboard} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;