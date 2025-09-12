import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatPrice } from "../../assets/data/itemData";

const SelectedItem = ({ item, price, onUpdateQuantity, onRemoveItem }) => {
  const totalItemPrice = price * item.quantity;

  return (
    <View style={styles.selectedItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleContainer}>
          <MaterialIcons name="check-circle" size={18} color="#4f46e5" />
          <Text
            style={styles.itemName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.category}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onRemoveItem(item.id)}
          style={styles.removeButtonIcon}
        >
          <MaterialIcons name="delete-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.priceInfo}>
          <Text style={styles.unitPrice}>${formatPrice(price)} each</Text>
          <Text style={styles.itemPrice}>${formatPrice(totalItemPrice)}</Text>
        </View>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, -1)}
            style={styles.quantityBtn}
          >
            <MaterialIcons name="remove" size={18} color="#4f46e5" />
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, 1)}
            style={styles.quantityBtn}
          >
            <MaterialIcons name="add" size={18} color="#4f46e5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectedItem;

const styles = StyleSheet.create({
  selectedItem: {
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a8a",
    marginLeft: 8,
    maxWidth: "85%",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceInfo: {
    flex: 1,
  },
  unitPrice: {
    fontSize: 14,
    color: "#6b7280",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
    minWidth: 20,
  },
  // New compact remove button
  removeButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
  },
});
