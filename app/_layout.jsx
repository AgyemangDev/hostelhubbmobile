import { useFonts } from "expo-font";
import { useEffect, useState, useRef } from "react";
import Toast from "react-native-toast-message";
import { setupProviders } from "../utils/providers";
import { checkForAppUpdates } from "../utils/update";
import MainLayout from "../components/MainLayout";
import ReviewPromptWrapper from "../Global/ReviewPromptWrapper";
import notificationService from "./firebase/notificationService";
import { AppState } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [updateChecked, setUpdateChecked] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!loaded) return;

    const initializeApp = async () => {
      await checkForAppUpdates();

      setUpdateChecked(true);

      const notificationCleanup =
        notificationService.listenToNotifications();

      notificationService.resetBadgeCount();

      const appStateSubscription = AppState.addEventListener(
        "change",
        async (nextAppState) => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            notificationService.resetBadgeCount();
          }
          appState.current = nextAppState;
        }
      );

      return () => {
        appStateSubscription.remove();
        if (notificationCleanup) notificationCleanup();
      };
    };

    initializeApp();
  }, [loaded]);

  if (!loaded || !updateChecked) return null;

  const ProvidersWrapper = setupProviders();

  return (
    <ProvidersWrapper>
      <MainLayout />
      <Toast />
      <ReviewPromptWrapper />
    </ProvidersWrapper>
  );
}