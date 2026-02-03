import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { UserContext } from '../context/UserContext';
import { useAccommodationById } from '../hooks/accommodationContext/useAccommodationById';
import { useBookingForm } from '../hooks/useBookingForm';
import { handleBookingProcess } from '../services/bookingServices';
import notificationService from './firebase/notificationService';

import BookingStepper from '../components/BookingModalComponents/BookingStepper';
import LoadingState from '../components/BookingModalComponents/LoadingState';
import StepBookingSuccessScreen from '../components/BookingModalComponents/StepBookingSuccessScreen';

const BOOKING_STEPS = {
  SELECT: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
};

const BookingModal = () => {
  const { hostelId } = useLocalSearchParams();
  const router = useRouter();

  const { user, userInfo, patchUserData } = useContext(UserContext);

  const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.SELECT);
  const [currentExpoToken, setCurrentExpoToken] = useState(null);

  const { accommodation: hostelData, loading } =
    useAccommodationById(hostelId);

  const { formData, handleInputChange, resetFormData } =
    useBookingForm();

  /* --------------------------------------------------
     GET CURRENT DEVICE EXPO TOKEN
  -------------------------------------------------- */
  useEffect(() => {
    const fetchExpoToken = async () => {
      if (!user) return;
      try {
        const token =
          await notificationService.registerForPushNotifications(
            user.uid
          );
        setCurrentExpoToken(token);
      } catch (err) {
        console.error('❌ Failed to get Expo token:', err);
      }
    };

    fetchExpoToken();
  }, [user]);

  /* --------------------------------------------------
     VALIDATE TOKEN
  -------------------------------------------------- */
  const hasValidExpoToken = () => {
    if (!userInfo?.expo_token) return false;
    if (!currentExpoToken) return false;
    return userInfo.expo_token === currentExpoToken;
  };

  /* --------------------------------------------------
     PAYMENT RANGES
  -------------------------------------------------- */

  const paymentRanges = useMemo(() => {
    if (!hostelData?.room_types) return {};

    return hostelData.room_types.reduce((acc, room) => {
      const key = room.room_type;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        description: room.description,
        price: room.price,
        roomsAvailable: room.rooms_available,
        available: room.room_availability,
      });
      return acc;
    }, {});
  }, [hostelData]);

  /* --------------------------------------------------
     ROOM SELECTION
  -------------------------------------------------- */
  const handleSelectPaymentRange = (
    roomType,
    price,
    available
  ) => {
    if (!available) {
      Alert.alert(
        'Room Unavailable',
        'This room type is not available.'
      );
      return;
    }
    handleInputChange('selectedRoomType', roomType);
    handleInputChange('selectedPayment', price);
  };

  /* --------------------------------------------------
     MAIN BOOKING HANDLER (WITH TOKEN GUARD)
  -------------------------------------------------- */
  const handleBooking = async () => {
    if (!formData.selectedRoomType || !formData.selectedPayment) {
      Alert.alert(
        'Incomplete Selection',
        'Please select a room.'
      );
      return;
    }

    // 🔔 BLOCK BOOKING IF NO VALID EXPO TOKEN
    if (hasValidExpoToken()) {
      Alert.alert(
        'Enable Notifications',
        'You must enable notifications to continue with booking.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: async () => {
              try {
                const expoToken =
                  currentExpoToken ||
                  (await notificationService.registerForPushNotifications(
                    user.uid
                  ));

                if (!expoToken) return;

                await patchUserData({
                  expo_token: expoToken,
                  last_interacted: new Date().toISOString(),
                });

                // ✅ Retry booking AFTER token is saved
                handleBooking();
              } catch (err) {
                console.error(err);
                Alert.alert(
                  'Error',
                  'Failed to enable notifications.'
                );
              }
            },
          },
        ]
      );
      return;
    }

    // 🚀 TOKEN OK → PROCEED
    setCurrentStep(BOOKING_STEPS.PROCESSING);

    await handleBookingProcess({
      user, // <-- PASS user from context
      userInfo,
      formData,
      hostelId,
      hostelData,
      router,
      onSuccess: () => {
        resetFormData();
        setCurrentStep(BOOKING_STEPS.SUCCESS);
      },
      onError: () => {
        setCurrentStep(BOOKING_STEPS.SELECT);
      },
    });
  };

  /* --------------------------------------------------
     UI STATES
  -------------------------------------------------- */

  if (loading) {
    return <LoadingState message="Loading accommodation..." />;
  }

  if (currentStep === BOOKING_STEPS.PROCESSING) {
    return <LoadingState message="Finalizing your booking 📦" />;
  }

  if (currentStep === BOOKING_STEPS.SUCCESS) {
    return (
      <StepBookingSuccessScreen
        hostelName={hostelData.accommodation_name}
        onDone={() => router.replace('(tabs)/(bookings)')}
      />
    );
  }

  if (!hostelData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Accommodation not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BookingStepper
        hostelData={{
          ...hostelData,
          paymentRanges,
        }}
        formData={formData}
        handleSelectPaymentRange={handleSelectPaymentRange}
        handleBooking={handleBooking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookingModal;