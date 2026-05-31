import api from "../axios";

// ─── Student ──────────────────────────────────────────────────────────────────

export const requestRefund = (courseId, reason) =>
  api.post("/refunds", { courseId, reason }).then((r) => r.data);

export const getMyRefunds = () =>
  api.get("/refunds/my").then((r) => r.data);

export const cancelRefund = (refundId) =>
  api.delete(`/refunds/${refundId}`).then((r) => r.data);

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllRefunds = (params) =>
  api.get("/refunds/admin", { params }).then((r) => r.data);

export const getRefundById = (refundId) =>
  api.get(`/refunds/admin/${refundId}`).then((r) => r.data);

export const resolveRefund = (refundId, payload) =>
  api.patch(`/refunds/admin/${refundId}/resolve`, payload).then((r) => r.data);

export const getRefundStats = () =>
  api.get("/refunds/admin/stats").then((r) => r.data);