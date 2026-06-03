import React from "react";
import { Stack } from "expo-router";

const ClientLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailVerificationScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientLogIn"
        options={{
          headerShown: false,
          presentation: "modal",        // ← modal slide up
          gestureEnabled: true,         // ← swipe down to dismiss
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="FirstWelcomeScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInfo"
        options={{ headerShown: false, gestureEnabled: true }}
      />
    </Stack>
  );
};

export default ClientLayout;