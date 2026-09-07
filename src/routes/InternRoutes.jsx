import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import { fetchMyInternshipAccess } from "../api/services/internship.service.js";
import PageLoader from "../components/PageLoader";

/**
 * Gates every /intern/* route.
 *
 * This is a UX convenience only — it decides what to SHOW. It is not the
 * security boundary; every backend endpoint under /api/live-classes and
 * /api/internships/my-access re-checks eligibility server-side on every
 * request regardless of what this component renders.
 */
export default function InternRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // loading | eligible | ineligible
  const [access, setAccess] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus("unauth");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { access: list } = await fetchMyInternshipAccess();
        if (cancelled) return;
        setAccess(list || []);
        const eligible = (list || []).some((a) => a.canJoinPortal);
        setStatus(eligible ? "eligible" : "ineligible");
      } catch {
        if (!cancelled) setStatus("ineligible");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location, intent: "intern-portal" }}
        replace
      />
    );
  }

  if (status === "loading") return <PageLoader />;

  if (status === "ineligible") {
    return <NoInternAccess access={access} />;
  }

  return <Outlet context={{ access }} />;
}

function NoInternAccess({ access }) {
  const pendingPayment = access.find(
    (a) =>
      a.status === "shortlisted" &&
      a.requiresPayment &&
      a.paymentStatus !== "paid"
  );

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No Internship Portal Access Yet
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
        {pendingPayment
          ? "You're shortlisted, but payment is still pending. Complete it to unlock your Internship Portal."
          : "Apply to an internship and get shortlisted to unlock your personal Internship Portal with live classes."}
      </p>
      <Link
        to="/internships"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition"
      >
        Browse Internships
      </Link>
    </div>
  );
}