import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
  selectAccessToken,
  loginUser,
  logoutUser,
  registerUser,
  clearError,
} from "../store/slices/authSlice";
import { ROLE_DASHBOARDS } from "../routes/ProtectedRoute";
import toast from "react-hot-toast";

/**
 * useAuth — single hook for all auth operations throughout the app
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user          = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role          = useSelector(selectUserRole);
  const isLoading     = useSelector(selectAuthLoading);
  const error         = useSelector(selectAuthError);
  const isInitialized = useSelector(selectIsInitialized);
  const accessToken   = useSelector(selectAccessToken);

  // Role helpers
  const isStudent = role === "student";
  const isCreator = role === "creator";
  const isAdmin   = role === "admin";

  const login = async (credentials, intendedPath = null) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      const destination =
        intendedPath || ROLE_DASHBOARDS[result.payload.user.role] || "/";
      navigate(destination, { replace: true });
      return true;
    } else {
      toast.error(result.payload || "Login failed");
      return false;
    }
  };

  const register = async (formData) => {
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Check your email to verify.");
      navigate("/auth");
      return true;
    } else {
      toast.error(result.payload || "Registration failed");
      return false;
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/auth", { replace: true });
  };

  const dismissError = () => dispatch(clearError());

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    accessToken,
    isStudent,
    isCreator,
    isAdmin,
    login,
    register,
    logout,
    dismissError,
  };
};

export default useAuth;
