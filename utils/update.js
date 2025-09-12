// File: utils/updates.js
import * as Updates from "expo-updates";

/**
 * Checks for app updates and applies them if available
 */
export const checkForAppUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      // If update is available, fetch and apply it immediately
      await Updates.fetchUpdateAsync();
      Updates.reloadAsync(); // This restarts the app to apply the update
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
};