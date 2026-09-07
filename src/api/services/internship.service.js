import api from "../axios";

// ─── Public browse/apply ──────────────────────────────────────────────────────
export const fetchInternships = (params) =>
  api.get("/internships", { params }).then((r) => r.data);

export const fetchInternshipById = (id) =>
  api.get(`/internships/${id}`).then((r) => r.data);

export const applyToInternship = (id, payload) =>
  api.post(`/internships/${id}/apply`, payload).then((r) => r.data);

export const applyToStaticInternship = (payload) =>
  api.post("/internships/apply-static", payload).then((r) => r.data);

// ─── Intern Portal access (drives the Apply → Join button + route guard) ─────
export const fetchMyInternshipAccess = () =>
  api.get("/internships/my-access").then((r) => r.data);

// ─── Application-fee payment (Razorpay) ───────────────────────────────────────
export const createInternshipCheckout = (applicationId) =>
  api.post(`/internships/applications/${applicationId}/checkout`).then((r) => r.data);

export const verifyInternshipPayment = (applicationId, payload) =>
  api
    .post(`/internships/applications/${applicationId}/verify-payment`, payload)
    .then((r) => r.data);