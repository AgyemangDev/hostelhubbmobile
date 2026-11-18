import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StorageCard from "../../../../components/cards/transport/StorageCard";
import { storageItems, luggageItem } from "../../../../assets/data/transport/storageItem";
import { Button } from "../../../../components/ui";
import { colors } from "../../../../constants/theme";

const ALL_ITEMS = [luggageItem, ...storageItems];

const StorageCompartment = () => {
  const { bus: busParam, selectedSeats: seatsParam, totalPrice:seatPrice } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [quantities, setQuantities] = useState({});

  const updateQuantity = (name, value) => {
    setQuantities((prev) => ({ ...prev, [name]: Math.max(0, value) }));
  };

  const storageFee = storageItems.reduce(
    (sum, item) => sum + (quantities[item.name] || 0) * item.price, 0
  );
  const hasLuggage = (quantities[luggageItem.name] || 0) > 0;
  const storageTotalPrice = storageFee + (hasLuggage ? 10 : 0);
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const seatTotalNum = parseFloat(seatPrice) || 0;
  const grandTotal = seatTotalNum + storageTotalPrice;

  const handleContinue = () => {
    router.push({
      pathname: "/(categories)/(transport)/legacy/PaymentScreen",
      params: {
        bus: busParam,
        selectedSeats: seatsParam,
        seatPrice,
        storageItems: JSON.stringify(quantities),
        storageTotalPrice,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Luggage & Storage</Text>
          <Text style={styles.subtitle}>
            Free 40KG included · extra weight charged on boarding
          </Text>
        </View>

        {ALL_ITEMS.map((item) => (
          <StorageCard
            key={item.name}
            item={item}
            quantity={quantities[item.name] || 0}
            onUpdate={updateQuantity}
          />
        ))}

        {/* Order Summary */}
        {totalItems > 0 && (
          <View style={styles.summary}>
            <View style={styles.summaryHeader}>
              <Ionicons name="receipt-outline" size={18} color={colors.brand} />
              <Text style={styles.summaryTitle}>Order Summary</Text>
            </View>

            {Object.entries(quantities).map(([name, qty]) =>
              qty > 0 ? (
                <View key={name} style={styles.summaryRow}>
                  <Text style={styles.summaryText}>{name} × {qty}</Text>
                  {name !== "Luggage" && (
                    <Text style={styles.summaryText}>
                      GH₵{storageItems.find((i) => i.name === name)?.price * qty}
                    </Text>
                  )}
                </View>
              ) : null
            )}

            {hasLuggage && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHandling}>Luggage handling fee</Text>
                <Text style={styles.summaryHandling}>GH₵10</Text>
              </View>
            )}

            <View style={styles.summaryTotalRow}>
              <Text style={styles.totalLabel}>Storage total</Text>
              <Text style={styles.totalAmount}>GH₵{storageTotalPrice}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[
        styles.footer,
        { paddingBottom: insets.bottom || (Platform.OS === "android" ? 16 : 12) },
      ]}>
        {/* Price breakdown row */}
        <View style={styles.priceBreakdown}>
          <View style={styles.priceItem}>
            <Text style={styles.priceItemLabel}>Seats</Text>
            <Text style={styles.priceItemValue}>GH₵{seatTotalNum}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceItem}>
            <Text style={styles.priceItemLabel}>Storage</Text>
            <Text style={styles.priceItemValue}>GH₵{storageTotalPrice}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceItem}>
            <Text style={[styles.priceItemLabel, styles.grandLabel]}>Total</Text>
            <Text style={[styles.priceItemValue, styles.grandValue]}>GH₵{grandTotal}</Text>
          </View>
        </View>

        {/* Continue button */}
        <Button title="Continue" icon="arrow-forward" iconPosition="right" onPress={handleContinue} />
      </View>
    </View>
  );
};

export default StorageCompartment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSunken },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32, gap: 12 },

  header: { marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textSecondary },

  // Summary card
  summary: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    marginTop: 4,
  },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  summaryTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryText: { fontSize: 13, color: colors.textSecondary },
  summaryHandling: { fontSize: 13, fontWeight: "500", color: colors.brand },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: colors.text },
  totalAmount: { fontSize: 16, fontWeight: "800", color: colors.brand },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },

  // Price breakdown pill row
  priceBreakdown: {
    flexDirection: "row",
    backgroundColor: colors.fill,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  priceItemLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceItemValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  priceDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.fill,
  },
  grandLabel: {
    color: colors.brand,
  },
  grandValue: {
    fontSize: 16,
    color: colors.brand,
  },

  // Button
  btn: {
    backgroundColor: colors.brand,
    paddingVertical: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    color: colors.textInverse,
    fontWeight: "700",
    fontSize: 16,
  },
});