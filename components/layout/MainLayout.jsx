import { useRouter, Stack } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Platform, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../../context/UserContext";
import { hasPendingLink, takePendingRoute } from "../../utils/links";

export default function MainLayout() {
  const router = useRouter();
  const { user, isLoading, isProfileIncomplete } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const hadUser = useRef(null);

  // Incoming links are routed by app/+native-intent.jsx. The only thing left
  // here is a link that needed login: when it arrives signed out, it is saved
  // and opened as soon as the user signs in (or immediately, if a restored
  // session shows they already were).
  useEffect(() => {
    if (isLoading) return;
    SplashScreen.hideAsync();

    if (user && isProfileIncomplete) {
      router.replace("/ProfileUpdate");
      return;
    }

    const signedInNow = Boolean(user) && hadUser.current !== true;
    hadUser.current = Boolean(user);

    if (!user) {
      // Opened a members-only link while signed out: go to sign in first.
      hasPendingLink().then((pending) => {
        if (pending) router.replace("/FirstWelcomeScreen");
      });
      return;
    }
    if (!signedInNow) return;

    takePendingRoute().then((route) => {
      if (route) router.push(route);
    });
  }, [user, isLoading, isProfileIncomplete, router]);

  return (
    <View style={[styles.root, Platform.OS === "android" && { paddingBottom: insets.bottom }]}>
      <Stack initialRouteName="(Client)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(Client)" />
        <Stack.Screen name="(categories)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(StorageForm)" />
        <Stack.Screen name="Shortlist" />
        <Stack.Screen name="NotificationScreen" />
        <Stack.Screen name="allPhotos" />
        <Stack.Screen name="bookingModal" />
        <Stack.Screen name="hostel/[id]" />
        <Stack.Screen name="wallet" />
        <Stack.Screen
          name="SearchScreen"
          options={{ gestureEnabled: true, gestureDirection: "horizontal", presentation: "card" }}
        />
        <Stack.Screen name="StorageEdit" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
