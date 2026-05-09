import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsInitialized,
} from "../store/slices/authSlice";
import { ROLE_DASHBOARDS } from "./ProtectedRoute";

const SessionLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

/**
 * PublicRoute
 * Pages like /login, /register, /forgot-password
 * If already authenticated → redirect to own dashboard
 * If not authenticated → render normally
 */
const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) return <SessionLoader />;

  if (isAuthenticated) {
    const dashboard = ROLE_DASHBOARDS[role] || "/";
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
