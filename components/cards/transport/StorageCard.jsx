import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { QuantityStepper } from "../../ui";
import { colors } from "../../../constants/theme";

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
          <QuantityStepper value={quantity} onIncrease={() => onUpdate(item.name, quantity + 1)} onDecrease={() => onUpdate(item.name, quantity - 1)} label={item.name} />

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
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brand + "08",
  },

  // Image
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.fill,
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
    backgroundColor: colors.brand,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.textInverse,
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
    color: colors.text,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.brand,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  luggageInfo: {
    fontSize: 11,
    color: colors.brand,
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
    backgroundColor: colors.brand,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: colors.fill,
  },
  qty: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    minWidth: 18,
    textAlign: "center",
  },
  subtotal: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
});