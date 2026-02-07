// utils/payments.js
import axios from "axios";
import API_BASE_URL from "../utils/api/api";
import { sendPushNotification } from "../hooks/notification/sendPushNotification";

/**
 * Delay helper
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Makes a data purchase request to the backend
 * @param {Object} userInfo - Firebase user info
 * @param {Object} user - Firebase user object (for ID token)
 * @param {Object} selectedPackage - selected data package
 * @param {string} phoneNumber - customer's phone number
 * @param {string} currentExpoToken - Expo push notification token
 * @returns {Promise<Object>} - backend response
 */
export const purchaseData = async ({ 
  userInfo, 
  user, 
  selectedPackage, 
  phoneNumber,
  currentExpoToken, 
}) => {
  if (!user) throw new Error("User not logged in. Please log in again.");

  const token = await user.getIdToken(false);
  console.log("Using token:", token ? "YES" : "NO");

  const payload = {
    email: userInfo.email,
    customer_name:
      userInfo.first_name +
      " " +
      (userInfo.surname || userInfo.lastName || ""),
    customer_phone: phoneNumber,
    idd: user.uid,
    bundle: parseInt(selectedPackage.data_volume, 10),
    netprovider: selectedPackage.netprovider?.toLowerCase(),
  };

  console.log("📤 Sending payload:", payload);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/data-purchase`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Wait 5 seconds before sending push notification
    await delay(10000);

    // Send push notification about purchase
    await sendPushNotification({
      token: currentExpoToken,
      title: "Data Purchase Submitted 📱",
      body: `Your ${selectedPackage.data_volume}GB ${selectedPackage.netprovider} bundle purchase is being processed. You will be notified once delivered.`,
      type: "data_purchase",
    });

    // Return backend message
    return {
      success: true,
      message: response.data?.message || "Purchase completed",
      data: response.data,
    };
  } catch (error) {
    console.error("Purchase Error:", error.response || error.message);

    let backendMessage = "Unknown error";
    if (error.response?.data) {
      backendMessage =
        error.response.data.error ||
        error.response.data.message ||
        JSON.stringify(error.response.data);
    } else if (error.message) {
      backendMessage = error.message;
    }

    return { success: false, message: backendMessage };
  }
};