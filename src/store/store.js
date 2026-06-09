import { configureStore } from "@reduxjs/toolkit";
import authReducer       from "./slices/authSlice";
import courseReducer     from "./slices/courseSlice";
import quizReducer       from "./slices/quizSlice";
import assignmentReducer from "./slices/assignmentSlice";
import adminReducer      from "./slices/adminSlice";
import reviewsReducer from "./slices/ReviewSlice";
import { bootstrapAuth } from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";

export const store = configureStore({
  reducer: {
    auth:       authReducer,
    course:     courseReducer,
    quiz:       quizReducer,
    assignment: assignmentReducer,
    admin:      adminReducer,
    reviews: reviewsReducer,
    blogs: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/login/fulfilled",
          "auth/refreshToken/fulfilled",
          "assignment/submit/pending",
        ],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});

store.dispatch(bootstrapAuth());

export default store;
