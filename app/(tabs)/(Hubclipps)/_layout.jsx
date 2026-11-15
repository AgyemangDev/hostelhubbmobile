import React from "react";
import { Stack } from "expo-router";
import { HubclippsProvider } from "../../../context/AddHubclippsContext";

// The feed is full-screen video; the posting screens draw their own
// StepHeader (components/ui/ds), so no native headers here.
export default function HubclippsLayout() {
  return (
    <HubclippsProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FFFFFF" } }}>
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
