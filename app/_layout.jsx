import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { useRef } from "react";
import Toast from "react-native-toast-message";
import { setupProviders } from "../utils/providers";
import { checkForAppUpdates } from "../utils/update";
import MainLayout from "../components/MainLayout";
import ReviewPromptWrapper from "../Global/ReviewPromptWrapper";
import notificationService from "./firebase/notificationService";
import * as SplashScreen from "expo-splash-screen";
import { AppState } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [updateChecked, setUpdateChecked] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!loaded) return;

    const initializeApp = async () => {
      // Update check BLOCKS everything — splash screen stays visible
      await checkForAppUpdates();
      // If an update was found, reloadAsync() was called above
      // and we never reach this line. App restarts fresh with new code.
      
      // No update found (or check failed) — continue normal startup
      setUpdateChecked(true);

      await SplashScreen.hideAsync();

      // Notifications setup
      const notificationCleanup = notificationService.listenToNotifications();
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

  // Keep splash screen up until fonts + update check are both done
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