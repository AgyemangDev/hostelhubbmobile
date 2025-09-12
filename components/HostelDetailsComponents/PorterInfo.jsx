import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors"; // Assuming you have a COLORS constant

const PorterInfo = ({ porter = "Unknown", contact = "", onCallPress = () => {} }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Porter Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{porter}</Text>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => onCallPress?.(contact)}
        >
          <MaterialIcons name="phone" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.primaryText || "#333", // Use color from your theme
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    color: COLORS.primaryText || "#333", // Use color from your theme
  },
  callButton: {
    backgroundColor: COLORS.callButton || "#4CAF50", // Use a dedicated call button color
    width: 40,
    height: 40,
    borderRadius: 20, // Makes it a circle
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PorterInfo;