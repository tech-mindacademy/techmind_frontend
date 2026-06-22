import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../store/slices/authSlice";

export const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  creator: "/creator/dashboard",
  admin: "/admin/dashboard",
};

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const location = useLocation();

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