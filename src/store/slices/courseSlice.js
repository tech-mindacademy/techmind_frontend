import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as courseService from "../../api/services/course.service";
import { resetUserState } from "../store";

export const fetchCourses = createAsyncThunk(
  "course/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await courseService.fetchCourses(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load courses");
    }
  }
);

export const fetchCourseBySlug = createAsyncThunk(
  "course/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      return await courseService.fetchCourseBySlug(slug);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Course not found");
    }
  }
);

export const fetchMyEnrollments = createAsyncThunk(
  "course/fetchMyEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      return await courseService.fetchMyEnrollments();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load enrollments");
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  "course/enroll",
  async (courseId, { rejectWithValue }) => {
    try {
      return await courseService.enrollFree(courseId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Enrollment failed");
    }
  }
);

export const completeLessonThunk = createAsyncThunk(
  "course/completeLesson",
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      return await courseService.markLessonComplete(courseId, lessonId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchMyCoursesCreator = createAsyncThunk(
  "course/fetchMyCreator",
  async (_, { rejectWithValue }) => {
    try {
      return await courseService.fetchMyCoursesCreator();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

const initialState = {
  courses: [],
  pagination: null,
  currentCourse: null,
  isEnrolled: false,
  progress: null,
  myEnrollments: [],
  myCreatorCourses: [],
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.isEnrolled = false;
      state.progress = null;
    },
    updateProgress: (state, action) => {
      if (state.progress) {
        state.progress.progressPercent = action.payload.progressPercent;
        state.progress.isCompleted = action.payload.isCompleted;
      }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCourseBySlug.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload.course;
        state.isEnrolled = action.payload.isEnrolled;
        state.progress = action.payload.progress;
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.myEnrollments = action.payload.enrollments;
      })

      .addCase(enrollInCourse.fulfilled, (state) => {
        state.isEnrolled = true;
      })

      .addCase(completeLessonThunk.fulfilled, (state, action) => {
        if (state.progress) {
          state.progress.progressPercent = action.payload.progressPercent;
          state.progress.isCompleted = action.payload.isCompleted;
        }
      })

      .addCase(fetchMyCoursesCreator.fulfilled, (state, action) => {
        state.myCreatorCourses = action.payload.courses;
      })

      // Reset all user-specific course state on logout / user switch
      .addCase(resetUserState, () => initialState);
  },
});

export const { clearCurrentCourse, updateProgress, clearError } = courseSlice.actions;

export const selectCourses          = (s) => s.course.courses;
export const selectPagination       = (s) => s.course.pagination;
export const selectCurrentCourse    = (s) => s.course.currentCourse;
export const selectIsEnrolled       = (s) => s.course.isEnrolled;
export const selectProgress         = (s) => s.course.progress;
export const selectMyEnrollments    = (s) => s.course.myEnrollments;
export const selectMyCreatorCourses = (s) => s.course.myCreatorCourses;
export const selectCourseLoading    = (s) => s.course.isLoading;

export default courseSlice.reducer;