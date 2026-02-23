import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import styles from "../../assets/Styles/StorageStyles";
import { Picker } from "@react-native-picker/picker";

const RenderPersonalInfoStep = ({
  formData,
  setFormData,
  nextStep,
  handleInputChange,
}) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <Text style={styles.inputLabel}>First Name *</Text>
      <TextInput
        style={styles.textInput}
        value={formData.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        placeholder="Enter your first name"
      />

      <Text style={styles.inputLabel}>Last Name *</Text>
      <TextInput
        style={styles.textInput}
        value={formData.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        placeholder="Enter your last name"
      />

      <Text style={styles.inputLabel}>Email Address *</Text>
      <TextInput
        style={styles.textInput}
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        placeholder="Enter your email address"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.inputLabel}>Phone Number</Text>
      <TextInput
        style={styles.textInput}
        value={formData.phone}
        onChangeText={(text) => handleInputChange("phone", text)}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RenderPersonalInfoStep;
