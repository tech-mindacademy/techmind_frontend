import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsInitialized,
} from "../store/slices/authSlice";
import { ROLE_DASHBOARDS } from "./ProtectedRoute";
import PageLoader from "../components/PageLoader";

const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);
  const isInitialized   = useSelector(selectIsInitialized);

  // ⏳ Wait for bootstrapAuth to finish before deciding anything
  if (!isInitialized) return <PageLoader />;

  if (isAuthenticated) {
    const dashboard = ROLE_DASHBOARDS[role] || "/";
    return <Navigate to={dashboard} replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export default PublicRoute;