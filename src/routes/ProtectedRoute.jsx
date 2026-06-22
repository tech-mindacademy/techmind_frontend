import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsInitialized,
} from "../store/slices/authSlice";
import PageLoader from "../components/PageLoader";

export const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  creator: "/creator/dashboard",
  admin: "/admin/dashboard",
};

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);
  const isInitialized   = useSelector(selectIsInitialized);
  const location        = useLocation();

  // ⏳ Wait for bootstrapAuth to finish before deciding anything
  if (!isInitialized) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const ownDashboard = ROLE_DASHBOARDS[role] || "/";
    return <Navigate to={ownDashboard} replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export default ProtectedRoute;