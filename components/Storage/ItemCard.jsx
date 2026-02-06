import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
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
          <Image source={{ uri: item.image }} style={styles.image} />
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
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        ) : (
          <View style={styles.counter}>
            <Pressable onPress={onDecrease} style={styles.controlButton}>
              <Text style={styles.controlText}>−</Text>
            </Pressable>

            <Text style={styles.qty}>{selectedItem.quantity}</Text>

            <Pressable onPress={onIncrease} style={styles.controlButton}>
              <Text style={styles.controlText}>+</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Image Preview Modal */}
      <Modal visible={preview} transparent animationType="fade">
        <Pressable style={styles.modal} onPress={() => setPreview(false)}>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },

  cardSelected: {
    borderColor: COLORS.success,
    backgroundColor: "#f0fdf4",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
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
    color: COLORS.primary,
  },

  priceDetail: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textMuted,
  },

  // Add button (smaller size)
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "600",
    marginTop: -2,
  },

  // Counter (smaller size)
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderRadius: 18,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },

  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
  },

  controlText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: -1,
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

  modalContent: {
    width: "90%",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
    borderRadius: 12,
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