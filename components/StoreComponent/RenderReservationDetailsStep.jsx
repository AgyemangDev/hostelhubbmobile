import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomCalendar from "./CustomCalendar";
import DeliveryDateSelector from "./DeliverDateSelector";
import { BackButton, ContinueButton } from "./NavigationButton";

const ReservationDetailsStep = ({ formData, setFormData, nextStep, prevStep }) => {
  const [focusedField, setFocusedField] = useState(null);
  
  // Define pickup date range (mid-August to September 14th, 2025)
  const pickupStartDate = "2025-08-27"; // Mid August
  const pickupEndDate = "2025-09-12";   // September 14th
  
  const handleNext = () => {
    let missingFields = [];

    if (!formData.pickupDate) missingFields.push("Pick-up Date");
    if (!formData.pickupLocation) missingFields.push("Pick-up Location");
    if (!formData.deliveryDate) missingFields.push("Delivery Date");

    if (!formData.deliveryLocation && !formData.isUnsureDelivery) {
      missingFields.push("Delivery Location");
    }

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `The following fields are required:\n• ${missingFields.join("\n• ")}`
      );
      return;
    }

    nextStep();
  };

  const handlePickupDateSelect = (date) => {
    setFormData({ ...formData, pickupDate: date });
  };

  const handleDeliveryDateSelect = (date) => {
    setFormData({ ...formData, deliveryDate: date });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Reservation Details</Text>
      
      {/* Pick-Up Info */}
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialIcons name="event" size={24} color="#4A6FA5" />
          <Text style={styles.headerText}>Pick-Up Information</Text>
        </View>
        
        {/* Custom Calendar for Pickup */}
        <CustomCalendar
          startDate={pickupStartDate}
          endDate={pickupEndDate}
          selectedDate={formData.pickupDate}
          onDateSelect={handlePickupDateSelect}
          title="Select Pick-Up Date"
          disabledDates={[]} // Add any disabled dates here if needed
        />
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Pick-Up Location</Text>
          <View style={[
            styles.inputWrapper,
            focusedField === 'pickup' && styles.inputWrapperFocused,
            formData.pickupLocation && styles.inputWrapperFilled
          ]}>
            <MaterialIcons 
              name="location-on" 
              size={20} 
              color={focusedField === 'pickup' ? "#4A6FA5" : "#9CA3AF"} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your current hall/hostel (e.g. Unity Hall Room 14A)"
              placeholderTextColor="#9CA3AF"
              value={formData.pickupLocation}
              onChangeText={(text) => setFormData({ ...formData, pickupLocation: text })}
              onFocus={() => setFocusedField('pickup')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      </View>

      {/* Delivery Info */}
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialIcons name="local-shipping" size={24} color="#4A6FA5" />
          <Text style={styles.headerText}>Delivery Information</Text>
        </View>
        
        {/* Custom Delivery Date Selector */}
        <DeliveryDateSelector
          selectedDate={formData.deliveryDate}
          onDateSelect={handleDeliveryDateSelect}
          title="School Resumption Delivery Schedule"
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Delivery Location</Text>
          <View style={[
            styles.inputWrapper,
            focusedField === 'delivery' && styles.inputWrapperFocused,
            formData.deliveryLocation && styles.inputWrapperFilled,
            formData.isUnsureDelivery && styles.inputWrapperDisabled
          ]}>
            <MaterialIcons 
              name="home" 
              size={20} 
              color={
                formData.isUnsureDelivery 
                  ? "#9CA3AF" 
                  : focusedField === 'delivery' 
                    ? "#4A6FA5" 
                    : "#9CA3AF"
              } 
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                formData.isUnsureDelivery && styles.inputDisabled
              ]}
              placeholder="Enter your next hostel/location"
              placeholderTextColor="#9CA3AF"
              value={formData.deliveryLocation}
              editable={!formData.isUnsureDelivery}
              onChangeText={(text) => setFormData({ ...formData, deliveryLocation: text })}
              onFocus={() => setFocusedField('delivery')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Unsure Option with Radio Button */}
        <View style={styles.unsureContainer}>
          <Text style={styles.helperText}>
            If unsure, leave blank and contact HostelHubb.{'\n'}
            Ensure to let us know before a week school resumes.
          </Text>
          
          <TouchableOpacity
            style={styles.unsureOption}
            onPress={() => setFormData({ 
              ...formData, 
              isUnsureDelivery: !formData.isUnsureDelivery, 
              deliveryLocation: formData.isUnsureDelivery ? formData.deliveryLocation : "" 
            })}
            activeOpacity={0.7}
          >
            <View style={[
              styles.radioCircle,
              formData.isUnsureDelivery && styles.radioCircleSelected
            ]}>
              {formData.isUnsureDelivery && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={[
              styles.unsureText,
              formData.isUnsureDelivery && styles.unsureTextSelected
            ]}>
              I'm unsure about my delivery location
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <View style={styles.navigationButtons}>
          <BackButton onPress={prevStep} />
          <ContinueButton onPress={handleNext} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ReservationDetailsStep;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 150,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 5,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#4A6FA5",
    marginLeft: 12,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginTop: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 6,
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: "#4A6FA5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
    transform: [{ scale: 1.01 }],
  },
  inputWrapperFilled: {
    backgroundColor: "#FFFFFF",
    borderColor: "#10B981",
  },
  inputWrapperDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    opacity: 0.6,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 14,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  inputDisabled: {
    color: "#9CA3AF",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 16,
  },
  buttonRow: {
    marginTop: 20,
  },
  unsureContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  helperText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
    lineHeight: 18,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  unsureOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  radioCircleSelected: {
    borderColor: "#4A6FA5",
    backgroundColor: "#4A6FA5",
    shadowColor: "#4A6FA5",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  unsureText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
    letterSpacing: -0.2,
  },
  unsureTextSelected: {
    color: "#4A6FA5",
    fontWeight: "600",
  },
});