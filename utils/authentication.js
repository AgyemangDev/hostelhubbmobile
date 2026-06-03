// File: utils/authentication.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkUserAuthState = async ({
  user,
  router,
  deepLinkHostelId,
  setDeepLinkHostelId
}) => {
  try {
    const storedHostelId =
      (await AsyncStorage.getItem("deepLinkHostelId")) || deepLinkHostelId;

    if (user && storedHostelId) {
      setDeepLinkHostelId?.(null);
      await AsyncStorage.removeItem("deepLinkHostelId");

      router.replace({
        pathname: "Details",
        params: { hostelId: storedHostelId },
      });
    }

    // No routing for normal login
  } catch (err) {
    console.error("Error checking auth state:", err);
  }
};
