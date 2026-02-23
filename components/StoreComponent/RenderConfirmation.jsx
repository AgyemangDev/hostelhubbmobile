import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "../../assets/Styles/StorageStyles"; // Adjust the path as necessary

const RenderConfirmation = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.navigate("(tabs)");
  };

  return (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationCircle}>
        <Text style={styles.checkmarkLarge}>✓</Text>
      </View>
      <Text style={styles.confirmationTitle}>Reservation Submitted!</Text>
      <Text style={styles.confirmationText}>
        Your storage reservation has been successfully submitted. You will
        receive a confirmation email shortly with details about your
        reservation.
      </Text>

      {/* Button to return to Tabs/Home */}
      <TouchableOpacity
        style={styles.confirmationButton}
        onPress={handleGoBack}
      >
        <Text style={styles.confirmationButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderConfirmation;
