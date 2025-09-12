import React, { useState, useContext } from "react";
import {View,Text,TouchableOpacity,StyleSheet,Alert,ActivityIndicator,} from "react-native";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { itemPricing } from "../../assets/data/itemData";
import { db } from "../../app/firebase/FirebaseConfig";
import { doc, setDoc, collection } from 'firebase/firestore';

const NavigationButtons = ({ prevStep, handleSubmit, formData }) => {
  const { userInfo } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generateBookingReference = () => {
    const prefix = "HH";
    const timestampPart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestampPart}-${randomPart}`;
  };

const handlePayment = async () => {
  setLoading(true);

  const pricedItems = formData.items.map((item) => {
    const unitPrice = itemPricing[item.category] || 0;
    return {
      ...item,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
  });

  // Calculate raw total
  const totalPriceRaw = pricedItems.reduce((total, item) => total + item.totalPrice, 0);

  // Add 1.95% surcharge
  const totalPrice = parseFloat((totalPriceRaw * 1.0195).toFixed(2));

  const bookingReference = generateBookingReference();
  const bookingDate = new Date().toLocaleDateString("en-GB");

  const reservationData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    pickupDate: formData.pickupDate,
    deliveryDate: formData.deliveryDate,
    pickupLocation: formData.pickupLocation,
    deliveryLocation: formData.deliveryLocation,
    items: pricedItems,
    baseTotal: totalPriceRaw, // optional: raw price before 1.95%
    totalPrice,               // final price with 1.95%
    bookingReference,
    bookingDate,
    userId: userInfo.id,
    status: "order_placed",
    pickup_date: null,
    out_for_delivery_date: null,
    delivered_date: null,
  };

  if (userInfo.balance >= totalPrice) {
    try {
      const newBalance = userInfo.balance - totalPrice;
      const transactionId = Date.now().toString(); // Unique ID based on timestamp

      // Create transaction record
      const transactionRef = doc(collection(db, "transaction"), transactionId);
      await setDoc(transactionRef, {
        userId: userInfo.id,
        amount: totalPrice,
        status: "completed",
        createdAt: new Date(),
        method: "Storage Payment",
        reference: bookingReference,
      });

      // Update user's balance
      const userRef = doc(db, "Student_Users", userInfo.id);
      await setDoc(
        userRef,
        {
          balance: newBalance,
        },
        { merge: true }
      );

      // Add reservation data to the "Storage" collection
      const reservationRef = doc(collection(db, "Storage"), bookingReference);
      await setDoc(reservationRef, reservationData);

      // Send confirmation email
      const response = await fetch("https://hostelhubbbackend.onrender.com/api/storage-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) throw new Error("Failed to send reservation email");

      console.log("Reservation email sent successfully.");
      handleSubmit(reservationData);
    } catch (error) {
      console.error("Payment processing failed:", error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  } else {
    Alert.alert(
      "Insufficient Balance",
      "You have insufficient balance. Kindly top up your balance to continue.",
      [
        {
          text: "Top Up Balance",
          onPress: () => router.push("(ProfileScreens)/transactions"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  }

  setLoading(false);
};


  return (
    <View style={styles.navigationButtons}>
      <TouchableOpacity
        style={[styles.backButton, loading && styles.disabledButton]}
        onPress={prevStep}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!formData.agreeToTerms || loading) && styles.disabledButton,
        ]}
        onPress={handlePayment}
        disabled={!formData.agreeToTerms || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default NavigationButtons;
