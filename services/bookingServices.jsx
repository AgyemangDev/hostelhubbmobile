import { Alert } from 'react-native';
import { supabase } from '../app/firebase/supabaseConfig';
import uuid from 'react-native-uuid';
import { BOOKING_MESSAGES } from '../constants/bookingConstants';
import { isFirstTimeBooker, hasValidAccess } from '../utils/booking/bookingValidation';
import { handleSubscriptionPayment } from '../utils/booking/subscriptionService';
import { sendBookingConfirmationEmail } from '../utils/booking/emailService';

/**
 * MAIN ENTRY: Handles full booking process
 */
export const handleBookingProcess = async ({
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
    // Check for first-time booker
    if (isFirstTimeBooker(userInfo)) {
      await createBooking({ userInfo, formData, hostelId, hostelData });
      
      // Wait 3 seconds to show the loading state
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        BOOKING_MESSAGES.FIRST_TIME_SUCCESS.title,
        BOOKING_MESSAGES.FIRST_TIME_SUCCESS.message,
        [{ text: 'OK', onPress: onSuccess }]
      );
      return;
    }

    // Check subscription access for returning users
    const hasActiveAccess = hasValidAccess(userInfo);

    if (!hasActiveAccess) {
      const paid = await handleSubscriptionPayment({ userInfo, router });
      
      if (!paid) {
        // User cancelled or insufficient balance - show cancellation message
        Alert.alert(
          'Booking Not Completed',
          'Your booking was not completed. Please try again when ready.',
          [{ text: 'OK', onPress: onError }]
        );
        return;
      }
    }

    // Create booking for returning user
    await createBooking({ userInfo, formData, hostelId, hostelData });
    
    // Wait 3 seconds to show the loading state
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    Alert.alert(
      BOOKING_MESSAGES.BOOKING_SUCCESS.title,
      BOOKING_MESSAGES.BOOKING_SUCCESS.message,
      [{ text: 'OK', onPress: onSuccess }]
    );
  } catch (err) {
    console.error('Booking error:', err);

    if (err.shouldShowAlert !== false) {
      Alert.alert(
        BOOKING_MESSAGES.BOOKING_ERROR.title,
        BOOKING_MESSAGES.BOOKING_ERROR.message,
        [{ text: 'OK', onPress: onError }]
      );
    } else {
      onError();
    }
  } finally {
    onFinally();
  }
};

const createBooking = async ({ userInfo, formData, hostelId, hostelData }) => {
  try {
    const bookingData = {
      id: uuid.v4(),
      student_id: userInfo.id,
      accommodation_id: hostelId,
      accommodation_owner_id: hostelData.manager_id,
      room_type: formData.selectedRoomType,
      payment_option: parseFloat(formData.selectedPayment),
      status: 'pending',
      booking_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      type: 'accommodation',
    };

    const { data, error: bookingError } = await supabase
      .from('accommodation_booking')
      .insert(bookingData)
      .select();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      const error = new Error('Unable to submit your booking. Please try again.');
      error.shouldShowAlert = true;
      throw error;
    }

    await updateUserBookingCount(userInfo.id, userInfo.noofbooking);

    const emailData = {
      customerEmail: formData.email,
      hostelName: hostelData.accommodation_name,
      roomType: formData.selectedRoomType,
      bookerName: formData.fullName,
    };

    sendBookingConfirmationEmail(emailData).catch((emailErr) => {
      console.error('Email notification error:', emailErr);
    });

  } catch (err) {
    if (!err.shouldShowAlert) {
      err.shouldShowAlert = true;
    }
    throw err;
  }
};

const updateUserBookingCount = async (userId, currentCount) => {
  const { error } = await supabase
    .from('Student_Users')
    .update({
      noofbooking: (currentCount || 0) + 1,
    })
    .eq('id', userId);

  if (error) {
    console.error('User update error:', error);
  }
};