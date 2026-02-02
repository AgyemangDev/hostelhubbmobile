// File: utils/authentication.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkUserAuthState = async ({
  user,
  router,
  deepLinkHostelId,
  setDeepLinkHostelId
}) => {
  try {
    // Check stored deep link first
    const storedHostelId = (await AsyncStorage.getItem('deepLinkHostelId')) || deepLinkHostelId;

    if (user) {
      if (storedHostelId) {
        console.log("Navigating to deep linked hostel:", storedHostelId);

        // Clear deep link after use
        setDeepLinkHostelId && setDeepLinkHostelId(null);
        await AsyncStorage.removeItem('deepLinkHostelId');

        router.replace({
          pathname: "Details",
          params: { hostelId: storedHostelId }
        });
      } else {
        // Normal flow: go to home
        router.replace("(tabs)/(index)");
      }
    } else {
      // User not logged in: go to login
      router.replace("/(Client)");
    }
  } catch (err) {
    console.error("Error checking auth state:", err);
    // Fallback to login on error
    router.replace("/(Client)");
  }
};
