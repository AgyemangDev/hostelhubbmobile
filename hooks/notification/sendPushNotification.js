import API_BASE_URL from "../../utils/api/api";

/**
 * Send push notification to a given Expo token
 */
export const sendPushNotification = async ({
  token,
  title,
  body,
  type = "",
}) => {
  console.log("📨 PUSH TOKEN:", token);
  console.log("📨 TITLE:", title);
  console.log("📨 BODY:", body);

  if (!token) {
    console.warn("❌ No Expo token found");
    return;
  }

  try {
    await fetch(`${API_BASE_URL}/api/push-to-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, title, body, type }),
    });
  } catch (err) {
    console.error("Push notification failed:", err);
  }
};