import { Linking } from "react-native";
import { router } from "expo-router";

/**
 * Processes deep link URLs and navigates to the correct route
 * @param {Object} event - Deep link event object
 */
export const handleDeepLinking = async (event) => {
  const url = event?.url;
  console.log("Received deep link:", url);

  if (!url) return;

  try {
    let id = null;

    // Replace scheme for parsing if needed
    const cleanedUrl = url.startsWith("hostelhubb://")
      ? url.replace("hostelhubb://", "https://dummy/")
      : url;

    const urlObj = new URL(cleanedUrl);
    const pathParts = urlObj.pathname.split("/");

    // Handle /Details/:id
    if (pathParts[1] === "Details" && pathParts[2]) {
      id = pathParts[2];
    }

    // Handle /hostel/:id → map to /Details/:id
    else if (pathParts[1] === "hostel" && pathParts[2]) {
      id = pathParts[2];
    }

    if (id) {
      console.log("Navigating to /Details/" + id);
 router.push({
  pathname: "/(Details)/[id]",
  params: { hostelId: id },
});
    }
  } catch (error) {
    console.error("Error handling deep link:", error);
  }
};

/**
 * Sets up event listeners for deep links
 * @param {Function} [customCallback] - Optional callback
 * @returns {Function} - Cleanup function to remove listeners
 */
export const setupDeepLinkListeners = (customCallback) => {
  const onDeepLink = async (event) => {
    await handleDeepLinking(event);
    if (typeof customCallback === "function") {
      customCallback(event);
    }
  };

  const subscription = Linking.addEventListener("url", onDeepLink);

  Linking.getInitialURL().then((url) => {
    if (url) {
      onDeepLink({ url });
    }
  });

  return () => {
    subscription.remove();
  };
};
