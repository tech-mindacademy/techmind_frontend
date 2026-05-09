import api from "../axios";

export const createCheckoutSession = (courseId, couponCode) =>
  api.post(`/payments/checkout/${courseId}`, { couponCode }).then(r => r.data);

export const verifyPayment = (paymentData) =>
  api.post("/payments/verify", paymentData).then(r => r.data);

export const fetchMyOrders = () =>
  api.get("/payments/my-orders").then(r => r.data);

export const fetchMyEarnings = () =>
  api.get("/payments/my-earnings").then(r => r.data);

export const refundOrder = (orderId, reason) =>
  api.post(`/payments/refund/${orderId}`, { reason }).then(r => r.data);

// ─── Coupon ───────────────────────────────────────────────────────────────────
export const validateCoupon = (code, courseId) =>
  api.post("/coupons/validate", { code, courseId }).then(r => r.data);

export const createCheckoutWithCoupon = (courseId, couponCode) =>
  api.post(`/payments/checkout/${courseId}`, { couponCode }).then(r => r.data);
