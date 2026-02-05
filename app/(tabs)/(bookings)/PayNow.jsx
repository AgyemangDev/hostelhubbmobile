import React, { useState, useContext, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DefaultHeader from "../../../components/Headers/DefaultHeader";
import BookingDetailsCard from "../../../components/Cards/BookingCards/BookingDetailsCard";
import OwnerInfoCard from "../../../components/Cards/BookingCards/OwnerInfoCard";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import { processPayment } from "../../../hooks/transactions/paymentService";
import { UserContext } from "../../../context/UserContext";

const PayNow = () => {
  const router = useRouter();
  const { user, userInfo } = useContext(UserContext);

  const params = useLocalSearchParams();
  const bookingData = params.booking ? JSON.parse(params.booking) : null;

  const [loading, setLoading] = useState(false);

  if (!bookingData || !userInfo) return null;

  const {
    accommodation,
    owner,
    room_type,
    payment_option,
    status,
    booking_date,
  } = bookingData;

  const baseAmount = Number(payment_option || 0);
  const totalAmount = useMemo(() => baseAmount * 1.05, [baseAmount]);

  const userBalance = Number(userInfo.balance || 0);

  // 🔒 GUARD FLAG
  const hasInsufficientBalance = userBalance < totalAmount;

  const handlePayment = async () => {
    if (!user) {
      Alert.alert("Error", "No logged-in user found.");
      return;
    }

    // 🛑 HARD GUARD (MAIN REQUIREMENT)
    if (hasInsufficientBalance) {
      Alert.alert(
        "Insufficient Balance",
        "You don’t have sufficient balance to complete this transaction.\n\nKindly top up your balance and come back to pay to secure your bed spot.",
        [
          {
            text: "Top Up Balance",
            onPress: () =>
              router.replace("(ProfileScreens)/transactions"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return; // ⛔ STOP HERE
    }

    try {
      setLoading(true);

      const token = await user.getIdToken(false);

      const {
        id: bookingId,
        accommodation_id,
        accommodation_owner_id,
      } = bookingData;

      const success = await processPayment({
        amount: totalAmount,
        bookingId,
        accommodationId: accommodation_id,
        accommodationOwnerId: accommodation_owner_id,
        token,
      });

      if (success) {
        router.replace("/(tabs)/(bookings)/index");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <DefaultHeader title="Pay Now" />

      <ScrollView>
        <BookingDetailsCard
          accommodation={accommodation}
          room_type={room_type}
          status={status}
          totalAmount={totalAmount}
          booking_date={booking_date}
        />

        <OwnerInfoCard owner={owner} />

        <View style={styles.buttonContainer}>
          <Button
            buttonText={
              hasInsufficientBalance
                ?  `Pay GHS ${totalAmount.toFixed(2)}`
                : `Pay GHS ${totalAmount.toFixed(2)}`
            }
            onPressFunction={handlePayment}
            variant={hasInsufficientBalance ? "disabled" : "default"}
            disabled={hasInsufficientBalance || loading}
          />
        </View>

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#8e0002" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PayNow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
