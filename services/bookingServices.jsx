// services/bookingServices.js
import { Alert } from "react-native";
import { BOOKING_MESSAGES } from "../constants/bookingConstants";
import { isFirstTimeBooker, hasValidAccess } from "../utils/booking/bookingValidation";
import { handleSubscriptionPayment } from "../utils/booking/subscriptionService";
import API_BASE_URL from "../utils/api/api";
import { sendPushNotification } from "../hooks/notification/sendPushNotification";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleBookingProcess = async ({
  user,
  userInfo,
  formData,
  hostelId,
  bookingSource = 'accommodation', // 👈 ADD DEFAULT
  router,
  patchUserData,
  onSuccess,
  onError,
  onFinally,
  currentExpoToken,
  firebaseToken, // 👈 ACCEPT TOKEN AS PARAM
}) => {
  const requestId = `FE-${Date.now()}`;
  
  console.log(`[${requestId}] 🎬 Booking process started`, {
    hostelId,
    bookingSource,
    roomType: formData.selectedRoomType,
    payment: formData.selectedPayment,
    userEmail: userInfo?.email
  });

  try {
    if (!user || !userInfo) {
      console.error(`[${requestId}] ❌ User not logged in`);
      throw new Error("User not logged in");
    }

    // 1️⃣ Check subscription access
    console.log(`[${requestId}] 🔐 Checking subscription access...`);
    
    if (!isFirstTimeBooker(userInfo)) {
      const hasActiveAccess = hasValidAccess(userInfo);
      console.log(`[${requestId}] Subscription status:`, { hasActiveAccess });

      if (!hasActiveAccess) {
        console.log(`[${requestId}] 💳 Initiating subscription payment...`);
        
        const paid = await handleSubscriptionPayment({ 
          userInfo, 
          user,
          patchUserData,
          router 
        });

        if (!paid) {
          console.log(`[${requestId}] ⚠️ Payment cancelled by user`);
          Alert.alert(
            "Booking Not Completed",
            "Your booking was not completed. Please try again when ready.",
            [{ text: "OK", onPress: onError }]
          );
          return;
        }
        
        console.log(`[${requestId}] ✅ Payment completed`);
      }
    } else {
      console.log(`[${requestId}] 🎁 First time booker - no subscription required`);
    }

    // 2️⃣ Get Firebase ID token
    console.log(`[${requestId}] 🔑 Getting Firebase token...`);
    
    const token = firebaseToken || await user.getIdToken(false);
    
    if (!token) {
      console.error(`[${requestId}] ❌ Failed to get auth token`);
      throw new Error("Failed to get authentication token");
    }
    
    console.log(`[${requestId}] ✅ Token obtained`);

    // 3️⃣ Call backend endpoint
    const requestPayload = {
      hostelId,
      selectedRoomType: formData.selectedRoomType,
      selectedPayment: parseFloat(formData.selectedPayment),
      bookingSource, // 👈 SEND SOURCE
    };

    console.log(`[${requestId}] 📤 Sending booking request:`, requestPayload);

    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const result = await response.json();
    
    console.log(`[${requestId}] 📥 Backend response:`, {
      status: response.status,
      ok: response.ok,
      result
    });

    if (!response.ok) {
      console.error(`[${requestId}] ❌ Booking request failed:`, result);
      throw new Error(result.error || "Booking failed");
    }

    console.log(`[${requestId}] ✅ Booking created on server:`, result.booking?.id);

    // 4️⃣ Wait 5 seconds before sending push notification
    console.log(`[${requestId}] ⏳ Waiting 5s before push notification...`);
    await delay(5000);

    if (currentExpoToken) {
      console.log(`[${requestId}] 🔔 Sending push notification...`);
      
      await sendPushNotification({
        token: currentExpoToken,
        title: "Booking Submitted 🏠",
        body: "Your booking request has been sent. You will be notified once it is reviewed.",
        type: "booking",
      });
      
      console.log(`[${requestId}] ✅ Push notification sent`);
    } else {
      console.warn(`[${requestId}] ⚠️ No expo token - skipping push notification`);
    }

    // 5️⃣ Notify user of success
    console.log(`[${requestId}] 🎉 Showing success alert`);
    
    Alert.alert(
      isFirstTimeBooker(userInfo)
        ? BOOKING_MESSAGES.FIRST_TIME_SUCCESS.title
        : BOOKING_MESSAGES.BOOKING_SUCCESS.title,
      isFirstTimeBooker(userInfo)
        ? BOOKING_MESSAGES.FIRST_TIME_SUCCESS.message
        : BOOKING_MESSAGES.BOOKING_SUCCESS.message,
      [{ text: "OK", onPress: onSuccess }]
    );

  } catch (err) {
    console.error(`[${requestId}] 💥 Booking error:`, {
      error: err.message,
      stack: err.stack
    });

    Alert.alert(
      BOOKING_MESSAGES.BOOKING_ERROR.title,
      BOOKING_MESSAGES.BOOKING_ERROR.message,
      [{ text: "OK", onPress: onError }]
    );
  } finally {
    if (onFinally) {
      console.log(`[${requestId}] 🏁 Booking process finished`);
      onFinally();
    }
  }
};