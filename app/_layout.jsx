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

// Prevent splash from hiding before app is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
//   android  new 25 2.0.3
// # ios old  new 26 2.0.4
  const CURRENT_VERSION = "2.0.5"; // ← Manually change this before each release
  const LATEST_VERSION = "2.0.5";  // ← Change to the newest deployed version
  
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  // Initialize as null to indicate "checking"
  const [versionOK, setVersionOK] = useState(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!loaded) return;
    
    // Perform version check after fonts are loaded
    const isVersionOK = CURRENT_VERSION === LATEST_VERSION;
    setVersionOK(isVersionOK);
    
    if (!isVersionOK) {
      SplashScreen.hideAsync();
      return;
    }
    
    // Run OTA update check
    checkForAppUpdates();
    
    // Hide splash once everything is ready
    SplashScreen.hideAsync();
    
    // Init auth listener for push token sync
    const authUnsubscribe = notificationService.initAuthListener();
    
    // Register device for push notifications
    const registerPushNotifications = async () => {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        console.log("Push token registered:", token);
      }
    };
    registerPushNotifications();
    
    // Notification setup
    const notificationCleanup = notificationService.listenToNotifications();
    notificationService.resetBadgeCount();
    const tokenChangeSubscription = notificationService.listenForTokenChanges();
    
    // Watch app state to manage badge/token
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        notificationService.resetBadgeCount();
        
        // Verify push token is correctly stored
        notificationService.verifyStoredToken().then(result => {
          console.log("Token verification result:", result);
          if (result.loggedIn && result.hasToken && !result.tokensMatch) {
            console.log("Tokens don't match, updating stored token...");
            notificationService.storeTokenInFirestore(result.currentToken);
          }
        });
      }
      appState.current = nextAppState;
    });
    
    // Cleanup all listeners
    return () => {
      subscription.remove();
      if (tokenChangeSubscription?.remove) tokenChangeSubscription.remove();
      if (notificationCleanup) notificationCleanup();
      if (authUnsubscribe) authUnsubscribe();
    };
  }, [loaded, CURRENT_VERSION, LATEST_VERSION]); // Add dependencies
  
  // App still loading fonts or checking version
  if (!loaded || versionOK === null) return null;
  
  // App is outdated, show update screen
  if (!versionOK) return <UpdateRequiredScreen />;
  
  // Wrap in providers
  const ProvidersWrapper = setupProviders();
  
  return (
    <ProvidersWrapper>
      <MainLayout />
      <Toast />
      <ReviewPromptWrapper />
    </ProvidersWrapper>
  );
}