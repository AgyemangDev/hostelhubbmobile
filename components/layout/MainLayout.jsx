import { useRouter, Stack } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Linking, Platform, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../../context/UserContext";
import { hasPendingLink, needsLogin, savePendingLink, takePendingRoute, toAppRoute } from "../../utils/links";
import { auth } from "../../lib/firebase/FirebaseConfig";

export default function MainLayout() {
  const router = useRouter();
  const { user, isLoading, isProfileIncomplete } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const hadUser = useRef(null);

  // A link tapped while the app is already open (in the background or on
  // another screen). app/+native-intent.jsx only routes the link that launches
  // the app; the router didn't navigate for these, so they're pushed here.
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const route = toAppRoute(url);
      if (!route) return;
      if (needsLogin(url) && !auth.currentUser) {
        savePendingLink(url);
        router.replace("/FirstWelcomeScreen");
        return;
      }
      router.push(route);
    });
    return () => subscription.remove();
  }, [router]);

  // The launch link is routed by app/+native-intent.jsx. The other thing
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
        <Stack.Screen name="allPhotos" options={{ presentation: "fullScreenModal", animation: "fade" }} />
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
