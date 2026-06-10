import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { resetUserState } from "../actions";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async ({ page = 1, tag } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page });
      if (tag) params.append("tag", tag);
      const { data } = await api.get(`/blogs?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blogs");
    }
  }
);

export const fetchBlog = createAsyncThunk(
  "blogs/fetchOne",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs/${slug}`);
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Blog not found");
    }
  }
);

export const fetchAllBlogsAdmin = createAsyncThunk(
  "blogs/adminAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/blogs/admin/all");
      return data.blogs;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/blogs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const initialState = {
  blogs: [],
  currentBlog: null,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearCurrentBlog: (state) => { state.currentBlog = null; },
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.isLoading = true;  state.error = null; };
    const failed  = (state, action) => { state.isLoading = false; state.error = action.payload; };

    builder
      .addCase(fetchBlogs.pending, loading)
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBlogs.rejected, failed)

      .addCase(fetchBlog.pending, loading)
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlog.rejected, failed)

      .addCase(fetchAllBlogsAdmin.pending, loading)
      .addCase(fetchAllBlogsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogsAdmin.rejected, failed)

      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const idx = state.blogs.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.blogs[idx] = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
      })

      // Blogs are public content — only clear currentBlog on user switch,
      // keep the public blog list intact
      .addCase(resetUserState, (state) => {
        state.currentBlog = null;
        state.error = null;
      });
  },
});

export const { clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;