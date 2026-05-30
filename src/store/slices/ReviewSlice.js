import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchMyReviews = createAsyncThunk(
  "reviews/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reviews/my");
      return data.reviews;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reviews", payload);
      return data.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit review");
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/update",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/reviews/${id}`, updates);
      return data.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete review");
    }
  }
);

export const fetchFeaturedReviews = createAsyncThunk(
  "reviews/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reviews/featured");
      return data.reviews;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    myReviews: [],
    featured: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviewError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // fetchMy
      .addCase(fetchMyReviews.pending, pending)
      .addCase(fetchMyReviews.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myReviews = payload;
      })
      .addCase(fetchMyReviews.rejected, rejected)

      // create
      .addCase(createReview.pending, pending)
      .addCase(createReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myReviews.unshift(payload);
      })
      .addCase(createReview.rejected, rejected)

      // update
      .addCase(updateReview.pending, pending)
      .addCase(updateReview.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.myReviews.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.myReviews[idx] = payload;
      })
      .addCase(updateReview.rejected, rejected)

      // delete
      .addCase(deleteReview.pending, pending)
      .addCase(deleteReview.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.myReviews = state.myReviews.filter((r) => r._id !== id);
      })
      .addCase(deleteReview.rejected, rejected)

      // featured
      .addCase(fetchFeaturedReviews.pending, pending)
      .addCase(fetchFeaturedReviews.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.featured = payload;
      })
      .addCase(fetchFeaturedReviews.rejected, rejected);
  },
});

export const { clearReviewError } = reviewsSlice.actions;

// Selectors
export const selectFeatured      = (s) => s.reviews?.featured ?? [];
export const selectMyReviews     = (s) => s.reviews?.myReviews ?? [];
export const selectReviewLoading = (s) => s.reviews?.loading ?? false;
export const selectReviewError   = (s) => s.reviews?.error ?? null;

export default reviewsSlice.reducer;