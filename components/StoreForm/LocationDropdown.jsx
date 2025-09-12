import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

const LocationDropdown = ({ label, value, onChange, options, required = false }) => {
  return (
    <>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.container}>
        <MaterialIcons name="location-on" size={22} color="#4A6FA5" style={styles.icon} />
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
        >
          <Picker.Item label="Select a location..." value="" />
          {options.map((loc, index) => (
            <Picker.Item key={index} label={loc} value={loc} />
          ))}
        </Picker>
      </View>
    </>
  );
};

export default LocationDropdown;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#4A5568",
  },
  required: {
    color: "#E53E3E",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "#F9FAFC",
    marginBottom: 12,
    paddingRight: 10,
  },
  icon: {
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    marginLeft: 5,
  },
});
