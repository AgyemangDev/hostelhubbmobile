import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, SafeAreaView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { UserContext } from '../context/UserContext';
import { useHostels } from '../context/HostelsContext';
import { useAdmin } from '../context/ManagersContext';
import { useBookingForm } from '../hooks/useBookingForm';
import { handleBookingProcess } from '../services/bookingServices';


import BookingStepper from '../components/BookingModalComponents/BookingStepper';
import LoadingState from '../components/BookingModalComponents/LoadingState';

const BookingModal = () => {
  const { hostelId, managerId } = useLocalSearchParams();
  const { hostels, isloading } = useHostels();
  const { admins } = useAdmin();
  const { userInfo } = useContext(UserContext);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { formData, handleInputChange, setInitialFormData, resetFormData } = useBookingForm();

  const hostelData = hostels.find((item) => item.id === hostelId);
  const admin = admins.find((admin) => admin.id === managerId);
  const managerEmail = admin?.email;

  useEffect(() => {
    if (userInfo) {
      setInitialFormData({
        fullName: `${userInfo.firstName} ${userInfo.surname}`,
        email: userInfo.email,
        phone: userInfo.phoneNumber,
        gender: userInfo.gender,
      });
    }
  }, [userInfo]);

  const handleSelectPaymentRange = (roomType, price, roomAvailability) => {
    if (roomAvailability) {
      handleInputChange('selectedRoomType', roomType);
      handleInputChange('selectedPayment', price);
    } else {
      Alert.alert('Room Unavailable', 'This room type is not available.');
    }
  };

  const isStepOneComplete = () => {
    const { fullName, email, phone, gender, program, college, emergencyContactName, emergencyContactNumber } = formData;
    return fullName && email && phone && gender && program && college && emergencyContactName && emergencyContactNumber;
  };

  const isBookingReady = () => {
    return formData.selectedPayment && formData.selectedRoomType;
  };

const handleBooking = () => {
  if (!isBookingReady()) {
    Alert.alert('Incomplete Room Selection', 'Please select a room and payment range.');
    return;
  }

  setIsProcessing(true);

  handleBookingProcess({
    userInfo,
    formData,
    hostelId,
    managerId,
    hostelData,
    managerEmail,
    router,
    onSuccess: () => {
      resetFormData();
      router.back();
    },
    onError: () => {
      Alert.alert('Booking Failed', 'Please try again.');
    },
    onFinally: () => {
      setIsProcessing(false);
    },
  });
};




  if (isloading || isProcessing) {
    return (
      <LoadingState
        isLoading={isloading}
        message={isloading ? 'Loading...' : 'Processing your booking...'}
      />
    );
  }

  if (!hostelData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Hostel not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BookingStepper
        step={step}
        setStep={setStep}
        hostelData={hostelData}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectPaymentRange={handleSelectPaymentRange}
        isStepOneComplete={isStepOneComplete}
        handleBooking={handleBooking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BookingModal;
