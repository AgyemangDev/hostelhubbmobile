import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";

const TermsAgreement = ({ formData, handleInputChange }) => {
  const handleOpenLink = () => {
    Linking.openURL("https://hostelhubb.com/storage-terms");
  };

  return (
    <View style={styles.termsContainer}>
      <TouchableOpacity
        style={styles.termsRow}
        onPress={() =>
          handleInputChange("agreeToTerms", !formData.agreeToTerms)
        }
      >
        <View
          style={[
            styles.checkbox,
            formData.agreeToTerms && styles.checkboxChecked,
          ]}
        >
          {formData.agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <Text style={styles.termsTextWrapper}>
          I agree to the{" "}
          <Text style={styles.linkText} onPress={handleOpenLink}>
            terms and conditions
          </Text>{" "}
          of Hostelhubb Storage Reservation Service
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 20,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 3,
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  termsTextWrapper: {
    fontSize: 14,
    color: "#444",
    flex: 1,
    flexWrap: "wrap",
  },
  linkText: {
    color: "#2563eb", // blue-600 for good UX
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});

export default TermsAgreement;
