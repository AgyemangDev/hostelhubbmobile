import React from "react";
import { Stack } from "expo-router";
import { StorageReservationProvider } from "../../context/StorageReservationContext";
import { colors } from "../../constants/theme";

// Each storage screen draws its own StepHeader and PriceBar (components/ui),
// so the native header is off for the whole flow.
export default function StorageLayout() {
  return (
    <StorageReservationProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="SchoolSelection" />
        <Stack.Screen name="ItemsSelection" />
        <Stack.Screen name="PickupDeliveryInfo" />
        <Stack.Screen name="ImageUpload" />
        <Stack.Screen name="ReferralStep" />
        <Stack.Screen name="ReviewPay" />
        <Stack.Screen name="SuccessScreen" options={{ gestureEnabled: false }} />
      </Stack>
    </StorageReservationProvider>
  );
}
