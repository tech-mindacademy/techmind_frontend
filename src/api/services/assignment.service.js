import api from "../axios";

// ─── Creator ──────────────────────────────────────────────────────────────────
export const createAssignment = (formData) =>
  api
    .post("/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const getAssignmentByLesson = (lessonId) =>
  api.get(`/assignments/lesson/${lessonId}`).then((r) => r.data);

export const getAssignment = (assignmentId) =>
  api.get(`/assignments/${assignmentId}`).then((r) => r.data);

export const updateAssignment = (assignmentId, formData) =>
  api
    .put(`/assignments/${assignmentId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deleteAssignment = (assignmentId) =>
  api.delete(`/assignments/${assignmentId}`).then((r) => r.data);

export const deleteAssignmentAttachment = (assignmentId, attachmentId) =>
  api
    .delete(`/assignments/${assignmentId}/attachments/${attachmentId}`)
    .then((r) => r.data);

export const getAllSubmissions = (assignmentId) =>
  api.get(`/assignments/${assignmentId}/submissions`).then((r) => r.data);

export const gradeSubmission = (assignmentId, submissionId, data) =>
  api
    .patch(
      `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      data
    )
    .then((r) => r.data);

export const requestResubmit = (assignmentId, submissionId, data) =>
  api
    .patch(
      `/assignments/${assignmentId}/submissions/${submissionId}/request-resubmit`,
      data
    )
    .then((r) => r.data);

// ─── Student ──────────────────────────────────────────────────────────────────
export const submitAssignment = (assignmentId, formData, onProgress) =>
  api
    .post(`/assignments/${assignmentId}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    })
    .then((r) => r.data);
