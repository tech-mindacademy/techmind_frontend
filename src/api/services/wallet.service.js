import api from "../axios";

// ─── Wallet ───────────────────────────────────────────────────────────────────
export const fetchMyWallet = () =>
  api.get("/wallet").then(r => r.data);

export const requestWithdrawal = (amount, upiId, note = "") =>
  api.post("/wallet/withdraw", { amount, upiId, note }).then(r => r.data);

// Admin
export const fetchAllWallets = (params) =>
  api.get("/wallet/admin/all", { params }).then(r => r.data);

export const fetchPendingWithdrawals = () =>
  api.get("/wallet/admin/withdrawals").then(r => r.data);

export const completeWithdrawal = (walletId, transactionId) =>
  api.patch(`/wallet/admin/withdrawals/${walletId}/${transactionId}/complete`).then(r => r.data);

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const fetchCoupons = () =>
  api.get("/coupons").then(r => r.data);

export const createCoupon = (data) =>
  api.post("/coupons", data).then(r => r.data);

export const toggleCoupon = (id) =>
  api.patch(`/coupons/${id}/toggle`).then(r => r.data);

export const deleteCoupon = (id) =>
  api.delete(`/coupons/${id}`).then(r => r.data);

export const validateCoupon = (code, courseId) =>
  api.post("/coupons/validate", { code, courseId }).then(r => r.data);

// ─── Certificates ─────────────────────────────────────────────────────────────
export const fetchCourseStudents = (courseId) =>
  api.get(`/enrollments/${courseId}/students`).then(r => r.data);

export const issueCertificate = (courseId, studentId) =>
  api.post(`/enrollments/${courseId}/issue-certificate`, { studentId }).then(r => r.data);
