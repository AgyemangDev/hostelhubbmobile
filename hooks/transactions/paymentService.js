// app/(tabs)/(bookings)/services/paymentService.js
import { Alert } from "react-native";
import API_BASE_URL from "../../utils/api/api";

export const processPayment = async ({
  amount,
  bookingId,
  accommodationId,
  accommodationOwnerId,
  token, // <-- pass token from component
}) => {
  try {
    if (!token) throw new Error("No Firebase token provided");

    const response = await fetch(`${API_BASE_URL}/payment/hostelpayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingId,
        accommodationId,
        accommodationOwnerId,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Backend error:", data);
      throw new Error(data.message || "Payment failed");
    }

    Alert.alert(
      "Payment Successful",
      `You have paid GHS ${amount.toFixed(2)} successfully!`
    );

    return true;
  } catch (error) {
    console.error("❌ Payment error:", error);
    Alert.alert("Payment Failed", error.message || "Something went wrong.");
    return false;
  }
};