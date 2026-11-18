import React, { useContext, useState } from "react";
import {
  View, ScrollView, StyleSheet, Platform, Alert, Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../../../../context/UserContext";
import TripInfoCard from "../../../../components/cards/transport/TripInfoCard";
import PassengerInfoCard from "../../../../components/cards/transport/PassengerInfoCard";
import PriceBreakdownCard from "../../../../components/cards/transport/PriceBreakdownCard";
import API_BASE_URL from "../../../../utils/api/api";
import { Button } from "../../../../components/ui";
import { colors } from "../../../../constants/theme";

const PaymentScreen = () => {
  const {
    bus: busParam,
    selectedSeats: seatsParam,
    seatPrice,
    storageItems: storageParam,
    storageTotalPrice,
  } = useLocalSearchParams();

  const { user, userInfo,refreshUserInfo } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Parse data
  const bus = JSON.parse(busParam);
  const selectedSeats = JSON.parse(seatsParam);
  const quantities = storageParam ? JSON.parse(storageParam) : {};
  const storageFee = parseFloat(storageTotalPrice) || 0;
  const seatFee = parseFloat(seatPrice) || 0;
  const grandTotal = seatFee + storageFee;

  // User balance
  const userBalance = parseFloat(userInfo?.balance) || 0;
  const hasSufficientBalance = userBalance >= grandTotal;

  const handlePayment = async () => {
    // Always show alert if insufficient balance
    if (!hasSufficientBalance) {
      Alert.alert(
        "Insufficient Balance",
        `You have GH₵${userBalance.toFixed(2)} but need GH₵${grandTotal.toFixed(2)} to complete your transport booking. Would you like to top up your balance?`,
        [
          {
            text: "No, Cancel",
            style: "cancel",
          },
          {
            text: "Yes, Top Up",
            onPress: () => router.push("/(tabs)/(ProfileScreens)/transactions"),
          },
        ]
      );
      return;
    }

    // Prepare backend payload
    const payload = {
      userId: user?.uid,
      busId: bus?.id,
      seatIds: selectedSeats.map(seat => seat.id),
      storageItems: quantities,
      totalPrice: grandTotal,
      breakdown: {
        seatPrice: seatFee,
        storagePrice: storageFee,
      },
    };
    setLoading(true);

    try {
      // Get Firebase token
      const token = await user.getIdToken(false);

      // Call booking API
      const response = await fetch(`${API_BASE_URL}/transport/book`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.error === "INSUFFICIENT_BALANCE") {
          Alert.alert(
            "Insufficient Balance",
            data.message || "Your wallet balance is insufficient for this booking.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Top Up",
                onPress: () => router.push("/(tabs)/(ProfileScreens)/transactions"),
              },
            ]
          );
          return;
        }

        // Generic error
        throw new Error(data.error || "Booking failed");
      }

      // Success!
      console.log("✅ Booking successful:", data.reference);
      await refreshUserInfo();

      Alert.alert(
        "Booking Confirmed! 🎉",
        `Your booking has been confirmed.\n\nReference: ${data.reference}\nSeats: ${data.seatNumbers?.join(", ")}\n\nA confirmation email has been sent to ${userInfo?.email}`,
        [
          {
            text: "Done",
            onPress: () => router.replace("/(tabs)/(index)"),
            style: "cancel",
          },
        ]
      );

    } catch (error) {
      console.error("❌ Booking error:", error);
      
      Alert.alert(
        "Booking Failed",
        error.message || "Something went wrong. Please try again or contact support.",
        [
          {
            text: "Retry",
            onPress: () => handlePayment(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Balance Warning */}
        {!hasSufficientBalance && (
          <View style={styles.warningCard}>
            <Ionicons name="alert-circle" size={20} color={colors.dange}r />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Insufficient Balance</Text>
              <Text style={styles.warningText}>
                You need GH₵{(grandTotal - userBalance).toFixed(2)} more to complete this booking.
              </Text>
            </View>
          </View>
        )}

        {/* Trip Info */}
        <TripInfoCard bus={bus} selectedSeats={selectedSeats} />

        {/* Passenger Info */}
        <PassengerInfoCard userInfo={userInfo} user={user} />

        {/* Price Breakdown */}
        <PriceBreakdownCard
          selectedSeats={selectedSeats}
          seatFee={seatFee}
          quantities={quantities}
          storageFee={storageFee}
          grandTotal={grandTotal}
        />
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom || (Platform.OS === "android" ? 16 : 12) },
        ]}
      >
        <Button
          title={hasSufficientBalance ? `Pay GH₵${grandTotal.toFixed(2)}` : "Insufficient Balance"}
          onPress={handlePayment}
          icon={hasSufficientBalance ? "lock-closed" : "alert-circle"}
          loading={loading}
        iconPosition="right"
        />
        
        {hasSufficientBalance && (
          <Text style={styles.secureNote}>
            <Ionicons name="shield-checkmark-outline" size={12} color={colors.textMuted} /> Your payment is secure
          </Text>
        )}
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSunken },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.danger,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: colors.danger,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  secureNote: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
});