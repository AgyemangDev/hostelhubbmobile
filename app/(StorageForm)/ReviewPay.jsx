import { View, ScrollView, StyleSheet, Alert } from "react-native";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import * as FileSystem from "expo-file-system/legacy";

import ReviewItemsSection from "../../components/Storage/ReviewItemsSection";
import ReviewScheduleSection from "../../components/Storage/ReviewScheduleSection";
import ReviewSummarySection from "../../components/Storage/ReviewSummarySection";
import COLORS from "../../constants/Colors";

import { initiatePayment } from "../../services/paymentService";
import { usePaymentConfirmation } from "../../hooks/usePaymentConfirmation";

export default function ReviewPay() {
  const router = useRouter();
  const { reservation, resetReservation } = useStorageReservation();

  const { user } = useContext(UserContext);
  const { confirm, busy } = usePaymentConfirmation();
  const [loading, setLoading] = useState(false);

  const totalAmount = reservation.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const confirmAndPay = async () => {
    if (!user) {
      Alert.alert("Error", "No logged-in user found.");
      return;
    }

    try {
      setLoading(true);

      // Same payload shape the old processStoragePayment built server-side —
      // the backend still computes the charge amount from `items` itself.
      let groupImage = null;
      if (reservation.groupImage?.uri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(
            reservation.groupImage.uri,
            { encoding: "base64" }
          );

          if (base64) {
            groupImage = {
              base64,
              mimeType: reservation.groupImage.mimeType || "image/jpeg",
              fileName: reservation.groupImage.fileName || "photo.jpg",
            };
          }
        } catch (err) {
          console.warn("[ReviewPay] Could not read image file:", err.message);
        }
      }

      const payload = {
        items: reservation.items,
        pickupInfo: reservation.pickupInfo,
        deliveryInfo: reservation.deliveryInfo,
        groupImage,
        referrerId:
          reservation.referral?.status === "confirmed"
            ? reservation.referral.referrerId
            : null,
      };

      const { authorization_url, reference } = await initiatePayment({
        user,
        type: "storage",
        payload,
      });

      const result = await confirm({ authorization_url, reference });

      if (result === "success") {
        // ✅ RESET STORAGE FLOW HERE
        await resetReservation();

        // ✅ Navigate AFTER reset
        router.replace({
          pathname: "SuccessScreen",
          params: {
            transactionReference: reference,
            amount: totalAmount,
          },
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      Alert.alert("Payment Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || busy;

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
          buttonText={isBusy ? "Processing..." : "Confirm & Pay"}
          disabled={isBusy}
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
