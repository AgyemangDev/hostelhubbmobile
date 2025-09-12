import { Stack } from "expo-router";
import { View, Text, StyleSheet,Platform } from "react-native";
import COLORS from "../../../constants/Colors";

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Hostel & Storage Bookings</Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />, // Use the custom header
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="PayNow" />
      <Stack.Screen name="PaidBookings" />
      <Stack.Screen name="PaidBookingDetails" />
    </Stack>
  );
};

// Styles for the header
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 20 : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default _layout;
