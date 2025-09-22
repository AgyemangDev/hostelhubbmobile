// File: components/MainLayout.jsx
import { useNavigation } from "expo-router";
import { useContext, useCallback, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  handleDeepLinking,
  setupDeepLinkListeners,
} from "../utils/deepLinking";
import { checkUserAuthState } from "../utils/authentication";

export default function MainLayout() {
  const navigation = useNavigation(); // Use only this for navigation
  const { user, isLoading } = useContext(UserContext);
  const [deepLinkHostelId, setDeepLinkHostelId] = useState(null);

  // Handle deep links - extracted to separate module
  const onDeepLink = useCallback(async (event) => {
    const hostelId = await handleDeepLinking(event);
    if (hostelId) {
      setDeepLinkHostelId(hostelId);
    }
  }, []);

  // Set up deep link handling
  useEffect(() => {
    const cleanup = setupDeepLinkListeners(onDeepLink);
    return cleanup;
  }, [onDeepLink]);

  // Check user session and handle navigation based on auth state
  const checkUserSession = useCallback(async () => {
    if (isLoading) return;

    // Use the extracted authentication helper
    await checkUserAuthState({
      user,
      router: navigation, // Use navigation here
      deepLinkHostelId,
      setDeepLinkHostelId,
    });

    // Hide the splash screen after routing is complete
    SplashScreen.hideAsync();
  }, [user, isLoading, navigation, deepLinkHostelId]);

  // Check user session whenever auth state or deep link changes
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <Stack
      initialRouteName="(Client)"
      screenOptions={{
        headerStyle: { backgroundColor: "#610b0c" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold", color: "#fff" },
      }}
    >
      <Stack.Screen name="(Client)" options={{ headerShown: false }} />
      <Stack.Screen name="(categories)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(StorageForm)" options={{ headerShown: false }} />
      <Stack.Screen name="(shortlist)" options={{ headerShown: false }} />
      <Stack.Screen
        name="NotificationScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="bookingModal"
        options={{
          title: "Booking",
          headerShown:false
        }}
      />
      <Stack.Screen
        name="(Details)/[id]"
        options={{
          title: "Booking",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        options={{
          title: "Booking",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StorageEdit"
        options={{
          title: "Edit Storage Details",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
