import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatPrice } from "../../assets/data/itemData";

const TotalCostDisplay = ({ totalCost }) => {
  return (
    <View style={styles.totalContainer}>
      <View style={styles.totalLabelContainer}>
        <MaterialIcons name="account-balance-wallet" size={20} color="#0c4a6e" />
        <Text style={styles.totalLabel}>Total Estimated Cost</Text>
      </View>
      <Text style={styles.totalAmount}>GHc {formatPrice(totalCost)}</Text>
    </View>
  );
};

export default TotalCostDisplay;

const styles = StyleSheet.create({
  totalContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0c4a6e",
    marginLeft: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0284c7",
  },
});