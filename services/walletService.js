import API_BASE_URL from "../utils/api/api";

/**
 * Wallet withdrawals (backend: routes/wallet/walletRoutes.js).
 * Errors keep the backend's `code` and `supportUrl`, so the screen can offer
 * "Contact customer care on WhatsApp" when payouts are unavailable.
 */
async function call(user, path, { method = "GET", body } = {}) {
  if (!user) throw Object.assign(new Error("Please log in to continue"), { code: "AUTH" });
  const token = await user.getIdToken(false);
  const res = await fetch(`${API_BASE_URL}/api/wallet${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    throw Object.assign(new Error(data.error || "Something went wrong"), {
      code: data.code,
      supportUrl: data.supportUrl,
      availableAt: data.availableAt,
    });
  }
  return data;
}

export const getPayoutMethod = (user) => call(user, "/payout-method");
export const listPayoutBanks = (user, type) => call(user, `/payout-banks?type=${type}`);
export const savePayoutMethod = (user, body) => call(user, "/payout-method", { method: "PUT", body });
export const listWithdrawals = (user) => call(user, "/withdrawals");
export const requestWithdrawal = (user, amount) => call(user, "/withdrawals", { method: "POST", body: { amount } });
