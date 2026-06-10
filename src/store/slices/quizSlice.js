import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as quizService from "../../api/services/quiz.service";
import { resetUserState } from "../actions";

export const startAttempt = createAsyncThunk(
  "quiz/startAttempt",
  async (quizId, { rejectWithValue }) => {
    try {
      return await quizService.startQuizAttempt(quizId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start quiz");
    }
  }
);

export const submitAttempt = createAsyncThunk(
  "quiz/submitAttempt",
  async ({ quizId, payload }, { rejectWithValue }) => {
    try {
      return await quizService.submitQuizAttempt(quizId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit quiz");
    }
  }
);

export const loadMyAttempts = createAsyncThunk(
  "quiz/loadMyAttempts",
  async (quizId, { rejectWithValue }) => {
    try {
      return await quizService.getMyAttempts(quizId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load attempts");
    }
  }
);

export const loadQuiz = createAsyncThunk(
  "quiz/loadQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      return await quizService.getQuiz(quizId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load quiz");
    }
  }
);

const initialState = {
  activeAttempt: null,
  result: null,
  resultQuestions: null,
  myAttempts: [],
  attemptsInfo: null,
  currentQuiz: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer: (state, action) => {
      const { questionId, selectedOptions, textAnswer, questionType } = action.payload;
      if (!state.activeAttempt) return;
      const existing = state.activeAttempt.answers?.find(
        (a) => a.questionId === questionId
      );
      if (existing) {
        if (questionType === "short_answer") {
          existing.textAnswer = textAnswer;
        } else {
          existing.selectedOptions = selectedOptions;
        }
      } else {
        if (!state.activeAttempt.answers) state.activeAttempt.answers = [];
        state.activeAttempt.answers.push({
          questionId,
          selectedOptions: selectedOptions || [],
          textAnswer: textAnswer || "",
        });
      }
    },
    clearActiveAttempt: (state) => { state.activeAttempt = null; },
    clearResult: (state) => {
      state.result = null;
      state.resultQuestions = null;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startAttempt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(startAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeAttempt = {
          ...action.payload.attempt,
          questions: action.payload.questions,
          timeLimit: action.payload.timeLimit,
          answers: [],
        };
      })
      .addCase(startAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(submitAttempt.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitAttempt.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.activeAttempt = null;
        state.result = action.payload.result;
        state.resultQuestions = action.payload.questions;
      })
      .addCase(submitAttempt.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      .addCase(loadMyAttempts.fulfilled, (state, action) => {
        state.myAttempts = action.payload.attempts;
        state.attemptsInfo = {
          attemptsUsed: action.payload.attemptsUsed,
          attemptsRemaining: action.payload.attemptsRemaining,
          hasPassed: action.payload.hasPassed,
          bestScore: action.payload.bestScore,
          quiz: action.payload.quiz,
        };
      })

      .addCase(loadQuiz.fulfilled, (state, action) => {
        state.currentQuiz = action.payload.quiz;
      })

      // Reset all quiz state on logout / user switch
      .addCase(resetUserState, () => initialState);
  },
});

export const { selectAnswer, clearActiveAttempt, clearResult, clearError } =
  quizSlice.actions;

export const selectActiveAttempt  = (s) => s.quiz.activeAttempt;
export const selectQuizResult     = (s) => s.quiz.result;
export const selectResultQuestions = (s) => s.quiz.resultQuestions;
export const selectMyAttempts     = (s) => s.quiz.myAttempts;
export const selectAttemptsInfo   = (s) => s.quiz.attemptsInfo;
export const selectCurrentQuiz    = (s) => s.quiz.currentQuiz;
export const selectQuizLoading    = (s) => s.quiz.isLoading;
export const selectQuizSubmitting = (s) => s.quiz.isSubmitting;
export const selectQuizError      = (s) => s.quiz.error;

export default quizSlice.reducer;