import { useRouter } from "expo-router";
import { useContext, useCallback, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  handleDeepLinking,
  setupDeepLinkListeners,
} from "../utils/deepLinking";
import { checkUserAuthState } from "../utils/authentication";

export default function MainLayout() {
  const router = useRouter();
  const { user, isLoading, isProfileIncomplete } = useContext(UserContext); // ← add isProfileIncomplete
  const [deepLinkHostelId, setDeepLinkHostelId] = useState(null);
  const insets = useSafeAreaInsets();

  const onDeepLink = useCallback(async (event) => {
    const hostelId = await handleDeepLinking(event);
    if (hostelId) setDeepLinkHostelId(hostelId);
  }, []);

  useEffect(() => {
    const cleanup = setupDeepLinkListeners(onDeepLink);
    return cleanup;
  }, [onDeepLink]);

  const checkUserSession = useCallback(async () => {
    if (isLoading) return;

    await checkUserAuthState({
      user,
      router,
      deepLinkHostelId,
      setDeepLinkHostelId,
    });

    // After auth is resolved, gate on profile completeness
    if (user && isProfileIncomplete) {
      router.replace("/ProfileUpdate");
      SplashScreen.hideAsync();
      return;
    }

    SplashScreen.hideAsync();
  }, [user, isLoading, isProfileIncomplete, router, deepLinkHostelId]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <View
      style={[
        styles.root,
        Platform.OS === "android" && { paddingBottom: insets.bottom },
      ]}
    >
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
        <Stack.Screen name="Shortlist" options={{ headerShown: false }} />
        <Stack.Screen name="NotificationScreen" options={{ headerShown: false }} />
         <Stack.Screen name="allPhotos" options={{ headerShown: false }} />
        <Stack.Screen
          name="bookingModal"
          options={{ title: "Booking", headerShown: false }}
        />
        <Stack.Screen
          name="(Details)/[id]"
          options={{ title: "Booking", headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="StorageEdit"
          options={{ title: "Edit Storage Details", headerShown: false }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});