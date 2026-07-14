import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

export default function ItemCard({
  item,
  selectedItem,
  onSelect,
  onIncrease,
  onDecrease,
}) {
  const [preview, setPreview] = useState(false);
  const isSelected = !!selectedItem;

  // Calculate display price
  const displayPrice = isSelected && selectedItem.quantity > 1
    ? item.price * selectedItem.quantity
    : item.price;

  return (
    <>
      <View style={[
        styles.card,
        isSelected && styles.cardSelected
      ]}>
        {/* Image */}
        <Pressable onPress={() => setPreview(true)}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        </Pressable>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>
            GH₵{displayPrice.toFixed(2)}
            {isSelected && selectedItem.quantity > 1 && (
              <Text style={styles.priceDetail}>
                {" "}(₵{item.price} × {selectedItem.quantity})
              </Text>
            )}
          </Text>
        </View>

        {/* Action Button */}
        {!isSelected ? (
          <Pressable onPress={onSelect} style={styles.addButton}>
            <Ionicons name="add" size={20} color={COLORS.white} />
          </Pressable>
        ) : (
          <View style={styles.counter}>
            <Pressable onPress={onDecrease} style={styles.controlButton}>
              <Ionicons name="remove" size={16} color={COLORS.white} />
            </Pressable>

            <Text style={styles.qty}>{selectedItem.quantity}</Text>

            <Pressable onPress={onIncrease} style={styles.controlButton}>
              <Ionicons name="add" size={16} color={COLORS.white} />
            </Pressable>
          </View>
        )}
      </View>

      {/* Image Preview Modal */}
      <Modal visible={preview} transparent animationType="fade">
        <Pressable style={styles.modal} onPress={() => setPreview(false)}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setPreview(false)}
            hitSlop={12}
          >
            <Ionicons name="close" size={22} color={COLORS.white} />
          </Pressable>

          <View style={styles.modalContent}>
            <Image source={{ uri: item.image }} style={styles.fullImage} />
            <Text style={styles.modalName}>{item.name}</Text>
            <Text style={styles.modalPrice}>GH₵{item.price.toFixed(2)}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const TEAL_TINT = "#EAF6F3"; // light tint of COLORS.teal for selected background

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },

  cardSelected: {
    borderColor: COLORS.teal,
    backgroundColor: TEAL_TINT,
    shadowColor: COLORS.teal,
    shadowOpacity: 0.15,
  },

  imageWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },

  image: {
    width: 70,
    height: 70,
  },

  content: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 20,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.teal,
  },

  priceDetail: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textMuted,
  },

  // Add button
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.teal,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  // Counter
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: TEAL_TINT,
    borderRadius: 20,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#d5ede8",
  },

  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.teal,
    justifyContent: "center",
    alignItems: "center",
  },

  qty: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    minWidth: 18,
    textAlign: "center",
  },

  // Modal styles
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 56,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  modalContent: {
    width: "90%",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
    borderRadius: 16,
  },

  modalName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 20,
    textAlign: "center",
  },

  modalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.gold,
    marginTop: 8,
  },
});