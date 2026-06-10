import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { resetUserState } from "../store";

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
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(resetUserState()); // clear previous user's data
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      dispatch(resetUserState()); // wipe all slices
    } catch (err) {
      dispatch(resetUserState()); // wipe even if API call fails
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
      const { data } = await api.get("/auth/me", { _isBootstrap: true });
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const refreshResult = await dispatch(refreshAccessToken());
      if (refreshAccessToken.rejected.match(refreshResult)) {
        return rejectWithValue("No active session");
      }
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
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
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

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });

    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      });

    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isInitialized = true;
      });

    builder.addCase(bootstrapAuth.rejected, (state) => {
      state.isInitialized = true;
    });
  },
});

export const { setAccessToken, clearAuth, clearError, updateUser } = authSlice.actions;

export const selectUser            = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole        = (state) => state.auth.user?.role;
export const selectAccessToken     = (state) => state.auth.accessToken;
export const selectAuthLoading     = (state) => state.auth.isLoading;
export const selectAuthError       = (state) => state.auth.error;
export const selectIsInitialized   = (state) => state.auth.isInitialized;

export default authSlice.reducer;