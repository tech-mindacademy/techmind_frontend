import api from "../axios";

const base = "/industrial-training";

export const applyForTraining = (payload) =>
  api.post(`${base}/apply`, payload).then((r) => r.data);

export const fetchMyTrainingAccess = () =>
  api.get(`${base}/my-access`).then((r) => r.data);

export const fetchApplications = (params) =>
  api.get(`${base}/applications`, { params }).then((r) => r.data);

export const updateApplicationStatus = (id, status) =>
  api.patch(`${base}/applications/${id}/status`, { status }).then((r) => r.data);

export const sendPaymentLink = (id, payload) =>
  api.post(`${base}/applications/${id}/payment-link`, payload).then((r) => r.data);

export const sendCredentials = (id, payload) =>
  api.post(`${base}/applications/${id}/send-credentials`, payload).then((r) => r.data);
