import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import { fetchMyTrainingAccess } from "../api/services/industrialTraining.service";
import PageLoader from "../components/PageLoader";

// UX gate only. Every backend endpoint re-checks access on each request.
export default function TrainingRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [status, setStatus] = useState("loading");
  const [access, setAccess] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    fetchMyTrainingAccess()
      .then(({ access: list }) => {
        if (cancelled) return;
        setAccess(list || []);
        setStatus(list?.some((a) => a.canJoinPortal) ? "eligible" : "ineligible");
      })
      .catch(() => !cancelled && setStatus("ineligible"));
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  if (status === "loading") return <PageLoader />;

  if (status === "ineligible") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Industrial Training Portal access
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Portal access is emailed after your application is reviewed and the training fee is paid.
        </p>
        <Link
          to="/industrial-training"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition"
        >
          View Industrial Training
        </Link>
      </div>
    );
  }

  return <Outlet context={{ access }} />;
}
