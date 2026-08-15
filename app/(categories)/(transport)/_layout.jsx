import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const _layout = () => {
  const router = useRouter();

  // Custom back button component
  const CustomBackButton = () => (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ marginLeft: 8, padding: 4 }}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: "#610b0c" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600", fontSize: 18, color: "#fff" },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        gestureEnabled: false,
        headerLeft: () => <CustomBackButton />, // ✅ Custom back button for all screens
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Board Make we Move",
          headerLeft: () => null, // ✅ No back button on first screen
        }}
      />
      <Stack.Screen
        name="BusSelection"
        options={{
          headerShown: true,
          title: "Select Your Bus",
        }}
      />
      <Stack.Screen
        name="SeatSelection"
        options={{
          headerShown: false,
          title: "Board Make we Move",
        }}
      />
      <Stack.Screen
        name="PassengerDetails"
        options={{
          headerShown: true,
          title: "Passenger Details",
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        options={{
          headerShown: true,
          title: "Pay to Confirm",
        }}
      />
      <Stack.Screen
        name="Ticket"
        options={{
          headerShown: true,
          title: "Your Ticket",
          // Reached by replace() after payment and by deep link, so `back` would
          // return to a dead checkout screen.
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
};

export default _layout;