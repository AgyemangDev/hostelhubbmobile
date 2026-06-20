import { Alert } from "react-native";
import API_BASE_URL from "../utils/api/api";

export const handleHostelCardPress = async ({
  userInfo,
  user,
  onCardPress,
  showAuthModal,
}) => {
  if (!user || !userInfo) {
    showAuthModal?.();
    return;
  }

  onCardPress();
};