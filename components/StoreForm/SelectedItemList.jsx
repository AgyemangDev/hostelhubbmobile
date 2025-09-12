import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectedItem from "./SelectedItem";
const SelectedItemsList = ({ items, pricing, onUpdateQuantity, onRemoveItem }) => {
  return (
    <View style={styles.selectedItemsContainer}>
      <Text style={styles.sectionTitle}>Your Selected Items</Text>
      {items.map((item) => (
        <SelectedItem
          key={item.id}
          item={item}
          price={pricing[item.category]}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </View>
  );
};

export default SelectedItemsList;

const styles = StyleSheet.create({
  selectedItemsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a2b4b",
    marginBottom: 16,
  },
});
