import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../../app/firebase/FirebaseConfig";
import {
  doc,
  updateDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

const DELIVERY_FEE = 20;

const DeliveryStatusSection = ({
  status,
  bookingReference,
  onStatusUpdate,
  userInfo,
  setUserInfo,
  router
}) => {
  const [loading, setLoading] = useState(false);

  // 🔒 Only allow delivery confirmation after pickup
  if (status !== "picked_up") {
    return null;
  }

  const handleMarkDelivered = async () => {
    // ❌ Not enough balance
    if (userInfo.balance < DELIVERY_FEE) {
      Alert.alert(
        "Insufficient Balance",
        `Delivery fee is GH₵${DELIVERY_FEE}, but your balance is GH₵${userInfo.balance}.`,
        [
          {
            text: "Deposit",
            onPress: () => router.push("/(ProfileScreens)/transactions")
          },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }

    // ✅ Enough balance → confirm deduction
    Alert.alert(
      "Confirm Delivery",
      `Kindly do this on delivery. A delivery fee of GH₵${DELIVERY_FEE} will be deducted from your wallet.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: async () => {
            try {
              setLoading(true);

              const newBalance = userInfo.balance - DELIVERY_FEE;
              const transactionId = Date.now().toString();

              // 1️⃣ Log transaction
              await setDoc(doc(db, "transaction", transactionId), {
                userId: userInfo.id,
                amount: DELIVERY_FEE,
                status: "completed",
                createdAt: new Date(),
                method: "Wallet Deduction",
                reference: "Storage Delivery Fee",
                bookingReference
              });

              // 2️⃣ Deduct wallet balance
              await updateDoc(doc(db, "Student_Users", userInfo.id), {
                balance: newBalance
              });

              // 3️⃣ Update booking status
              await updateDoc(doc(db, "Storage", bookingReference), {
                status: "delivered",
                delivered_date: serverTimestamp()
              });

              // 4️⃣ Update local state
              setUserInfo?.({
                ...userInfo,
                balance: newBalance
              });

              onStatusUpdate?.("delivered");

              Alert.alert(
                "Success",
                "Order marked as delivered successfully."
              );
            } catch (error) {
              console.error("Delivery error:", error);
              Alert.alert(
                "Error",
                "Failed to complete delivery. Please try again."
              );
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.85 }
        ]}
        onPress={handleMarkDelivered}
        disabled={loading}
      >
        <MaterialCommunityIcons
          name="truck-check-outline"
          size={18}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Confirm Delivery"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16
  },

  button: {
    backgroundColor: "#047857",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700"
  }
});

export default DeliveryStatusSection;
