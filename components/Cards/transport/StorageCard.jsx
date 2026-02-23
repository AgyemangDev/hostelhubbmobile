import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";

const StorageCard = ({ item, quantity, onUpdate }) => {
  const isLuggage = item.name === "Luggage";

  return (
    <View style={[styles.card, quantity > 0 && styles.cardSelected]}>
      {/* Left — image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {quantity > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{quantity}</Text>
          </View>
        )}
      </View>

      {/* Right — info + controls */}
      <View style={styles.right}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        {isLuggage ? (
          <Text style={styles.luggageInfo}>Free 40KG · extras charged on boarding</Text>
        ) : (
          <Text style={styles.price}>
            GH₵{item.price}
            <Text style={styles.priceUnit}> / each</Text>
          </Text>
        )}

        <View style={styles.controls}>
          <Pressable
            onPress={() => onUpdate(item.name, quantity - 1)}
            disabled={quantity === 0}
            style={[styles.btn, quantity === 0 && styles.btnDisabled]}
            hitSlop={6}
          >
            <Ionicons name="remove" size={16} color={quantity === 0 ? "#ccc" : COLORS.textDark} />
          </Pressable>

          <Text style={styles.qty}>{quantity}</Text>

          <Pressable
            onPress={() => onUpdate(item.name, quantity + 1)}
            style={styles.btn}
            hitSlop={6}
          >
            <Ionicons name="add" size={16} color={COLORS.white} />
          </Pressable>

          {quantity > 0 && !isLuggage && (
            <Text style={styles.subtotal}>GH₵{quantity * item.price}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default StorageCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "08",
  },

  // Image
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F4F6FB",
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },

  // Right side
  right: {
    flex: 1,
    justifyContent: "space-between",
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6B7280",
  },
  luggageInfo: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "500",
  },

  // Stepper
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  qty: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    minWidth: 18,
    textAlign: "center",
  },
  subtotal: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },
});