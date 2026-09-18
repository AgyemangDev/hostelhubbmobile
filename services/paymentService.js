import API_BASE_URL from "../utils/api/api";

/**
 * Direct-Paystack payment for storage and accommodation/hubclip bookings.
 *
 * Consolidates the old wallet-deposit-first flow that lived in
 * `storagePaymentService.js` and `hooks/transactions/paymentService.js` — the
 * wallet is no longer topped up first and drawn down per booking; each
 * booking now pays Paystack directly.
 */

/**
 * Starts a payment for a given service.
 *
 * Backend contract:
 *   POST /api/payments/initiate
 *   body: { serviceType: 'storage' | 'accommodation' | 'hubclip', serviceRefId?, ...payload }
 *   → { authorization_url, reference }
 */
export const initiatePayment = async ({ user, type, payload = {} }) => {
  if (!user) {
    throw new Error("You must be logged in to continue");
  }

  const token = await user.getIdToken(false);

  const response = await fetch(`${API_BASE_URL}/api/payments/initiate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serviceType: type, ...payload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Could not start payment");
  }

  return data; // { authorization_url, reference }
};

/**
 * Checks the status of a payment by reference.
 *
 * NOTE: the exact confirm/status endpoint is being built by a different
 * (backend) agent in parallel and its final path/shape was not confirmed at
 * the time this was written. Implemented against a reasonable placeholder:
 *
 *   GET /api/payments/verify/:reference → { status: 'pending' | 'completed' | 'failed' }
 *
 * Confirm the real path and response shape against the finished backend and
 * adjust this function accordingly.
 */
export const confirmPayment = async ({ user, reference }) => {
  if (!user) {
    throw new Error("You must be logged in to continue");
  }

  const token = await user.getIdToken(false);

  const response = await fetch(`${API_BASE_URL}/api/payments/verify/${reference}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Could not check payment status");
  }

  return data; // { status: 'pending' | 'completed' | 'failed' }
};
