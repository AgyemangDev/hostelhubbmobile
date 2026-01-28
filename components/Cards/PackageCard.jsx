import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {EXPECTED_PRICES} from "../../assets/data/DisplayPrices"


const PackageCard = ({ data_volume, price, netprovider, onPress }) => {
  const provider = netprovider.toLowerCase();

  const getBonus = (volume) => {
    const gb = parseInt(volume);
    return null;
  };

  const bonus = getBonus(data_volume);

const getPercentageOff = (provider, volume, displayPrice) => {
  const normalizedProvider = provider.toUpperCase();
  const normalizedVolume = String(volume);
  const normalizedPrice = Number(displayPrice);

  const expected =
    EXPECTED_PRICES?.[normalizedProvider]?.[normalizedVolume];

  if (!expected || !normalizedPrice) return null;

  if (normalizedPrice >= expected) return null;

  const percentage = Math.round(
    ((expected - normalizedPrice) / expected) * 100
  );

  return percentage > 0 ? `${percentage}% OFF` : null;
};
console.log({
  provider,
  volume: String(data_volume),
  price: Number(price),
  expected: EXPECTED_PRICES?.[provider.toUpperCase()]?.[String(data_volume)]
});

const discount = getPercentageOff(
  netprovider,
  data_volume,
  price
);

  const stylesMap = {
    mtn: { backgroundColor: "#FACC15", borderColor: "#FBBF24" },
    telecel: { backgroundColor: "#EF4444", borderColor: "#F87150" },
    default: { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB" },
  };

  const cardStyle = stylesMap[provider] || stylesMap.default;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardStyle.backgroundColor, borderColor: cardStyle.borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Bundle</Text>
<View style={styles.headerRight}>
  <View style={styles.label}>
    <Text style={styles.labelText}>non expiry</Text>
  </View>

  {discount && (
    <View style={[styles.label, { backgroundColor: "#16A34A" }]}>
      <Text style={[styles.labelText, { color: "#fff" }]}>
        {discount}
      </Text>
    </View>
  )}

  {bonus && (
    <View style={[styles.label, { backgroundColor: "#22C55E" }]}>
      <Text style={[styles.labelText, { color: "#fff" }]}>
        {bonus}
      </Text>
    </View>
  )}
</View>

      </View>

      <View style={styles.body}>
        <View style={styles.bodyRow}>
          <View style={styles.bodyItem}>
            <Text style={styles.bodyLabel}>Data</Text>
            <Text style={styles.bodyValue}>{data_volume} GB</Text>
          </View>
          <View style={styles.bodyItem}>
            <Text style={styles.bodyLabel}>Cost</Text>
            <Text style={styles.bodyValue}>GHS {price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PackageCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#111" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { backgroundColor: "rgba(255,255,255,0.8)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  labelText: { fontSize: 10, fontWeight: "500", textTransform: "uppercase", color: "#111" },
  body: { backgroundColor: "rgba(255,255,255,0.85)", paddingHorizontal: 16, paddingVertical: 10 },
  bodyRow: { flexDirection: "row", justifyContent: "space-between" },
  bodyItem: {},
  bodyLabel: { fontSize: 10, fontWeight: "500", color: "#6B7280", marginBottom: 2 },
  bodyValue: { fontSize: 16, fontWeight: "500", color: "#111" },
});
