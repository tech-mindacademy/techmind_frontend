import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminService from "../../api/services/admin.service";
import { resetUserState } from "../actions";

export const fetchPlatformStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try { return await adminService.fetchPlatformStats(); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const fetchRevenueChart = createAsyncThunk(
  "admin/fetchRevenueChart",
  async (_, { rejectWithValue }) => {
    try { return await adminService.fetchRevenueChart(); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params, { rejectWithValue }) => {
    try { return await adminService.fetchUsers(params); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const fetchCreatorRequests = createAsyncThunk(
  "admin/fetchCreatorRequests",
  async (status, { rejectWithValue }) => {
    try { return await adminService.fetchCreatorRequests(status); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const approveCreator = createAsyncThunk(
  "admin/approveCreator",
  async (userId, { rejectWithValue }) => {
    try { return await adminService.approveCreator(userId); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const rejectCreator = createAsyncThunk(
  "admin/rejectCreator",
  async (userId, { rejectWithValue }) => {
    try { return await adminService.rejectCreator(userId); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const toggleUserActive = createAsyncThunk(
  "admin/toggleUserActive",
  async (userId, { rejectWithValue }) => {
    try { return await adminService.toggleUserActive(userId); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const changeUserRole = createAsyncThunk(
  "admin/changeUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try { return await adminService.changeUserRole(userId, role); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

export const applyForCreator = createAsyncThunk(
  "admin/applyForCreator",
  async (_, { rejectWithValue }) => {
    try { return await adminService.applyForCreator(); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed"); }
  }
);

const initialState = {
  stats: null,
  revenueChart: [],
  users: [],
  usersPagination: null,
  creatorRequests: [],
  isLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => { state.error = null; },
    clearAdminSuccess: (state) => { state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformStats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPlatformStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchPlatformStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchRevenueChart.fulfilled, (state, action) => {
        state.revenueChart = action.payload.chart;
      })

      .addCase(fetchUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })

      .addCase(fetchCreatorRequests.fulfilled, (state, action) => {
        state.creatorRequests = action.payload.users;
      })

      .addCase(approveCreator.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.creatorRequests = state.creatorRequests.filter(
          (u) => u._id !== action.meta.arg
        );
      })

      .addCase(rejectCreator.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.creatorRequests = state.creatorRequests.filter(
          (u) => u._id !== action.meta.arg
        );
      })

      .addCase(toggleUserActive.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })

      .addCase(changeUserRole.fulfilled, (state, action) => {
        const updated = action.payload.user;
        const idx = state.users.findIndex((u) => u._id === updated._id);
        if (idx !== -1) state.users[idx] = updated;
        state.successMessage = "Role updated.";
      })

      .addCase(applyForCreator.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      .addCase(applyForCreator.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Reset admin state on logout / user switch
      .addCase(resetUserState, () => initialState);
  },
});

export const { clearAdminError, clearAdminSuccess } = adminSlice.actions;

export const selectPlatformStats    = (s) => s.admin.stats;
export const selectRevenueChart     = (s) => s.admin.revenueChart;
export const selectAdminUsers       = (s) => s.admin.users;
export const selectUsersPagination  = (s) => s.admin.usersPagination;
export const selectCreatorRequests  = (s) => s.admin.creatorRequests;
export const selectAdminLoading     = (s) => s.admin.isLoading;
export const selectAdminError       = (s) => s.admin.error;
export const selectAdminSuccess     = (s) => s.admin.successMessage;

export default adminSlice.reducer;