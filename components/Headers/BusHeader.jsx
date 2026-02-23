import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../constants/Colors";

const BusHeader = ({ bus }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={COLORS.textDark} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{bus.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {bus.route.from}  →  {bus.route.to}
        </Text>
      </View>
      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>GH₵ {bus.price}</Text>
        <Text style={styles.perSeat}>/seat</Text>
      </View>
    </View>
  );
};

export default BusHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F4F6FB",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: COLORS.button + "18",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.button,
  },
  perSeat: {
    fontSize: 10,
    color: COLORS.button,
    marginLeft: 2,
    fontWeight: "500",
  },
});