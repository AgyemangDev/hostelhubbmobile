import * as Updates from "expo-updates";

export const checkForAppUpdates = async () => {
  if (__DEV__) {
    console.log("⚠️ Skipping update check in development");
    return { updateApplied: false };
  }

  try {
    // ✅ Fix: use Updates.channel, not baseUpdates.channel
    console.log("🔍 Checking for updates...");
    console.log("📦 Current update ID:", Updates.updateId ?? "embedded");
    console.log("📺 Channel:", Updates.channel);
    console.log("🏷️  Runtime version:", Updates.runtimeVersion);
    console.log("🔧 Is embedded:", Updates.isEmbeddedLaunch);

    const update = await Updates.checkForUpdateAsync();
    console.log("📬 Update available?", update.isAvailable);

    if (update.isAvailable) {
      console.log("📥 Fetching update...");
      await Updates.fetchUpdateAsync();
      console.log("✅ Update fetched, reloading...");
      await Updates.reloadAsync();
    } else {
      console.log("✅ Already on latest update");
    }

    return { updateApplied: false };
  } catch (error) {
    console.error("❌ Update check failed (non-fatal):", error.message);
    return { updateApplied: false };
  }
};