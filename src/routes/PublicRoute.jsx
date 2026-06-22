import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../store/slices/authSlice";
import { ROLE_DASHBOARDS } from "./ProtectedRoute";
import PageLoader from "../components/PageLoader";

const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

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