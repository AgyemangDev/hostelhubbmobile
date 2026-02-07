import { Stack } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import COLORS from "../../../constants/Colors";

// ✅ CustomHeader accepts a title prop
const CustomHeader = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* Example of passing a custom title */}
      <Stack.Screen
        name="index"
        options={{
          header: () => <CustomHeader title="Hostel & Storage Bookings" />,
        }}
      />

      <Stack.Screen
        name="PayNow"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="StorageBookingDetails"
        options={{
          header: () => <CustomHeader title="Storage Booking Details" />,
        }}
      />

      <Stack.Screen
        name="PaidBookings"
        options={{
          header: () => <CustomHeader title="Paid Bookings" />,
        }}
      />

      <Stack.Screen
        name="PaidBookingDetails"
        options={{
          header: () => <CustomHeader title="Booking Details" />,
        }}
      />

      <Stack.Screen
        name="PaymentCompleted"
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </Stack>
  );
};

// Styles for the header
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 20 : 50,
    paddingBottom: 15,
    paddingHorizontal: 0,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default _layout;