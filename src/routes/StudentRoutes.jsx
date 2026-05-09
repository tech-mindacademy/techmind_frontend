import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

/**
 * StudentRoutes
 * All children require: authenticated + role === "student"
 * A creator or admin hitting /student/* → redirected to their own dashboard
 */
const StudentRoutes = () => <ProtectedRoute allowedRoles={["student"]} />;

export default StudentRoutes;
