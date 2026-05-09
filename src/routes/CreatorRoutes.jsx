import ProtectedRoute from "./ProtectedRoute";

/**
 * CreatorRoutes
 * All children require: authenticated + role === "creator"
 * A student or admin hitting /creator/* → redirected to their own dashboard
 */
const CreatorRoutes = () => <ProtectedRoute allowedRoles={["creator"]} />;

export default CreatorRoutes;
