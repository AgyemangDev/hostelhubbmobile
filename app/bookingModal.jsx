import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { UserContext } from '../context/UserContext';
import { useAccommodationById } from '../hooks/accommodationContext/useAccommodationById';
import { useBookingForm } from '../hooks/useBookingForm';
import { handleBookingProcess } from '../services/bookingServices';

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
  const { userInfo } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.SELECT);

  const { accommodation: hostelData, loading } = useAccommodationById(hostelId);
  const { formData, handleInputChange, resetFormData } = useBookingForm();

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

  const handleSelectPaymentRange = (roomType, price, available) => {
    if (!available) {
      Alert.alert('Room Unavailable', 'This room type is not available.');
      return;
    }
    handleInputChange('selectedRoomType', roomType);
    handleInputChange('selectedPayment', price);
  };

  const handleBooking = async () => {
    if (!formData.selectedRoomType || !formData.selectedPayment) {
      Alert.alert('Incomplete Selection', 'Please select a room.');
      return;
    }

    setCurrentStep(BOOKING_STEPS.PROCESSING);

    await handleBookingProcess({
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
      onFinally: () => {
        // This runs after everything, but we handle state in onSuccess/onError
      },
    });
  };

  // 1️⃣ Initial loading
  if (loading) {
    return <LoadingState message="Loading accommodation..." />;
  }

  // 2️⃣ Booking in progress
  if (currentStep === BOOKING_STEPS.PROCESSING) {
    return <LoadingState message="Finalizing your booking 📦" />;
  }

  // 3️⃣ Booking success
  if (currentStep === BOOKING_STEPS.SUCCESS) {
    return (
      <StepBookingSuccessScreen
        hostelName={hostelData.accommodation_name}
        onDone={() => router.replace('(tabs)/(bookings)')}
      />
    );
  }

  // 4️⃣ Hostel not found
  if (!hostelData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Accommodation not found.</Text>
      </View>
    );
  }

  // 5️⃣ Selection step
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
    alignItems: 'center' 
  },
});

export default BookingModal;