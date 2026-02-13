import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { setupProviders } from "../utils/providers";
import { checkForAppUpdates } from "../utils/update";
import MainLayout from "../components/MainLayout";
import ReviewPromptWrapper from "../Global/ReviewPromptWrapper";
import notificationService from "./firebase/notificationService";
import * as SplashScreen from "expo-splash-screen";
import { AppState } from "react-native";
import UpdateRequiredScreen from "../components/UpdateRequiredScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  const [updateStatus, setUpdateStatus] = useState({
    checked: false,
    requiresNativeUpdate: false,
    minimumVersion: null
  });
  
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!loaded) return;
    
    const initializeApp = async () => {
      // Check for updates FIRST
      const updateResult = await checkForAppUpdates();
      
      setUpdateStatus({
        checked: true,
        requiresNativeUpdate: updateResult.requiresNativeUpdate,
        minimumVersion: updateResult.minimumVersion
      });
      
      if (!updateResult.requiresNativeUpdate) {
        SplashScreen.hideAsync();
        
        // Set up notification listeners
        const notificationCleanup = notificationService.listenToNotifications();
        notificationService.resetBadgeCount();
        
        // Watch app state
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
        
        // Cleanup
        return () => {
          appStateSubscription.remove();
          if (notificationCleanup) notificationCleanup();
        };
      } else {
        SplashScreen.hideAsync();
      }
    };
    
    initializeApp();
  }, [loaded]);
  
  if (!loaded || !updateStatus.checked) return null;
  if (updateStatus.requiresNativeUpdate) {
    return <UpdateRequiredScreen minimumVersion={updateStatus.minimumVersion} />;
  }
  
  const ProvidersWrapper = setupProviders();
  
  return (
    <ProvidersWrapper>
      <MainLayout />
      <Toast />
      <ReviewPromptWrapper />
    </ProvidersWrapper>
  );
}