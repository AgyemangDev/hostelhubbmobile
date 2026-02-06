"use client";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For chevron icon
import { useRouter } from "expo-router";
import { StorageReservationProvider } from "../../context/StorageReservationContext";

// Custom back button component
const BackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

const _layout = () => {
  return (
    <StorageReservationProvider>
      <Stack>
        {/* Home / Landing Page */}
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        {/* Items Selection */}
        <Stack.Screen
          name="ItemsSelection"
          options={{
            headerLeft: () => <BackButton />,
            title: "Select Items",
          }}
        />

        {/* Pickup & Delivery Info */}
        <Stack.Screen
          name="PickupDeliveryInfo"
          options={{
            headerLeft: () => <BackButton />,
            title: "Pickup & Delivery",
          }}
        />

        {/* Image Upload */}
        <Stack.Screen
          name="ImageUpload"
          options={{
            headerLeft: () => <BackButton />,
            title: "Upload Images",
          }}
        />

        {/* Review & Pay */}
        <Stack.Screen
          name="ReviewPay"
          options={{
            headerLeft: () => <BackButton />,
            title: "Review & Pay",
          }}
        />

        {/* Success Screen */}
        <Stack.Screen
          name="SuccessScreen"
          options={{ headerShown: false }}
        />
      </Stack>
    </StorageReservationProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});