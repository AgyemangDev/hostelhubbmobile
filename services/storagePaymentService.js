import API_BASE_URL from "../utils/api/api";

/**
 * Handles storage payment request
 * @param {Object} params
 * @param {Object} params.user - Firebase user
 * @param {Object} params.reservation - Storage reservation data
 */
export const processStoragePayment = async ({ user, reservation }) => {
  if (!user) {
    throw new Error("You must be logged in to continue");
  }

  // Get Firebase ID token
  const token = await user.getIdToken(false);

  // Build payload
  const payload = {
    items: reservation.items,
    pickupInfo: reservation.pickupInfo,
    deliveryInfo: reservation.deliveryInfo,
    groupImage: reservation.groupImage,
  };

  const response = await fetch(
    `${API_BASE_URL}/payment/storagepayment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Payment failed");
  }

  return data.data; // { transactionReference, orderId, amount }
};
