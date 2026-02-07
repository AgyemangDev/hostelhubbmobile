import React, { useContext, useState, useMemo } from "react";
import { View, Text, Alert, SafeAreaView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { UserContext } from "../context/UserContext";
import { useAccommodationById } from "../hooks/accommodationContext/useAccommodationById";
import { useBookingForm } from "../hooks/useBookingForm";
import { useNotificationPermission } from "../hooks/notification/useNotificationPermission";
import { handleBookingProcess } from "../services/bookingServices";

import BookingStepper from "../components/BookingModalComponents/BookingStepper";
import LoadingState from "../components/BookingModalComponents/LoadingState";
import StepBookingSuccessScreen from "../components/BookingModalComponents/StepBookingSuccessScreen";

const BOOKING_STEPS = {
  SELECT: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
};

const BookingModal = () => {
  const { hostelId } = useLocalSearchParams();
  const router = useRouter();

  const { user, userInfo, patchUserData } = useContext(UserContext); // <-- GET patchUserData
  const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.SELECT);

  const { currentExpoToken, ensureNotificationsEnabled } = useNotificationPermission();
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
      Alert.alert("Room Unavailable", "This room type is not available.");
      return;
    }
    handleInputChange("selectedRoomType", roomType);
    handleInputChange("selectedPayment", price);
  };

  const handleBooking = async () => {
    if (!formData.selectedRoomType || !formData.selectedPayment) {
      Alert.alert("Incomplete Selection", "Please select a room.");
      return;
    }

    const hasNotifications = await ensureNotificationsEnabled({
      title: "Enable Notifications",
      message: "Turn on notifications to receive updates when your booking is accepted, declined, or ready for payment.",
    });

    if (!hasNotifications) return;

    setCurrentStep(BOOKING_STEPS.PROCESSING);

    await handleBookingProcess({
      user,
      userInfo,
      formData,
      hostelId,
      router,
      patchUserData, // <-- PASS THIS
      currentExpoToken,
      onSuccess: () => {
        resetFormData();
        setCurrentStep(BOOKING_STEPS.SUCCESS);
      },
      onError: () => setCurrentStep(BOOKING_STEPS.SELECT),
    });
  };

  if (loading) return <LoadingState message="Loading accommodation..." />;
  if (currentStep === BOOKING_STEPS.PROCESSING)
    return <LoadingState message="Finalizing your booking 📦" />;
  if (currentStep === BOOKING_STEPS.SUCCESS)
    return (
      <StepBookingSuccessScreen
        hostelName={hostelData.accommodation_name}
        onDone={() => router.replace("(tabs)/(index)")}
      />
    );
  if (!hostelData)
    return (
      <View style={styles.errorContainer}>
        <Text>Accommodation not found.</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <BookingStepper
        hostelData={{ ...hostelData, paymentRanges }}
        formData={formData}
        handleSelectPaymentRange={handleSelectPaymentRange}
        handleBooking={handleBooking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default BookingModal;