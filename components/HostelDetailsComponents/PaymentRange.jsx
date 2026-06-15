import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ROOM_CONFIG = {
  Apartment:    { icon: "home-outline",          color: "#185FA5", bg: "#E6F1FB", popular: false },
  OneInARoom:   { icon: "person-outline",        color: "#0F6E56", bg: "#E1F5EE", popular: true  },
  TwoInARoom:   { icon: "people-outline",        color: "#0F6E56", bg: "#E1F5EE", popular: true  },
  ThreeInARoom: { icon: "people-outline",        color: "#854F0B", bg: "#FAEEDA", popular: false },
  FourInARoom:  { icon: "people-circle-outline", color: "#5F5E5A", bg: "#F1EFE8", popular: false },
};

const ROOM_ORDER = ["Apartment", "OneInARoom", "TwoInARoom", "ThreeInARoom", "FourInARoom"];

const formatRoomName = (key) => key.replace(/([A-Z])/g, " $1").trim();

const PaymentRange = ({ paymentRanges }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Accommodation pricing</Text>

      {ROOM_ORDER.map((roomType) => {
        const options = paymentRanges[roomType];
        if (!options?.length) return null;

        const config = ROOM_CONFIG[roomType] ?? {
          icon: "bed-outline",
          color: "#5F5E5A",
          bg: "#F1EFE8",
          popular: false,
        };

        return (
          <View
            key={roomType}
            style={[styles.card, config.popular && styles.cardFeatured]}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={18} color={config.color} />
              </View>
              <Text style={styles.roomName}>{formatRoomName(roomType)}</Text>
              <View style={[
                styles.badge,
                config.popular ? styles.badgePopular : styles.badgeNeutral
              ]}>
                <Text style={[
                  styles.badgeText,
                  config.popular ? styles.badgeTextPopular : styles.badgeTextNeutral
                ]}>
                  {config.popular ? "Popular" : "Available"}
                </Text>
              </View>
            </View>

            {/* Options */}
            <View style={styles.optionsWrap}>
              {options.map((opt, i) => (
                <View key={i} style={styles.optionRow}>
                  <View style={styles.optLeft}>
                    <Text style={styles.optDesc}>{opt.description}</Text>
                  </View>
                  <View style={styles.optRight}>
                    <Text style={styles.perLabel}>Per year</Text>
                    <Text style={styles.priceVal}>
                      GHc {(parseFloat(opt.price) * 1.05).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const TEAL = "#0F6E56";
const TEAL_BG = "#E1F5EE";

const styles = StyleSheet.create({
  container: { marginVertical: 24 },

  sectionLabel: {
    fontSize: 11,
    color: "#888",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    marginBottom: 10,
    overflow: "hidden",
  },
  cardFeatured: {
    borderWidth: 2,
    borderColor: TEAL,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  roomName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgePopular: { backgroundColor: TEAL_BG },
  badgeNeutral: { backgroundColor: "#F1F1F1" },
  badgeText: { fontSize: 11, fontWeight: "500" },
  badgeTextPopular: { color: TEAL },
  badgeTextNeutral: { color: "#888" },

  optionsWrap: { padding: 10, gap: 8 },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 10,
  },

  optLeft: { flex: 1, paddingRight: 12 },
  optDesc: { fontSize: 13, fontWeight: "500", color: "#222" },

  optRight: { alignItems: "flex-end" },
  perLabel: { fontSize: 10, color: "#999" },
  priceVal: { fontSize: 16, fontWeight: "500", color: TEAL },
});

export default PaymentRange;