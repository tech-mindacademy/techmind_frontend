// hooks/useAdminSessionGuard.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, selectUser } from "../store/slices/authSlice";
import api from "../api/axios";

const ADMIN_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const useAdminSessionGuard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const forceLogout = async () => {
    try {
      // Fire and forget — we don't care if this fails
      // Just needs to clear the httpOnly cookie on the backend
      await api.post("/auth/logout");
    } catch (_) {
      // Ignore errors — cookie may already be expired/invalid
    } finally {
      // Always clear Redux state and redirect regardless of API result
      dispatch(clearAuth());
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      clearTimer();
      return;
    }

    const isAdminPage = location.pathname.startsWith("/admin");

    if (isAdminPage) {
      clearTimer();
    } else {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          forceLogout();
        }, ADMIN_TIMEOUT_MS);
      }
    }
  }, [location.pathname, user?.role]);

  useEffect(() => {
    return () => clearTimer();
  }, []);
};