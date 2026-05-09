import api from "../axios";

// ─── Public ───────────────────────────────────────────────────────────────────
export const fetchCourses = (params) =>
  api.get("/courses", { params }).then((r) => r.data);

export const fetchCourseBySlug = (slug) =>
  api.get(`/courses/${slug}`).then((r) => r.data);

// ─── Creator ──────────────────────────────────────────────────────────────────
export const fetchMyCoursesCreator = () =>
  api.get("/courses/creator/my-courses").then((r) => r.data);

export const fetchCourseForEdit = (courseId) =>
  api.get(`/courses/${courseId}/manage`).then((r) => r.data);

export const createCourse = (formData) =>
  api.post("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const updateCourse = (courseId, formData) =>
  api.put(`/courses/${courseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const deleteCourse = (courseId) =>
  api.delete(`/courses/${courseId}`).then((r) => r.data);

export const togglePublish = (courseId) =>
  api.patch(`/courses/${courseId}/publish`).then((r) => r.data);

export const uploadPreviewVideo = (courseId, formData) =>
  api.post(`/courses/${courseId}/preview-video`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

// ─── Sections ─────────────────────────────────────────────────────────────────
export const addSection = (courseId, data) =>
  api.post(`/courses/${courseId}/sections`, data).then((r) => r.data);

export const updateSection = (courseId, sectionId, data) =>
  api.put(`/courses/${courseId}/sections/${sectionId}`, data).then((r) => r.data);

export const deleteSection = (courseId, sectionId) =>
  api.delete(`/courses/${courseId}/sections/${sectionId}`).then((r) => r.data);

export const reorderSections = (courseId, order) =>
  api.patch(`/courses/${courseId}/sections/reorder`, { order }).then((r) => r.data);

// ─── Lessons ──────────────────────────────────────────────────────────────────
export const addLesson = (courseId, sectionId, data) =>
  api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, data).then((r) => r.data);

export const updateLesson = (courseId, sectionId, lessonId, data) =>
  api.put(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, data)
    .then((r) => r.data);

export const deleteLesson = (courseId, sectionId, lessonId) =>
  api.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`)
    .then((r) => r.data);

export const reorderLessons = (courseId, sectionId, order) =>
  api.patch(`/courses/${courseId}/sections/${sectionId}/lessons/reorder`, { order })
    .then((r) => r.data);

// ─── Video ────────────────────────────────────────────────────────────────────
export const uploadLessonVideo = (courseId, sectionId, lessonId, formData, onProgress) =>
  api.post(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    }
  ).then((r) => r.data);

export const deleteLessonVideo = (courseId, sectionId, lessonId) =>
  api.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`)
    .then((r) => r.data);

// ─── Notes ────────────────────────────────────────────────────────────────────
export const uploadLessonNote = (courseId, sectionId, lessonId, formData) =>
  api.post(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/notes`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  ).then((r) => r.data);

export const deleteLessonNote = (courseId, sectionId, lessonId, noteId) =>
  api.delete(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/notes/${noteId}`
  ).then((r) => r.data);

// ─── Enrollment ───────────────────────────────────────────────────────────────
export const enrollFree = (courseId) =>
  api.post(`/courses/${courseId}/enroll`).then((r) => r.data);

export const fetchMyEnrollments = () =>
  api.get("/enrollments/my").then((r) => r.data);

export const fetchEnrollment = (courseId) =>
  api.get(`/enrollments/${courseId}`).then((r) => r.data);

export const markLessonComplete = (courseId, lessonId) =>
  api.patch(`/enrollments/${courseId}/complete-lesson`, { lessonId }).then((r) => r.data);

export const updateLastAccessed = (courseId, lessonId) =>
  api.patch(`/enrollments/${courseId}/last-accessed`, { lessonId }).then((r) => r.data);
