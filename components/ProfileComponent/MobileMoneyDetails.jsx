import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import COLORS from "../../constants/Colors";

const MobileMoneyDetails = ({ onDetailsSubmit }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const providers = [
    { label: "Select Provider", value: "" },
    { label: "MTN Mobile Money", value: "MTN Mobile Money" },
    { label: "Telecel/Vodafone Cash", value: "Vodafone Cash" },
    { label: "AirtelTigo Money", value: "AirtelTigo Money" },
  ];

  const handleSubmit = () => {
    if (!accountNumber || !provider || !accountName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    onDetailsSubmit({ accountNumber, provider, accountName });
  };

  const isSubmitEnabled = accountNumber && provider && accountName;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Mobile Money Details</Text>
      <TextInput
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{provider || "Select Provider"}</Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <ScrollView style={styles.dropdownList}>
          {providers.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={styles.dropdownItem}
              onPress={() => {
                setProvider(p.value);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TextInput
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        placeholder="Account Name"
        value={accountName}
        onChangeText={setAccountName}
      />
      <TouchableOpacity
        style={[styles.submitButton, !isSubmitEnabled && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        <Text style={styles.submitButtonText}>Submit Mobile Money Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownList: {
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 10,
    maxHeight: 150, // Limit height for scrolling
    marginBottom: 12,
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 10,
    width: "100%", // Match the width of the dropdown
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#28a745", // Green background for active button
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc", // Light gray for inactive button
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MobileMoneyDetails;
