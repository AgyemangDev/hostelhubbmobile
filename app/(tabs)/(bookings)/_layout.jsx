import { Stack } from "expo-router";
import { StackHeader } from "../../../components/ui";

const _layout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ header: () => <StackHeader title="My Bookings" /> }}
      />
      <Stack.Screen
        name="PayNow"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StorageBookingDetails"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaidBookings"
        options={{ header: () => <StackHeader title="Paid Bookings" showBack /> }}
      />
      <Stack.Screen
        name="PaidBookingDetails"
        options={{ header: () => <StackHeader title="Booking Details" showBack /> }}
      />
      <Stack.Screen
        name="PaymentCompleted"
        options={{ gestureEnabled: false, headerShown: false }}
      />
    </Stack>
  );
};


export default _layout;