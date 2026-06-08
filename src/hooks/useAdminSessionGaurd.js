import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../store/slices/authSlice";

const ADMIN_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const useAdminSessionGuard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const timerRef = useRef(null);

  useEffect(() => {
    // Only applies to admins
    if (user?.role !== "admin") return;

    const isAdminPage = location.pathname.startsWith("/admin");

    if (isAdminPage) {
      // ── Admin returned to /admin/* — cancel the countdown ──────────────────
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // ── Admin left /admin/* — start 5min countdown ─────────────────────────
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          dispatch(logoutUser());
        }, ADMIN_TIMEOUT_MS);
      }
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [location.pathname, user?.role]);
};