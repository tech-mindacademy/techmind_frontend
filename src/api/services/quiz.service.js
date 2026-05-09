import api from "../axios";

// ─── Creator ──────────────────────────────────────────────────────────────────
export const createQuiz = (data) =>
  api.post("/quizzes", data).then((r) => r.data);

export const getQuizByLesson = (lessonId) =>
  api.get(`/quizzes/lesson/${lessonId}`).then((r) => r.data);

export const getQuiz = (quizId) =>
  api.get(`/quizzes/${quizId}`).then((r) => r.data);

export const updateQuiz = (quizId, data) =>
  api.put(`/quizzes/${quizId}`, data).then((r) => r.data);

export const deleteQuiz = (quizId) =>
  api.delete(`/quizzes/${quizId}`).then((r) => r.data);

export const getQuizAttempts = (quizId) =>
  api.get(`/quizzes/${quizId}/attempts`).then((r) => r.data);

// ─── Student ──────────────────────────────────────────────────────────────────
export const startQuizAttempt = (quizId) =>
  api.post(`/quizzes/${quizId}/start`).then((r) => r.data);

export const submitQuizAttempt = (quizId, payload) =>
  api.post(`/quizzes/${quizId}/submit`, payload).then((r) => r.data);

export const getMyAttempts = (quizId) =>
  api.get(`/quizzes/${quizId}/my-attempts`).then((r) => r.data);
