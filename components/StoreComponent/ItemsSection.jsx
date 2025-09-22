import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ItemsSection = ({ items }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Items for Storage</Text>
      
      {items?.length > 0 ? (
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>₵{item.unitPrice}</Text>
              </View>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemTotal}>
                Total: ₵{(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No items listed for this booking</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#17a2b8",
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#17a2b8",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#28a745",
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontStyle: 'italic',
  },
});

export default ItemsSection;