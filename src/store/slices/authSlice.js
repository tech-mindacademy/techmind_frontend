import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/refresh-token");
      return data;
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      // ─── _isBootstrap flag tells the axios interceptor to leave this
      //     request alone — no auto-retry, no redirect on 401.
      //     Without this, a 401 here triggers another refresh attempt
      //     which fails and wipes the cookie via the logout redirect.
      const { data } = await api.get("/auth/me", { _isBootstrap: true });
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

// ─── Bootstrap: runs once on app mount to restore session from cookie ─────────
export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Step 1: exchange the httpOnly refresh cookie for a new access token
      const refreshResult = await dispatch(refreshAccessToken());
      if (refreshAccessToken.rejected.match(refreshResult)) {
        return rejectWithValue("No active session");
      }

      // Step 2: load the user profile using the new access token.
      // fetchCurrentUser uses _isBootstrap:true so a 401 here doesn't
      // trigger the interceptor's auto-refresh loop.
      const meResult = await dispatch(fetchCurrentUser());
      if (fetchCurrentUser.rejected.match(meResult)) {
        return rejectWithValue("Could not load user profile");
      }

      return true;
    } catch (err) {
      return rejectWithValue("Bootstrap failed");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Register ──────────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Login ─────────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload;
      });

    // ── Logout ────────────────────────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // isInitialized stays true — we know the state (logged out)
    });

    // ── Refresh token ─────────────────────────────────────────────────────────
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true; // ← was commented out before, causing stuck state
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      });

    // ── Fetch current user ────────────────────────────────────────────────────
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isInitialized = true;
      });

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    // Real state updates happen inside refreshAccessToken + fetchCurrentUser.
    // This just guarantees isInitialized=true if the whole thing blows up.
    builder.addCase(bootstrapAuth.rejected, (state) => {
      state.isInitialized = true;
    });
  },
});

export const { setAccessToken, clearAuth, clearError } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser            = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole        = (state) => state.auth.user?.role;
export const selectAccessToken     = (state) => state.auth.accessToken;
export const selectAuthLoading     = (state) => state.auth.isLoading;
export const selectAuthError       = (state) => state.auth.error;
export const selectIsInitialized   = (state) => state.auth.isInitialized;

export default authSlice.reducer;