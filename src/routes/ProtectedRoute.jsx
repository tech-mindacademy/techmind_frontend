// ProtectedRoute.jsx
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);
  const isInitialized   = useSelector(selectIsInitialized);
  const location        = useLocation();

  if (!isInitialized) return <PageLoader />;

  // ✅ Guard against isAuthenticated=true but user not yet hydrated
  if (!isAuthenticated || !role) {
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