import ProtectedRoute from "./ProtectedRoute";

/**
 * AdminRoutes
 * All children require: authenticated + role === "admin"
 * Any non-admin hitting /admin/* → redirected to their own dashboard
 */
const AdminRoutes = () => <ProtectedRoute allowedRoles={["admin"]} />;

export default AdminRoutes;
