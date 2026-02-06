"use client";
import { View, Text, Image, StyleSheet } from "react-native";
import COLORS from "../../constants/Colors";

export default function ReviewSummarySection({ items, groupImage }) {
  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <View style={styles.section}>
      {groupImage?.uri && (
        <Image source={{ uri: groupImage.uri }} style={styles.image} />
      )}

      <Text style={styles.title}>Payment Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text>GH₵{total.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Service Fee</Text>
        <Text>GH₵0.00</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>GH₵{total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  image: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  total: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },
});