import { Stack } from "expo-router";
import { colors } from "../../../../constants/theme";

// Every UniGo screen draws its own header from components/ui.
export default function UnigoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="BusSelection" />
      <Stack.Screen name="SeatSelection" />
      <Stack.Screen name="PassengerDetails" />
      <Stack.Screen name="PaymentScreen" />
      {/* Reached by replace() after payment and by links; back would return to a dead checkout. */}
      <Stack.Screen name="Ticket" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
