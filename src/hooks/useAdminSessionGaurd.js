// hooks/useAdminSessionGuard.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, selectUser } from "../store/slices/authSlice";
import api from "../api/axios";

const ADMIN_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// All fully public routes (not protected by any role)
const PUBLIC_ROUTES = [
  "/",
  "/techmind-courses",
  "/about",
  "/contact",
  "/internships",
  "/services",
  "/certificate-purchase",
  "/refund",
  "/privacy",
  "/unauthorized",
];

// Prefix-based public routes (dynamic segments)
const PUBLIC_PREFIXES = [
  "/verify-email/",
  "/forgot-password",
  "/reset-password/",
  "/auth",
];

const isPublicRoute = (pathname) => {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return false;
};

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
      await api.post("/auth/logout");
    } catch (_) {}
    finally {
      dispatch(clearAuth());
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      clearTimer();
      return;
    }

    const isAdminPage = location.pathname.startsWith("/admin");

    if (isAdminPage) {
      // Back on admin pages — cancel countdown
      clearTimer();
    } else if (isPublicRoute(location.pathname)) {
      // On a public route — start countdown if not already running
      if (!timerRef.current) {
        timerRef.current = setTimeout(forceLogout, ADMIN_TIMEOUT_MS);
      }
    }
    // Protected role routes (/student/*, /creator/*) — do nothing, let existing timer run or not
  }, [location.pathname, user?.role]);

  useEffect(() => {
    return () => clearTimer();
  }, []);
};