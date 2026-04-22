import * as FileSystem from "expo-file-system/legacy";
import API_BASE_URL from "../utils/api/api";

/**
 * Handles storage payment request.
 *
 * Why we read base64 here rather than storing it in context:
 * - base64 of a photo can be 1–3 MB as a string
 * - AsyncStorage has a ~6 MB limit and silently drops oversized values
 * - Reading fresh from the local uri at payment time is instant and reliable
 */
export const processStoragePayment = async ({ user, reservation }) => {
  if (!user) {
    throw new Error("You must be logged in to continue");
  }

  const token = await user.getIdToken(false);

  // ✅ Read base64 fresh from the local uri right before sending
  let groupImage = null;
  if (reservation.groupImage?.uri) {
    try {
      const base64 = await FileSystem.readAsStringAsync(
        reservation.groupImage.uri,
        { encoding: "base64" }
      );

      if (base64) {
        groupImage = {
          base64,
          mimeType: reservation.groupImage.mimeType || "image/jpeg",
          fileName: reservation.groupImage.fileName || "photo.jpg",
        };
      }
    } catch (err) {
      // File may have been cleared from cache — proceed without image
      console.warn("[processStoragePayment] Could not read image file:", err.message);
    }
  }

  const payload = {
    items: reservation.items,
    pickupInfo: reservation.pickupInfo,
    deliveryInfo: reservation.deliveryInfo,
    groupImage, // { base64, mimeType, fileName } or null
  };

  const response = await fetch(`${API_BASE_URL}/payment/storagepayment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Payment failed");
  }

  return data.data; // { orderId, reference, amount, ... }
};