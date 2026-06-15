import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StepSelectAccommodationScreen from './StepSelectAccommodationScreen';

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
        <TouchableOpacity
          style={[styles.button, !isReady && styles.buttonDisabled]}
          disabled={!isReady}
          onPress={handleBooking}
          activeOpacity={0.75}
        >
          {isReady && (
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.buttonText}>
            {isReady ? "Confirm booking" : "Select a room to continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEFEF",
  },
  eyebrow: {
    fontSize: 11,
    color: "#999",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#EFEFEF",
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
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default BookingStepper;