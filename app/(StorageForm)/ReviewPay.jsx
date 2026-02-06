import { View, ScrollView, StyleSheet, Alert } from "react-native";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

import ReviewItemsSection from "../../components/Storage/ReviewItemsSection";
import ReviewScheduleSection from "../../components/Storage/ReviewScheduleSection";
import ReviewSummarySection from "../../components/Storage/ReviewSummarySection";
import COLORS from "../../constants/Colors";

import { processStoragePayment } from "../../services/storagePaymentService";

export default function ReviewPay() {
  const router = useRouter();
 const { reservation, resetReservation } = useStorageReservation();

  const { user,userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const totalAmount = reservation?.totalAmount || 0;

const hasInsufficientBalance = userInfo?.balance < totalAmount;

const confirmAndPay = async () => {
  if (!user) {
    Alert.alert("Error", "No logged-in user found.");
    return;
  }

  // 🛑 MAIN BALANCE GUARD
  if (hasInsufficientBalance) {
    Alert.alert(
      "Insufficient Balance",
      "You don’t have sufficient balance to complete this storage payment.\n\nPlease top up your wallet and try again.",
      [
        {
          text: "Top Up Balance",
          onPress: () =>
            router.replace("(ProfileScreens)/transactions"),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
    return; // ⛔ STOP TRANSACTION
  }

  try {
    setLoading(true);

    const paymentResult = await processStoragePayment({
      user,
      reservation,
      amount: totalAmount,
    });

    router.push({
      pathname: "SuccessScreen",
      params: {
        transactionReference: paymentResult.transactionReference,
        orderId: paymentResult.orderId,
        amount: paymentResult.amount,
      },
    });
  } catch (err) {
    console.error("Payment error:", err);
    Alert.alert("Payment Error", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReviewItemsSection items={reservation.items} />
        <ReviewScheduleSection
          pickupInfo={reservation.pickupInfo}
          deliveryInfo={reservation.deliveryInfo}
        />
        <ReviewSummarySection
          items={reservation.items}
          groupImage={reservation.groupImage}
        />
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.button}>
        <Button
          buttonText={loading ? "Processing..." : "Confirm & Pay"}
          disabled={loading}
          onPressFunction={confirmAndPay}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  button: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.white,
  },
});
