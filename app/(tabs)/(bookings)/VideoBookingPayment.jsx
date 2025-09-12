import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc, increment, setDoc, collection } from "firebase/firestore";
import TermsLink from "../../../components/Links/TermsLink";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { db } from "../../firebase/FirebaseConfig";

const VideoBookingPayment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const router = useRouter();
  const { bookingData, hostelData } = route.params;
  const { userInfo } = useContext(UserContext);
  
  const hostelPrice = parseFloat(bookingData.selectedPayment || "0.00");
  const roomType = bookingData.selectedRoomType;
  const bookingid = bookingData.id;
const transactionFee = hostelPrice * 0.01;
  const totalAmount = hostelPrice + transactionFee;
  const hostelName = hostelData.hostelName || bookingData.hostelName || "Hostel Name";
  const hostelLocation = bookingData.institution || "Location";
  const [loading, setLoading] = useState(false);

  const bookerName = `${userInfo.firstName} ${userInfo.surname}`;
  const bookerEmail = userInfo.email;
  const adminEmail = bookingData.adminEmail || "hostelhubbofficial@gmail.com";

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Fetch user's balance
      const userDocRef = doc(db, "Student_Users", bookingData.userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        Alert.alert("Error", "User data not found.");
        setLoading(false);
        return;
      }

      const userBalance = userSnapshot.data().balance;

      if (userBalance < totalAmount) {
        Alert.alert(
          "Insufficient Funds",
          "You don't have enough funds in your account. Please top up.",
          [{ text: "Go to Transactions", onPress: () => router.push("(ProfileScreens)/transactions") }]
        );
        setLoading(false);
        return;
      }

      Alert.alert(
        "Confirm Payment",
        `Do you want to pay ₵${totalAmount} for ${hostelName}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setLoading(false);
            },
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                // Deduct money from user balance
                await updateDoc(userDocRef, {
                  balance: increment(-totalAmount),
                });
              } catch (error) {
                console.error("Error deducting from user balance:", error);
                Alert.alert("Payment Error", "Failed to update user balance. Please try again.");
                setLoading(false);
                return;
              }

              // Update booking status to paid
              const bookingDocRef = doc(db, "Bookings", bookingData.id);
              try {
                await updateDoc(bookingDocRef, {
                  paymentStatus: true,
                  paymentDate: new Date(),
                });
              } catch (error) {
                console.error("Error updating booking status:", error);
                Alert.alert("Payment Error", "Failed to update booking status. Please try again.");
                setLoading(false);
                return;
              }

              // Add transaction record for payment (no adminId since no admin)
              const transactionId = `${bookingData.userId}_${bookingData.id}_${Date.now()}`;
              const transactionRef = doc(collection(db, "transaction"), transactionId);
              try {
                await setDoc(transactionRef, {
                  userId: bookingData.userId,
                  amount: totalAmount,
                  status: "completed",
                  createdAt: new Date(),
                  method: "Video Booking Payment",
                  reference: "Video Booking Payment",
                  hostelName: hostelName,
                  bookingType: "hosVideoBook"
                });
              } catch (error) {
                console.error("Error recording transaction:", error);
                Alert.alert("Payment Error", "Failed to record transaction. Please try again.");
                setLoading(false);
                return;
              }

              // Update referred user's balance if applicable
              if (userInfo.referredBy) {
                const referredByDocRef = doc(db, "Student_Users", userInfo.referredBy);
                try {
                  await updateDoc(referredByDocRef, {
                    balance: increment(5),
                  });

                  // Add transaction record for referral bonus
                  const referralTransactionId = `${userInfo.referredBy}_referral_${Date.now()}`;
                  const referralTransactionRef = doc(collection(db, "transaction"), referralTransactionId);
                  await setDoc(referralTransactionRef, {
                    userId: userInfo.referredBy,
                    amount: 5,
                    status: "completed",
                    createdAt: new Date(),
                    method: "Referral Bonus",
                    reference: "Referral Bonus"
                  });
                } catch (error) {
                  console.error("Error updating referred user's balance:", error);
                }
              }

              // Send payment receipt email
              try {
                await axios.post("https://hostelhubbbackend.onrender.com/api/payments/send-payment-receipt", {
                  bookerName: bookerName,
                  hostelPrice: totalAmount, // Full amount goes to HostelHubb for video bookings
                  totalAmount: totalAmount,
                  adminEmail: adminEmail, // HostelHubb email
                  bookerEmail: bookerEmail,
                  hostelName: hostelName,
                  roomType: roomType,
                  bookingId: bookingid,
                  bookingType: "Video Booking"
                });
                console.log("Receipt email sent successfully");
              } catch (error) {
                console.error("Error sending receipt email:", error);
                Alert.alert("Email Error", "Failed to send receipt email. Please try again.");
                setLoading(false);
                return;
              }

              setLoading(false);
              Alert.alert(
                "Payment Successful",
                `You have successfully paid ₵${totalAmount} for ${hostelName}. Your video booking is confirmed. Thank you for choosing HostelHubb!`,
                [{ text: "OK", onPress: () => navigation.goBack() }]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Payment Error", "Something went wrong with the payment process. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>HostelHubb Secured Payments</Text>

      {/* Hostel Information */}
      <View style={styles.hostelInfoContainer}>
        <Text style={styles.hostelName}>{hostelName}</Text>
        <Text style={styles.hostelLocation}>{hostelLocation}</Text>
        <Text style={styles.roomType}>{roomType}</Text>
        
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Hostel Fee:</Text>
            <Text style={styles.priceValue}>₵{hostelPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Transaction Fee (1%):</Text>
            <Text style={styles.priceValue}>₵{transactionFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₵{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Pay Button */}
      <View style={styles.payButtonContainer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
          <Ionicons name="cash-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.payButtonText}>Pay ₵{totalAmount.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Terms Link */}
      <TermsLink 
        link={"https://hostelhubb.com/cookie-policy"} 
        text={"Please, Read Our Payment Terms and Conditions"}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#8e0002" style={styles.loadingIndicator} />
        </View>
      )}
    </ScrollView>
  );
};

export default VideoBookingPayment;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8e0002",
    textAlign: "center",
    marginBottom: 30,
  },
  hostelInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  hostelLocation: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  roomType: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 20,
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  priceValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8e0002",
  },
  payButtonContainer: {
    marginBottom: 20,
  },
  payButton: {
    flexDirection: "row",
    backgroundColor: "#8e0002",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(128, 128, 128, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});