import React from "react";
import { Stack } from "expo-router";

const ClientLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ClientLogIn"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ClientSignUp"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PersonalInfo"
        options={{
          headerShown: false,
          gestureEnabled: false, // This should disable swipe back
        }}
      />
      <Stack.Screen
        name="locSelection"
        options={{
          headerShown: false,
          gestureEnabled: false, // This should disable swipe back
        }}
      />
    </Stack>
  );
};

export default ClientLayout;
