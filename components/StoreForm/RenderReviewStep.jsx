import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ReviewCard from "./ReviewCard";
import PersonalInfoSection from "./PersonalInfoSection";
import ReservationDetailsSection from "./ReservationDetailsSection";
import SelectedItemsSection from "./SelectedItemsSection";
import TermsAgreement from "./TermsAgreement";
import NavigationButtons from "./PaymentButtons";

const RenderReviewStep = ({ handleSubmit, handleInputChange, formData, prevStep }) => {
  return (
    <ScrollView style={styles.container}>
      <ReviewCard>
        <Text style={styles.header}>Review Your Reservation</Text>
        <Text style={styles.subText}>Please confirm your details before making payment</Text>

        <PersonalInfoSection formData={formData} />
        <ReservationDetailsSection formData={formData} />
        <SelectedItemsSection formData={formData} />
        <TermsAgreement formData={formData} handleInputChange={handleInputChange} />
        <NavigationButtons formData={formData} handleSubmit={handleSubmit} prevStep={prevStep} />
      </ReviewCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a2b4b",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
});

export default RenderReviewStep;
