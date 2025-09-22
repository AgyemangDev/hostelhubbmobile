// hooks/useReviewPrompt.js
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { Platform, Linking } from "react-native";

const REVIEW_KEY = "isRated";
const FIRST_LAUNCH_KEY = "firstLaunchTime";

// Replace with your actual store URLs
const IOS_APP_STORE_URL = "https://apps.apple.com/us/app/hostelhubb/id6738483533";
const ANDROID_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.Hostelhubb.Hostelhubb";

export const useReviewPrompt = () => {
  const [hasTriggered, setHasTriggered] = useState(false);

  const showNativeReviewPrompt = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      console.log("StoreReview available:", isAvailable);

      if (isAvailable) {
        console.log("Showing native review prompt...");
        await StoreReview.requestReview();
      } else {
        const appStoreURL = Platform.OS === "ios" ? IOS_APP_STORE_URL : ANDROID_PLAY_STORE_URL;
        console.log("Opening store URL:", appStoreURL);
        Linking.openURL(appStoreURL);
      }

      await AsyncStorage.setItem(REVIEW_KEY, "true");
      console.log("Marked as rated in AsyncStorage");
      setHasTriggered(true);
    } catch (error) {
      console.error("Error showing review prompt:", error);
    }
  };

  useEffect(() => {
    const checkAndShowReview = async () => {
      try {
        const hasRated = await AsyncStorage.getItem(REVIEW_KEY);
        console.log("AsyncStorage hasRated:", hasRated);
        const firstLaunchTime = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
        console.log("AsyncStorage firstLaunchTime:", firstLaunchTime);

        if (!firstLaunchTime) {
          await AsyncStorage.setItem(FIRST_LAUNCH_KEY, Date.now().toString());
          console.log("First launch time recorded");
          return;
        }

        if (hasRated || hasTriggered) {
          console.log("Already rated or triggered, skipping review prompt");
          return;
        }

        const timer = setTimeout(async () => {
          const stillNotRated = await AsyncStorage.getItem(REVIEW_KEY);
          console.log("Timeout check, stillNotRated:", stillNotRated);
          if (!stillNotRated && !hasTriggered) {
            await showNativeReviewPrompt();
          }
        }, 60 * 1000); // 1 minute

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error in review prompt logic:", error);
      }
    };

    checkAndShowReview();
  }, [hasTriggered]);

  const triggerAfterAction = async () => {
    const hasRated = await AsyncStorage.getItem(REVIEW_KEY);
    console.log("Manual trigger, hasRated:", hasRated, "hasTriggered:", hasTriggered);
    if (!hasRated && !hasTriggered) {
      await showNativeReviewPrompt();
    }
  };

  return { 
    triggerAfterAction, 
    hasTriggered,
  };
};
