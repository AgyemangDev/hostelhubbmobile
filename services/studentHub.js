// services/studentHub.js — calls to /api/me (notifications, complaints,
// reviews, waitlist, tenancy agreements) and the public trust endpoint.
import { auth } from "../lib/firebase/FirebaseConfig";
import API_BASE_URL from "../utils/api/api";

export class HubError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = "GET", body, query, signedIn = true } = {}) {
  const headers = {};
  if (signedIn) {
    const user = auth.currentUser;
    if (!user) throw new HubError("Please sign in first.", 401, "SIGNED_OUT");
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const qs = query
    ? Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
    : "";
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new HubError("No connection. Check your internet and try again.", 0, "NETWORK");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new HubError(data.error || "Something went wrong. Please try again.", res.status, data.code);
  return data;
}

export const studentHub = {
  notifications: (query) => request("/api/me/notifications", { query }),
  unreadCount: () => request("/api/me/notifications/unread-count"),
  markRead: (id) => request(`/api/me/notifications/${id}/read`, { method: "PATCH", body: {} }),
  markAllRead: () => request("/api/me/notifications/read-all", { method: "POST", body: {} }),

  complaints: () => request("/api/me/complaints"),
  complaint: (id) => request(`/api/me/complaints/${id}`),
  createComplaint: (payload) => request("/api/me/complaints", { method: "POST", body: payload }),
  replyComplaint: (id, body) => request(`/api/me/complaints/${id}/messages`, { method: "POST", body: { body } }),

  myReviews: () => request("/api/me/reviews"),
  saveReview: (payload) => request("/api/me/reviews", { method: "POST", body: payload }),

  waitlist: () => request("/api/me/waitlist"),
  joinWaitlist: (accommodationId, roomType) => request("/api/me/waitlist", { method: "POST", body: { accommodation_id: accommodationId, room_type: roomType || null } }),
  leaveWaitlist: (id) => request(`/api/me/waitlist/${id}`, { method: "DELETE" }),

  agreement: (bookingId) => request(`/api/me/bookings/${bookingId}/agreement`),
  acceptAgreement: (bookingId) => request(`/api/me/bookings/${bookingId}/agreement`, { method: "POST", body: { accept: true } }),

  trust: (accommodationId) => request(`/api/accommodation-trust/${accommodationId}`, { signedIn: false }),
  reviews: (accommodationId, query) => request(`/api/accommodation-trust/${accommodationId}/reviews`, { signedIn: false, query }),
};

export default studentHub;
