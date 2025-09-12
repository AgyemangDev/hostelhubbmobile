import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REVIEW_KEY = "hasRatedHostelHubb";

export const useReviewPrompt = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  // Trigger after 3 minutes
  useEffect(() => {
    const timer = setTimeout(async () => {
      const hasRated = await AsyncStorage.getItem(REVIEW_KEY);
      if (!hasRated) setShouldShowModal(true);
    }, 10 * 60 * 1000); 

    return () => clearTimeout(timer);
  }, []);

  const triggerAfterAction = async () => {
    const hasRated = await AsyncStorage.getItem(REVIEW_KEY);
    if (!hasRated) {
      setShouldShowModal(true);
    }
  };

  const markAsRated = async () => {
    await AsyncStorage.setItem(REVIEW_KEY, "true");
    setShouldShowModal(false);
  };

  return { shouldShowModal, setShouldShowModal, triggerAfterAction, markAsRated };
};
