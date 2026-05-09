import api from "../axios";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const fetchPlatformStats = () =>
  api.get("/admin/stats").then((r) => r.data);

export const fetchRevenueChart = () =>
  api.get("/admin/revenue/chart").then((r) => r.data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchUsers = (params) =>
  api.get("/admin/users", { params }).then((r) => r.data);

export const fetchUserDetail = (userId) =>
  api.get(`/admin/users/${userId}`).then((r) => r.data);

export const changeUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, { role }).then((r) => r.data);

export const toggleUserActive = (userId) =>
  api.patch(`/admin/users/${userId}/toggle-active`).then((r) => r.data);

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`).then((r) => r.data);

// ─── Creator requests ─────────────────────────────────────────────────────────
export const fetchCreatorRequests = (status = "pending") =>
  api.get("/admin/creator-requests", { params: { status } }).then((r) => r.data);

export const approveCreator = (userId) =>
  api.patch(`/admin/creator-requests/${userId}/approve`).then((r) => r.data);

export const rejectCreator = (userId) =>
  api.patch(`/admin/creator-requests/${userId}/reject`).then((r) => r.data);

// Student applying to become creator
export const applyForCreator = () =>
  api.post("/admin/creator-requests/apply").then((r) => r.data);

// ─── Courses ──────────────────────────────────────────────────────────────────
export const adminFetchCourses = (params) =>
  api.get("/admin/courses", { params }).then((r) => r.data);

export const adminTogglePublish = (courseId) =>
  api.patch(`/admin/courses/${courseId}/toggle-publish`).then((r) => r.data);

export const adminDeleteCourse = (courseId) =>
  api.delete(`/admin/courses/${courseId}`).then((r) => r.data);

// ─── Orders ───────────────────────────────────────────────────────────────────
export const fetchOrders = (params) =>
  api.get("/admin/orders", { params }).then((r) => r.data);

// ─── Course approvals ─────────────────────────────────────────────────────────
export const fetchPendingCourses = (params) =>
  api.get("/admin/course-approvals", { params }).then((r) => r.data);

export const approveCourse = (courseId) =>
  api.patch(`/admin/course-approvals/${courseId}/approve`).then((r) => r.data);

export const rejectCourse = (courseId, note = "") =>
  api.patch(`/admin/course-approvals/${courseId}/reject`, { note }).then((r) => r.data);
