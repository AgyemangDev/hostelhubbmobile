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
import { supabase } from "./firebase/supabaseConfig";

// Prevent splash from hiding before app is ready
SplashScreen.preventAutoHideAsync();

// Interval to check for notification permissions (every 30 minutes)
const NOTIFICATION_CHECK_INTERVAL = 30 * 60 * 1000;

export default function RootLayout() {
  const CURRENT_VERSION = "2.0.5";
  const LATEST_VERSION = "2.0.5";
  
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  const [versionOK, setVersionOK] = useState(null);
  const appState = useRef(AppState.currentState);
  const notificationCheckInterval = useRef(null);

  // Periodic notification check
  const checkAndPromptNotifications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const hasToken = await notificationService.checkUserHasToken(session.user.id);
    
    if (!hasToken) {
      notificationService.promptForNotifications(async () => {
        await notificationService.registerForPushNotifications(session.user.id);
      });
    }
  };

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
    
    // Set up notification listeners
    const notificationCleanup = notificationService.listenToNotifications();
    notificationService.resetBadgeCount();
    
    // Register for notifications when user logs in
    const setupNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const hasToken = await notificationService.checkUserHasToken(session.user.id);
        
        if (!hasToken) {
          // Prompt immediately if no token
          setTimeout(() => {
            notificationService.promptForNotifications(async () => {
              await notificationService.registerForPushNotifications(session.user.id);
            });
          }, 2000); // Delay 2 seconds after app loads
        } else {
          await notificationService.registerForPushNotifications(session.user.id);
        }
      }
    };
    setupNotifications();
    
    // Set up periodic notification check (every 30 minutes)
    notificationCheckInterval.current = setInterval(checkAndPromptNotifications, NOTIFICATION_CHECK_INTERVAL);
    
    // Listen for auth changes to register/unregister notifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const hasToken = await notificationService.checkUserHasToken(session.user.id);
        
        if (!hasToken) {
          notificationService.promptForNotifications(async () => {
            await notificationService.registerForPushNotifications(session.user.id);
          });
        } else {
          await notificationService.registerForPushNotifications(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear periodic check when user logs out
        if (notificationCheckInterval.current) {
          clearInterval(notificationCheckInterval.current);
        }
      }
    });
    
    // Watch app state to reset badge and check notifications
    const appStateSubscription = AppState.addEventListener("change", async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        notificationService.resetBadgeCount();
        
        // Check notification status when app comes to foreground
        await checkAndPromptNotifications();
      }
      appState.current = nextAppState;
    });
    
    // Cleanup all listeners
    return () => {
      appStateSubscription.remove();
      subscription.unsubscribe();
      if (notificationCleanup) notificationCleanup();
      if (notificationCheckInterval.current) {
        clearInterval(notificationCheckInterval.current);
      }
    };
  }, [loaded, CURRENT_VERSION, LATEST_VERSION]);
  
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