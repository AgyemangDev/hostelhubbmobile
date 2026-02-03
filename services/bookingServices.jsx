import { Alert } from 'react-native';
import { BOOKING_MESSAGES } from '../constants/bookingConstants';
import { isFirstTimeBooker, hasValidAccess } from '../utils/booking/bookingValidation';
import { handleSubscriptionPayment } from '../utils/booking/subscriptionService';
import API_BASE_URL from '../utils/api/api';

/**
 * MAIN ENTRY: Handles full booking process
 * All DB and email logic now lives in the backend endpoint.
 */
export const handleBookingProcess = async ({
  user, // <-- Now passed as parameter instead of using useContext
  userInfo,
  formData,
  hostelId,
  hostelData,
  router,
  onSuccess,
  onError,
  onFinally,
}) => {
  try {
    if (!user || !userInfo) throw new Error("User not logged in");

    // 1️⃣ Check subscription access for returning users
    if (!isFirstTimeBooker(userInfo)) {
      const hasActiveAccess = hasValidAccess(userInfo);

      if (!hasActiveAccess) {
        const paid = await handleSubscriptionPayment({ userInfo, router });
        if (!paid) {
          Alert.alert(
            'Booking Not Completed',
            'Your booking was not completed. Please try again when ready.',
            [{ text: 'OK', onPress: onError }]
          );
          return;
        }
      }
    }

    // 2️⃣ Get Firebase ID token (cached to avoid quota issues)
    const token = await user.getIdToken(false);
    if (!token) throw new Error("Failed to get authentication token");

    // 3️⃣ Call backend endpoint
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        hostelId,
        selectedRoomType: formData.selectedRoomType,
        selectedPayment: parseFloat(formData.selectedPayment),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Booking failed');
    }

    // 4️⃣ Notify user of success
    Alert.alert(
      isFirstTimeBooker(userInfo)
        ? BOOKING_MESSAGES.FIRST_TIME_SUCCESS.title
        : BOOKING_MESSAGES.BOOKING_SUCCESS.title,
      isFirstTimeBooker(userInfo)
        ? BOOKING_MESSAGES.FIRST_TIME_SUCCESS.message
        : BOOKING_MESSAGES.BOOKING_SUCCESS.message,
      [{ text: 'OK', onPress: onSuccess }]
    );

  } catch (err) {
    console.error('Booking error:', err);

    Alert.alert(
      BOOKING_MESSAGES.BOOKING_ERROR.title,
      BOOKING_MESSAGES.BOOKING_ERROR.message,
      [{ text: 'OK', onPress: onError }]
    );
  } finally {
    if (onFinally) onFinally();
  }
};