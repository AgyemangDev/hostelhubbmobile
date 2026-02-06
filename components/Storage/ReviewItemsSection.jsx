"use client";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

export default function ReviewItemsSection({ items }) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Ionicons name="cube-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Items ({items.length})</Text>
      </View>

      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.itemRow,
            index === items.length - 1 && styles.lastRow,
          ]}
        >
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.image} />
          )}

          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.qty}>Quantity: {item.quantity}</Text>
          </View>

          <Text style={styles.price}>
            GH₵{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  qty: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
});