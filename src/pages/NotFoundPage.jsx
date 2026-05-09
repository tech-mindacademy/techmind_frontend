import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUserRole, selectIsAuthenticated } from "../store/slices/authSlice";
import { ROLE_DASHBOARDS } from "../routes/ProtectedRoute";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-8xl font-bold text-indigo-100 dark:text-indigo-900 mb-4 select-none">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
        >
          Go home
        </Link>
      </motion.div>
    </div>
  );
}

export function UnauthorizedPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const dashboard = ROLE_DASHBOARDS[role] || "/";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2M12 9H10m9.172 10.172A9 9 0 116.828 6.828 9 9 0 0121 19.172z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Access denied</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          You don't have permission to view this page.
        </p>
        {isAuthenticated ? (
          <Link
            to={dashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
          >
            Go to my dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
          >
            Sign in
          </Link>
        )}
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
