import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import StepSelectAccommodationScreen from './StepSelectAccommodationScreen';
import { Button } from "../../ui";
import { colors } from "../../../constants/theme";

const TEAL = "#0F6E56";

const BookingStepper = ({ hostelData, formData, handleSelectPaymentRange, handleBooking }) => {
  const isReady = formData.selectedPayment && formData.selectedRoomType;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Reservation</Text>
        <Text style={styles.title} numberOfLines={2}>
          {hostelData?.accommodation_name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StepSelectAccommodationScreen
          hostelData={hostelData}
          formData={formData}
          handleSelectPaymentRange={handleSelectPaymentRange}
        />
      </ScrollView>

      {/* Confirm button */}
      <View style={styles.footer}>
        <Button title={isReady ? "Confirm Reservation" : "Select a room to continue"} icon={isReady ? "checkmark-circle-outline" : undefined} disabled={!isReady} onPress={handleBooking} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  eyebrow: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  button: {
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.fill,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default BookingStepper;