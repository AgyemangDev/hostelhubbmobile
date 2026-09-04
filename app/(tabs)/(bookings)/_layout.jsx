import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";

export const CustomHeader = ({ title, showBack = false }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#9a0b0d" />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, showBack && styles.headerTitleWithBack]}>
        {title}
      </Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ header: () => <CustomHeader title="My Bookings" /> }}
      />
      <Stack.Screen
        name="PayNow"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StorageBookingDetails"
        options={{ header: () => <CustomHeader title="Storage Details" showBack /> }}
      />
      <Stack.Screen
        name="PaidBookings"
        options={{ header: () => <CustomHeader title="Paid Bookings" showBack /> }}
      />
      <Stack.Screen
        name="PaidBookingDetails"
        options={{ header: () => <CustomHeader title="Booking Details" showBack /> }}
      />
      <Stack.Screen
        name="PaymentCompleted"
        options={{ gestureEnabled: false, headerShown: false }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 44 : 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e8e8e8",
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    color: "#1a1a1a",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  headerTitleWithBack: {
    marginRight: 0,
  },
});

export default _layout;