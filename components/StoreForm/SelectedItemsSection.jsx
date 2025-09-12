import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { itemPricing } from "../../assets/data/itemData";
import { formatPrice } from "../../assets/data/itemData";

const SelectedItemsSection = ({ formData }) => {
  const calculateTotalCost = () => {
    let cost = 0;
    (formData.items || []).forEach((item) => {
      const unitPrice = itemPricing[item.category] || 0;
      cost += unitPrice * item.quantity;
    });
    return formatPrice(cost);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Selected Items</Text>

      {(formData.items || []).length > 0 ? (
        <View style={styles.selectedItemsContainer}>
          {(formData.items || []).map((item) => (
            <View key={item.id} style={styles.selectedItem}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.category}</Text>
                <Text style={styles.itemPrice}>
                  GHc {formatPrice(itemPricing[item.category] * item.quantity)}
                </Text>
              </View>

              <View style={styles.itemControls}>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityLabel}>Qty:</Text>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>

                <View style={styles.unitPriceDisplay}>
                  <Text style={styles.unitPriceLabel}>Unit:</Text>
                  <Text style={styles.unitPriceText}>
                    GHc {formatPrice(itemPricing[item.category])}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Estimated Cost</Text>
            <Text style={styles.totalAmount}>GHc {calculateTotalCost()}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items selected</Text>
        </View>
      )}

      {formData.specialRequirements?.length > 0 && (
        <View style={styles.specialRequirements}>
          <Text style={styles.specialRequirementsTitle}>Special Requirements</Text>
          <Text style={styles.specialRequirementsText}>
            {formData.specialRequirements.join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderColor: "#ddd", // Light gray separator
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333", // Dark gray title
  },
  selectedItemsContainer: {
    marginTop: 10,
  },
  selectedItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: "#eee", // Very light gray separator between items
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    color: "#222", // Dark gray text
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222", // Dark gray bold price
  },
  itemControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  quantityDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontWeight: "bold",
    color: "#555", // Medium gray label
    fontSize: 14,
  },
  quantityText: {
    marginLeft: 6,
    color: "#555", // Medium gray text
    fontSize: 14,
  },
  unitPriceDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitPriceLabel: {
    fontWeight: "bold",
    color: "#555", // Medium gray label
    fontSize: 14,
  },
  unitPriceText: {
    marginLeft: 6,
    color: "#555", // Medium gray text
    fontSize: 14,
  },
  totalContainer: {
    marginTop: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd", // Light gray top border
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333", // Dark gray total label
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000", // Black total amount
  },
  emptyState: {
    padding: 10,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#777", // Medium-light gray empty state text
    fontSize: 14,
  },
  specialRequirements: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd", // Light gray top border for requirements
  },
  specialRequirementsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#333", // Dark gray title
  },
  specialRequirementsText: {
    fontSize: 14,
    color: "#444", // Slightly darker gray text
  },
});

export default SelectedItemsSection;