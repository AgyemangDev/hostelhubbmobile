import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ItemsSection = ({ items }) => {
  return (
    <View style={styles.section}>
      {items?.length > 0 ? (
        items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <View style={styles.categoryRow}>
                <Ionicons name="cube-outline" size={16} color="#6B7280" />
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.itemPrice}>₵{item.unitPrice}</Text>
              <Text style={styles.itemTotal}>
                ₵{(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="file-tray-outline" size={32} color="#D1D5DB" />
          <Text style={styles.emptyText}>No items listed</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 24,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#047857",
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
});

export default ItemsSection;