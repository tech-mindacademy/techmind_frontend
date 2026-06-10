import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as assignmentService from "../../api/services/assignment.service";
import { resetUserState } from "../actions";

export const loadAssignment = createAsyncThunk(
  "assignment/load",
  async (assignmentId, { rejectWithValue }) => {
    try {
      return await assignmentService.getAssignment(assignmentId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load assignment");
    }
  }
);

export const loadAssignmentByLesson = createAsyncThunk(
  "assignment/loadByLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      return await assignmentService.getAssignmentByLesson(lessonId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "No assignment for this lesson");
    }
  }
);

export const submitAssignmentThunk = createAsyncThunk(
  "assignment/submit",
  async ({ assignmentId, formData, onProgress }, { rejectWithValue }) => {
    try {
      return await assignmentService.submitAssignment(assignmentId, formData, onProgress);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Submission failed");
    }
  }
);

export const loadSubmissions = createAsyncThunk(
  "assignment/loadSubmissions",
  async (assignmentId, { rejectWithValue }) => {
    try {
      return await assignmentService.getAllSubmissions(assignmentId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load submissions");
    }
  }
);

export const gradeSubmissionThunk = createAsyncThunk(
  "assignment/grade",
  async ({ assignmentId, submissionId, grade, feedback }, { rejectWithValue }) => {
    try {
      return await assignmentService.gradeSubmission(assignmentId, submissionId, {
        grade,
        feedback,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Grading failed");
    }
  }
);

export const requestResubmitThunk = createAsyncThunk(
  "assignment/requestResubmit",
  async ({ assignmentId, submissionId, feedback }, { rejectWithValue }) => {
    try {
      return await assignmentService.requestResubmit(assignmentId, submissionId, { feedback });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

const initialState = {
  current: null,
  mySubmission: null,
  allSubmissions: [],
  submissionStats: null,
  uploadProgress: 0,
  isLoading: false,
  isSubmitting: false,
  isGrading: false,
  error: null,
  successMessage: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    setUploadProgress: (state, action) => { state.uploadProgress = action.payload; },
    clearAssignmentError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload.assignment;
        state.mySubmission = action.payload.assignment.mySubmission || null;
      })
      .addCase(loadAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(loadAssignmentByLesson.fulfilled, (state, action) => {
        state.current = action.payload.assignment;
        state.mySubmission = action.payload.assignment.mySubmission || null;
      })

      .addCase(submitAssignmentThunk.pending, (state) => {
        state.isSubmitting = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(submitAssignmentThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.uploadProgress = 100;
        state.mySubmission = action.payload.submission;
        state.successMessage = action.payload.message;
      })
      .addCase(submitAssignmentThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      .addCase(loadSubmissions.pending, (state) => { state.isLoading = true; })
      .addCase(loadSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allSubmissions = action.payload.submissions;
        state.submissionStats = action.payload.stats;
        state.current = action.payload.assignment;
      })

      .addCase(gradeSubmissionThunk.pending, (state) => { state.isGrading = true; })
      .addCase(gradeSubmissionThunk.fulfilled, (state, action) => {
        state.isGrading = false;
        const updated = action.payload.submission;
        const idx = state.allSubmissions.findIndex((s) => s._id === updated._id);
        if (idx !== -1) state.allSubmissions[idx] = updated;
        state.successMessage = "Submission graded.";
      })
      .addCase(gradeSubmissionThunk.rejected, (state, action) => {
        state.isGrading = false;
        state.error = action.payload;
      })

      .addCase(requestResubmitThunk.fulfilled, (state, action) => {
        const updated = action.payload.submission;
        const idx = state.allSubmissions.findIndex((s) => s._id === updated._id);
        if (idx !== -1) state.allSubmissions[idx] = updated;
        state.successMessage = "Resubmission requested.";
      })

      // Reset all assignment state on logout / user switch
      .addCase(resetUserState, () => initialState);
  },
});

export const { setUploadProgress, clearAssignmentError, clearSuccess } =
  assignmentSlice.actions;

export const selectCurrentAssignment  = (s) => s.assignment.current;
export const selectMySubmission       = (s) => s.assignment.mySubmission;
export const selectAllSubmissions     = (s) => s.assignment.allSubmissions;
export const selectSubmissionStats    = (s) => s.assignment.submissionStats;
export const selectUploadProgress     = (s) => s.assignment.uploadProgress;
export const selectAssignmentLoading  = (s) => s.assignment.isLoading;
export const selectAssignmentSubmitting = (s) => s.assignment.isSubmitting;
export const selectAssignmentGrading  = (s) => s.assignment.isGrading;
export const selectAssignmentError    = (s) => s.assignment.error;

export default assignmentSlice.reducer;