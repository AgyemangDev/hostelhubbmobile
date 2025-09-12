import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import AccountInfo from "../../../components/BookingsComponent/BookingProfile";
import { doc, getDoc, updateDoc, increment, setDoc, collection } from "firebase/firestore";
import TermsLink from "../../../components/Links/TermsLink";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { useAdmin } from "../../../context/ManagersContext";
import { db } from "../../firebase/FirebaseConfig";
import VideoBookingPayment from "./VideoBookingPayment"; // Import the new component

const PayNow = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const router = useRouter();
  const { bookingData, hostelData, adminId } = route.params;
  const { admins } = useAdmin();
  const adminData = admins.find((admin) => admin.id === adminId);

  // If adminData is not found, render VideoBookingPayment component
  if (!adminData) {
    console.log(`Admin with id ${adminId} not found. Rendering VideoBookingPayment component.`);
    return <VideoBookingPayment />;
  }

  const { userInfo } = useContext(UserContext);
  const hostelPrice = parseFloat(bookingData.selectedPayment || "0.00");
  const roomType = bookingData.selectedRoomType;
  const adminEmail = adminData.email || "agyemang";
  const bookingid = bookingData.id;
  const serviceFee = hostelPrice * 0.05;
  const transactionFee = hostelPrice * 0.01;
  const totalAmount = hostelPrice + serviceFee + transactionFee;
  const hostelName = hostelData.hostelName || "Hostel Name";
  const [loading, setLoading] = useState(false);

  const bookerName = `${userInfo.firstName} ${userInfo.surname}`;
  const bookerEmail = userInfo.email;

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
        `Do you want to pay ₵${totalAmount} to ${hostelName}?`,
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
                await updateDoc(userDocRef, {
                  balance: increment(-totalAmount),
                });
              } catch (error) {
                console.error("Error deducting from user balance:", error);
                Alert.alert("Payment Error", "Failed to update user balance. Please try again.");
                setLoading(false);
                return;
              }

              const adminDocRef = doc(db, "Admin_Users", adminId);
              try {
                await updateDoc(adminDocRef, {
                  balance: increment(hostelPrice),
                });
              } catch (error) {
                console.error("Error updating admin balance:", error);
                Alert.alert("Payment Error", "Failed to update admin balance. Please try again.");
                setLoading(false);
                return;
              }

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

              // Add transaction record for payment
              const transactionId = `${bookingData.userId}_${bookingData.id}_${Date.now()}`;
              const transactionRef = doc(collection(db, "transaction"), transactionId);
              try {
                await setDoc(transactionRef, {
                  userId: bookingData.userId,
                  amount: hostelPrice,
                  status: "completed",
                  createdAt: new Date(),
                  adminId: adminId,
                  method: "Hostel Payment",
                  reference: "Hostel Payment",
                  hostelName: hostelName
                });
              } catch (error) {
                Alert.alert("Payment Error", "Failed to record transaction. Please try again.");
                setLoading(false);
                return;
              }

              // Update referred user's balance and add referral transaction if applicable
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

              try {
                await axios.post("https://hostelhubbbackend.onrender.com/api/payments/send-payment-receipt", {
                  bookerName: bookerName,
                  hostelPrice,
                  serviceFee,
                  totalAmount,
                  adminEmail: adminEmail,
                  bookerEmail: bookerEmail,
                  hostelName,
                  roomType: roomType,
                  bookingId: bookingid,
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
                `You have successfully paid ₵${hostelPrice} to ${hostelName} and a service fee of ₵${serviceFee} to HostelHubb. Thank you for choosing HostelHubb!`,
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
      <Text style={styles.header}>Hostelhubb Secured Payments</Text>

      <AccountInfo 
        adminData={adminData} 
        bookingData={bookingData} 
        hostelData={hostelData} 
        serviceFee={serviceFee} 
        transactionFee={transactionFee}
      />
      
      <View>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
          <Ionicons name="cash-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.payButtonText}>Pay ₵{totalAmount.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      <TermsLink 
        link={"https://hostelhubb.com/cookie-policy"} 
        text={"Please, Read Our Payment Terms and Conditions"}
      />

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#8e0002" style={styles.loadingIndicator} />
        </View>
      )}
    </ScrollView>
  );
};

export default PayNow;

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
  },
  payButton: {
    flexDirection: "row",
    backgroundColor: "#8e0002",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 5,
    fontSize: 18,
    fontWeight: "600",
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
  payButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});