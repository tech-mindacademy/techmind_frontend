import api from "../axios";

// ─── Admin CRUD ───────────────────────────────────────────────────────────────
export const createLiveClass = (payload) =>
  api.post("/live-classes", payload).then((r) => r.data);

export const fetchLiveClasses = (params) =>
  api.get("/live-classes", { params }).then((r) => r.data);

export const updateLiveClass = (id, payload) =>
  api.put(`/live-classes/${id}`, payload).then((r) => r.data);

export const cancelLiveClass = (id, reason) =>
  api.post(`/live-classes/${id}/cancel`, { reason }).then((r) => r.data);

export const deleteLiveClass = (id) =>
  api.delete(`/live-classes/${id}`).then((r) => r.data);

export const fetchAttendance = (id) =>
  api.get(`/live-classes/${id}/attendance`).then((r) => r.data);

// ─── Shared (admin host + student participant) ────────────────────────────────
export const fetchLiveClassById = (id) =>
  api.get(`/live-classes/${id}`).then((r) => r.data);

export const startLiveClass = (id) =>
  api.post(`/live-classes/${id}/start`).then((r) => r.data);

export const endLiveClass = (id) =>
  api.post(`/live-classes/${id}/end`).then((r) => r.data);

export const joinLiveClass = (id) =>
  api.post(`/live-classes/${id}/join`).then((r) => r.data);

// Best-effort — safe to call with fetch(..., { keepalive: true }) on unload too.
export const leaveLiveClass = (id) =>
  api.post(`/live-classes/${id}/leave`).then((r) => r.data);

// ─── Intern Portal listing ─────────────────────────────────────────────────────
export const fetchMyLiveClasses = () =>
  api.get("/live-classes/my-classes").then((r) => r.data);