import React from "react";
import { Stack } from "expo-router";
import { HubclippsProvider } from "../../../context/AddHubclippsContext";
import { colors } from "../../../constants/theme";

// The feed is full-screen video; the posting screens draw their own
// StepHeader (components/ui), so no native headers here.
export default function HubclippsLayout() {
  return (
    <HubclippsProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
        <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: "#000000" } }} />
        <Stack.Screen name="IntroductionScreen" />
        <Stack.Screen name="AccommodationInfoScreen" />
        <Stack.Screen name="ManagerInfoScreen" />
        <Stack.Screen name="MediaScreen" />
        <Stack.Screen name="Preview" />
        <Stack.Screen name="Submitted" options={{ gestureEnabled: false }} />
      </Stack>
    </HubclippsProvider>
  );
}
